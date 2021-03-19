declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RIOT_API_KEY: string;
    }
  }
}

declare module '*.json' {
  const value: string;
  export default value;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    method: string;
    url: string;
    data?: {
      'X-Riot-Token'?: string;
    };
  }
}

export type SummonerDTO = {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
};

type Perks = {
  perkIds: number[];
  perkStyle: number;
  perkSubStyle: number;
};

type GameCustomizationObject = {
  category: string;
  content: string;
};

type CurrentGameParticipant = {
  championId: number;
  perks: Perks;
  profileIconId: number;
  bot: boolean;
  teamId: number;
  summonerName: string;
  summonerId: string;
  spell1Id: number;
  spell2Id: number;
  gameCustomizationObjects: GameCustomizationObject[];
};

type Observer = {
  encryptionKey: string;
};

type BannedChampion = {
  pickTurn: number;
  championId: number;
  teamId: number;
};

export type CurrentGameInfo = {
  gameId: number;
  mapId: number;
  gameMode: string;
  gameType: string;
  gameQueueConfigId: number;
  participants: CurrentGameParticipant[];
  observers: Observer;
  platformId: string;
  bannedChampions: BannedChampion[];
  gameStartTime: number;
  gameLength: number;
};
