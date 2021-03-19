import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import https from 'https';

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
} from './Method';
import { Heap } from './DataStructure';

import { CurrentGameInfo, EventData, PlayerList, SummonerDTO } from './types';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'node:constants';

config();

const PLAYERLIST_URL = 'https://127.0.0.1:2999/liveclientdata/playerlist';
const EVENDATA_URL = 'https://127.0.0.1:2999/liveclientdata/eventdata';
const GAME_WAIT_LIMIT = 3 * 60 * 1000;
const GAME_TIME_LIMIT = 90 * 60 * 1000;
const SPECTATE_WAIT_LIMIT = 60 * 60 * 1000;

const { RIOT_API_KEY } = process.env;
const picturePath = join('..', 'assets');

let isBrodcasting = false; // twitch api로 조정할 수 있으면 좋음
let isSpectating = false;
let spectateRank = -1; // -1: none 0: faker 1: 1군 2: 2군 3: 프로 챌린저
let encryptionKey = '';
let gameId = -1;
let lastSpectateTime = new Date().valueOf();
let nickMap: Map<string, string> | null = null;
let pictures: string[] | null = null;
let pictureMap: Map<string, number> | null = null;
let idPriority: string[][] | null = null;

const priorities: { [name: string]: number } = {
  Faker: 0,
  Teddy: 1,
  Cuzz: 2,
  Canna: 3,
  Ellim: 4,
  Gumayusi: 5,
  Keria: 6,
  Zeus: 7,
  Oner: 8,
  Clozer: 9,
  Roach: 9,
  Hoit: 9,
  Mowgli: 9,
  Mireu: 9,
  Berserker: 9,
  Asper: 9,
  Fisher: 9,
};

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  cert: readFileSync(join(__dirname, 'assets', 'riotgames.pem')),
});

const pq = new Heap<{ name: string; playerIndex: number }>();

(async () => {
  // 초기화 작업
  while (nickMap === null) {
    try {
      nickMap = await mapNickToName();
    } catch {}
  }
  while (pictures === null || pictureMap === null) {
    try {
      ({ pictures, pictureMap } = await createPictureInfo());
    } catch {}
  }
  while (idPriority === null) {
    try {
      idPriority = await convertPUUIDtoID(nickMap);
    } catch {}
  }
  const ids = await createProIDs(nickMap);
  idPriority.push(ids);
  // Tasks
  while (true) {
    // 현재 게임중인 프로 확인 과정
    while (spectateRank === -1) {
      const rankLimit = isBrodcasting ? 4 : 3;
      ({ encryptionKey, gameId, spectateRank } = await findMatch(
        rankLimit,
        idPriority
      ));
      // 방송중인데 오래 팀 프로관전을 못하면 방송 종료
      if (
        isBrodcasting &&
        new Date().valueOf() - lastSpectateTime > SPECTATE_WAIT_LIMIT
      ) {
        isBrodcasting = false;
        // 방송종료 코드
      }
    }
    // 매치 발견했을 때 방송이 켜져있거나 꺼져있거나
    if (!isBrodcasting) {
      // 방송켜고 설정
    }
    const gameProcess = spectateGame(encryptionKey, gameId);
    gameProcess.unref();
    const startTime = new Date().valueOf();
    //
    const infos = []; //  여기에 pro name과 pro 사진 매칭정보를 저장
    while (
      !isSpectating &&
      new Date().valueOf() - startTime < GAME_WAIT_LIMIT
    ) {
      try {
        const { data } = await request<PlayerList>('get', PLAYERLIST_URL, {
          httpsAgent,
        });
        let redStart = -1;
        for (let index = 0; index < data.length; index++) {
          const { summonerName, team } = data[index];
          if (team === 'CHAOS' && redStart === -1) {
            redStart = index;
          }
          if (nickMap.has(summonerName)) {
            // 프로와 매핑
            const name = nickMap.get(summonerName)!;
            if (pictureMap.has(name)) {
              const picIndex = pictureMap.get(name)!;
              // pictures[picIndex] obs에 맞는 코드
            }
            if (name in priorities) {
              pq.add(priorities[name], {
                name,
                playerIndex: team === 'ORDER' ? index : 5 + (redStart - index),
              });
            }
          }
        }
        isSpectating = true;
      } catch {
        await sleep(1000);
      }
    }
    //
    if (!isSpectating) {
      spectateRank = -1;
      continue;
    }
    let selectedIndex = -1;
    const proNames: string[] = [];
    while (!pq.isEmpty()) {
      const [, { name, playerIndex }] = pq.remove();
      proNames.push(name);
      if (selectedIndex === -1) {
        selectedIndex = playerIndex;
      }
    }
    // 리스트를 바탕으로 obs 설정 (이름,사진)
    console.log(
      `Tracking Pros: ${proNames.length === 0 ? '' : proNames.join()}`
    ); // 방송 제목
    // 게임창 전환
    await sleep(4000);
    setUpSpectateIngameInitialSetting(selectedIndex);
    let eventIndex = 0;
    while (isSpectating) {
      {
        // 랭크가 낮으면 높은거 있는지 확인
        const data = await findMatch(spectateRank, idPriority);
        if (data.spectateRank !== -1 && data.spectateRank < spectateRank) {
          isSpectating = false;
          ({ encryptionKey, gameId, spectateRank } = data);
        }
      }
      {
        // 게임이 종료되었는지 확인
        try {
          const {
            data: { Events: events },
          } = await request<EventData>('get', EVENDATA_URL, {
            httpsAgent,
          });
          const size = events.length;
          while (eventIndex < size && isSpectating) {
            const event = events[eventIndex];
            if (event.EventID === 34) {
              isSpectating = false;
              spectateRank = -1;
              if (spectateRank < 3) {
                // 팀의 선수라면 마지막 관전 시간 설정
                lastSpectateTime = new Date().valueOf();
              }
            }
            eventIndex += 1;
          }
        } catch {}
      }
      {
        // 게임 시간이 너무 오래지났으면 종료
        if (new Date().valueOf() - startTime > GAME_TIME_LIMIT) {
          isSpectating = false;
          spectateRank = -1;
        }
      }
      {
        // twitch api를 통해 현재 방송중인지 확인
      }
    }
    // 배경화면으로 전환
    process.kill(-gameProcess.pid);
  }
})();
