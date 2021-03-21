import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import { exec } from 'child_process';
import kill from 'tree-kill';
import https from 'https';
import OBSWebSocket from 'obs-websocket-js';

import {
  mapNickToName,
  createPictureInfo,
  request,
  sleep,
  convertPUUIDtoID,
  spectateGame,
  setUpSpectateIngameInitialSetting,
  createProIDs,
  findMatch,
  modifyChannelInfo,
  checkStreaming,
  fixSpectateView,
  stopSpectate,
} from './Method';
import { Heap } from './DataStructure';
import Constants from './Constants';

import { EventData, PlayerList } from './types';

type NAME = keyof typeof Constants.PRIORITIES;

config();

const { RIOT_API_KEY } = process.env;
const picturePath = join('..', 'assets');

let isStreaming = false; // twitch api로 조정할 수 있으면 좋음
let isSpectating = false;
let spectateRank: number = Constants.NONE; // -1: none 0: faker 1: 1군 2: 2군 3: 프로 챌린저
let encryptionKey = '';
let gameId: number = Constants.NONE;
let peopleCount: number = Constants.NONE;
let lastSpectateTime = new Date().valueOf();
let nickMap: Map<string, string> | null = null;
let pictures: string[] | null = null;
let pictureMap: Map<string, number> | null = null;
let idPriority: string[][] | null = null;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  cert: readFileSync(join(__dirname, '..', 'assets', 'riotgames.pem')),
});

const pq = new Heap<{ name: string; playerIndex: number }>(true);

export default async (
  gameWaitLimitMinute: number,
  gameTimeLimitMinute: number,
  spectateWaitLimitMinute: number
) => {
  const gameWaitLimit = gameWaitLimitMinute * 60 * 1000;
  const gameTimeLimit = gameTimeLimitMinute * 60 * 1000;
  const spectateWaitLimit = spectateWaitLimitMinute * 60 * 1000;
  const obs = new OBSWebSocket();
  //await obs.connect({ address: 'localhost:4444' });

  // 초기화 작업
  while (nickMap === null) {
    try {
      nickMap = await mapNickToName();
    } catch (error) {
      console.log(error);
    }
  }
  while (pictures === null || pictureMap === null) {
    try {
      ({ pictures, pictureMap } = await createPictureInfo());
    } catch (error) {
      console.log(error);
    }
  }
  while (idPriority === null) {
    try {
      idPriority = await convertPUUIDtoID(nickMap);
    } catch (error) {
      console.log(error);
    }
  }
  try {
    const ids = await createProIDs(nickMap);
    idPriority.push(ids);
  } catch (error) {}
  let isProStreaming = false;
  try {
    isProStreaming = await checkStreaming(...Constants.PRO_STREAMING_IDS);
  } catch (error) {
    console.log(error);
  }
  // Tasks
  while (true) {
    // 프로 방송중이면 대기
    while (isProStreaming) {
      try {
        isProStreaming = await checkStreaming(...Constants.PRO_STREAMING_IDS);
        await sleep(60 * 1000);
      } catch (error) {
        console.log(error);
      }
    }
    // 현재 게임중인 프로 확인 과정
    while (spectateRank === Constants.NONE) {
      try {
        /* FIXME:
        const rankLimit = isStreaming
          ? idPriority.length
          : idPriority.length - 1;
          */
        const rankLimit = idPriority.length;
        ({ encryptionKey, gameId, spectateRank, peopleCount } = await findMatch(
          rankLimit,
          idPriority
        ));
      } catch (error) {
        console.log(error);
      }
      // 방송중인데 오래 팀 프로관전을 못하면 방송 종료
      if (
        isStreaming &&
        new Date().valueOf() - lastSpectateTime > spectateWaitLimit
      ) {
        isStreaming = false;
        // FIXME: await obs.send('StopStreaming'); // 스트리밍 종료
      }
    }
    // 매치 발견했을 때 방송이 켜져있거나 꺼져있거나
    if (!isStreaming) {
      // 방송켜고 설정
      //FIXME: await obs.send('StartStreaming', {}); // 스트리밍 시작
    }
    const gameProcess = spectateGame(encryptionKey, gameId);
    gameProcess.unref();
    const startTime = new Date().valueOf();
    //
    const infos = []; //  여기에 pro name과 pro 사진 매칭정보를 저장
    while (!isSpectating && new Date().valueOf() - startTime < gameWaitLimit) {
      try {
        await sleep(1000);
        const { data } = await request<PlayerList>(
          'get',
          Constants.PLAYERLIST_URL,
          {
            httpsAgent,
          }
        );
        if (data.length !== peopleCount) {
          continue;
        }
        let redStart: number = Constants.NONE;
        for (let index = 0; index < data.length; index++) {
          const { summonerName, team } = data[index];
          if (team === 'CHAOS' && redStart === Constants.NONE) {
            redStart = index;
          }
          if (nickMap.has(summonerName)) {
            // 프로와 매핑
            const name = nickMap.get(summonerName)!;
            if (pictureMap.has(name)) {
              const picIndex = pictureMap.get(name)!;
              // pictures[picIndex] obs에 맞는 코드
            }
            if (name in Constants.PRIORITIES) {
              pq.add(Constants.PRIORITIES[name as NAME], {
                name,
                playerIndex: team === 'ORDER' ? index : 5 + (index - redStart),
              });
            }
          }
        }
        isSpectating = true;
      } catch {}
    }
    //
    if (!isSpectating) {
      spectateRank = Constants.NONE;
      continue;
    }
    let selectedIndex: number = 2; //FIXME: Constants.NONE
    const proNames: string[] = [];
    while (!pq.isEmpty()) {
      const [, { name, playerIndex }] = pq.remove();
      proNames.push(name);
      if (selectedIndex === Constants.NONE) {
        selectedIndex = playerIndex;
      }
    }
    /*
    await modifyChannelInfo(
      `Tracking Pros: ${proNames.length === 0 ? '' : proNames.join()}`
    );
    */
    // obs 화면 만들고 설정
    // obs 게임창 전환
    // FIXME: 막 시작한 경우 대기시간이 있어서 적용이 안됨
    // TODO: 시간이 흘렀는지 파악해서 해야됨
    let eventIndex = 0;
    let isUnusualExit = false;
    while (isSpectating) {
      await fixSpectateView(selectedIndex);
      await sleep(10 * 1000);
      {
        // 랭크가 낮으면 높은거 있는지 확인
        const data = await findMatch(spectateRank, idPriority);
        if (
          data.spectateRank !== Constants.NONE &&
          data.spectateRank < spectateRank
        ) {
          isSpectating = false;
          ({ encryptionKey, gameId, spectateRank, peopleCount } = data);
        }
      }
      {
        // 게임이 종료되었는지 확인
        try {
          const {
            data: { Events: events },
          } = await request<EventData>('get', Constants.EVENDATA_URL, {
            httpsAgent,
          });
          const size = events.length;
          console.log(events);
          while (eventIndex < size && isSpectating) {
            const event = events[eventIndex];
            if (event.EventID === Constants.GAME_END_ID) {
              isSpectating = false;
              spectateRank = Constants.NONE;
              if (spectateRank < idPriority.length - 1) {
                // 팀의 선수라면 마지막 관전 시간 설정
                lastSpectateTime = new Date().valueOf();
              }
            }
            eventIndex += 1;
          }
          if (eventIndex === 1) {
            await setUpSpectateIngameInitialSetting(selectedIndex);
          }
        } catch {
          console.log('Detected abnormal termination');
          spectateRank = Constants.NONE;
          isSpectating = false;
          isUnusualExit = true;
        }
      }
      {
        // 게임 시간이 너무 오래지났으면 종료
        if (new Date().valueOf() - startTime > gameTimeLimit) {
          isSpectating = false;
          spectateRank = Constants.NONE;
        }
      }
      {
        // twitch api를 통해 현재 방송중인지 확인
        isProStreaming = await checkStreaming(...Constants.PRO_STREAMING_IDS);
        if (isProStreaming) {
          isSpectating = false;
          isStreaming = false;
          spectateRank = Constants.NONE;
          //FIXME: await obs.send('StopStreaming');
        }
      }
      {
        if (new Date().valueOf() - startTime > 5 * 60 * 1000) {
          isSpectating = false;
          spectateRank = Constants.NONE;
        }
      }
    }
    // obs 배경화면으로 전환
    if (!isUnusualExit) {
      stopSpectate(gameProcess);
    }
  }
};
