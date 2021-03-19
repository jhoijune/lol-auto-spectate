import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

import { mapNickToName, collectProPicture, request } from './Util';
import PUUID from '../static/PUUID.json';
import PUUID_PRIORITY from '../static/PUUID_PRIORITY.json';
import type { SummonerDTO } from './types';

config();

const { RIOT_API_KEY } = process.env;
const SUMMONER_PUUID_URL =
  'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/';
const SPECTATE_URL =
  'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/';
const assetsPath = path.join('..', 'assets');
let isBrodcasting = false;
let isSpectating = false;
let spectateRank = 0;

(async () => {
  let nickMapping: Map<string, string>;
  let files: string[];
  const fileMapping = new Map<string, number>(); // 프로명에 파일 인덱스 매핑
  const idPriority: string[][] = [];
  try {
    // 초기화 작업
    // 닉네임에 이름 매핑
    let tempNickMapping = await mapNickToName();
    while (!tempNickMapping) {
      tempNickMapping = await mapNickToName();
    }
    nickMapping = tempNickMapping;
    // assets 폴더에 프로 사진 수집
    collectProPicture();
    files = await fs.readdir(assetsPath);
    files.forEach((file, index) => {
      const [name] = file.split(' ');
      fileMapping.set(name, index);
    });
    const puuids = PUUID as { [key: string]: string[] };
    const puuidToId = new Map<string, string>();
    for (const name in puuids) {
      if (!(name in puuids)) {
        continue;
      }
      for (const puuid of puuids[name]) {
        const tempUrl = `${SUMMONER_PUUID_URL}${puuid}`;
        const { data } = await request<SummonerDTO>('get', tempUrl, {
          'X-Riot-Token': RIOT_API_KEY,
        });
        puuidToId.set(puuid, data.id);
        nickMapping.set(data.name, name);
      }
    }
    const puuidPriority = PUUID_PRIORITY as string[][];
    for (const puuids of puuidPriority) {
      const container: string[] = [];
      for (const puuid of puuids) {
        container.push(puuidToId.get(puuid)!);
      }
      idPriority.push(container);
    }
  } catch (error) {
    console.log(error);
  }
  try {
  } catch (error) {
    console.log(error);
  }
})();
