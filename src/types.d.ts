import { Agent } from 'https';
import { Heap } from './DataStructure';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RIOT_API_KEY: string;
      TWITCH_ID: number;
      TWITCH_CLIENT_ID: string;
      TWITCH_SECRET: string;
      TWITCH_TOKEN: string;
      OBS_PASSWORD: string;
      ASSET_PATH: string;
    }
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    'X-Riot-Token'?: string;
    'Content-Type'?: string;
    'Client-Id'?: string;
    Authorization?: string;
    'client-id'?: string;
    authorization?: string;
  }
}

declare module 'child_process' {
  export interface ChildProcessWithoutNullStreams {
    isUnusualExit?: boolean;
  }
}

export type Config = {
  type: string;
  gameWaitLimitMinute: number;
  noOnePlayWaitLimitMinute: number;
  spectateWaitLimitMinute: number;
  resolution: 720 | 1080;
  correctFileLoc?: string;
};

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

type ItemInfo = {
  canUse: boolean;
  consumable: boolean;
  count: number;
  displayName: string;
  itemID: string;
  price: string;
  rawDescription: string;
  rawDisplayName: string;
  slot: number;
};

export type PlayerList = {
  championName: string;
  isBot: boolean;
  isDead: boolean;
  items: ItemInfo[];
  level: number;
  position: string;
  rawChampionName: string;
  rawSkinName: string;
  respawnTimer: number;
  runes: {
    keystone: {
      displayName: string;
      id: number;
      rawDescription: string;
      rawDisplayName: string;
    };
    primaryRuneTree: {
      displayName: string;
      id: number;
      rawDescription: string;
      rawDisplayName: string;
    };
    secondaryRuneTree: {
      displayName: string;
      id: number;
      rawDescription: string;
      rawDisplayName: string;
    };
  };
  scores: {
    assists: number;
    creepScore: number;
    deaths: number;
    kills: number;
    wardScore: number;
  };
  skinID: number;
  skinName: string;
  summonerName: string;
  summonerSpells: {
    summonerSpellOne: {
      displayName: string;
      rawDescription: string;
      rawDisplayName: string;
    };
    summonerSpellTwo: {
      displayName: string;
      rawDescription: string;
      rawDisplayName: string;
    };
  };
  team: string;
}[];

type Event = {
  EventID: number;
  EventName: string;
  EventTime: number;
  Assisters: string[];
  KillerName: string;
  VictimName: string;
};

export type EventData = {
  Events: Event[];
};

type LeagueItemDTO = {
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  rank: string;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
};

export type LeagueListDTO = {
  tier: string;
  leagueId: string;
  queue: string;
  name: string;
  entries: LeagueItemDTO[];
};

export type GetStreamsResponse = {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
  }[];
  pagination: {
    cursor: string;
  };
};

export type GameStats = {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
};

export type Data = {
  isSpectating: boolean;
  isStreaming: boolean;
  spectateRank: number;
  exSpectateRank: number;
  encryptionKey: string;
  gameId: number;
  peopleCount: number;
  lastHighRankSpectateTime: number;
  lastSpectateTime: number;
  httpsAgent: Agent;
  pq: Heap<{ name: string; playerIndex: number; championName?: string }>;
  nickMap: Map<string, string>;
  pictures: string[];
  pictureMap: Map<string, number>;
  idPriority: string[][];
  resolution: 720 | 1080;
  isPermitted: boolean;
  noOnePlayWaitLimit: number;
  gameWaitLimit: number;
  spectateWaitLimit: number;
};

export type AuxData = {
  selectedIndex: number;
  exGameTime: number;
  fixCount: number;
};
