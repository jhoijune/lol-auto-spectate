import { Agent } from 'https';
import { ChildProcessWithoutNullStreams } from 'child_process';
import { Model, ModelCtor, Optional, Sequelize } from 'sequelize';
import { Heap } from './DataStructure';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RIOT_API_KEY: string;
      TWITCH_ID: string;
      TWITCH_CLIENT_ID: string;
      TWITCH_SECRET: string;
      TWITCH_TOKEN: string;
      OBS_PASSWORD: string;
      ASSET_PATH: string;
      CHANNEL: string;
      AUTH_USERS: string;
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

export interface Config {
  type: string;
  gameWaitLimitMinute: number;
  noOnePlayWaitLimitMinute: number;
  spectateWaitLimitMinute: number;
}

export interface SummonerDTO {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

interface Perks {
  perkIds: number[];
  perkStyle: number;
  perkSubStyle: number;
}

interface GameCustomizationObject {
  category: string;
  content: string;
}

interface CurrentGameParticipant {
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
}

interface Observer {
  encryptionKey: string;
}

interface BannedChampion {
  pickTurn: number;
  championId: number;
  teamId: number;
}

export interface CurrentGameInfo {
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
}

interface ItemInfo {
  canUse: boolean;
  consumable: boolean;
  count: number;
  displayName: string;
  itemID: string;
  price: string;
  rawDescription: string;
  rawDisplayName: string;
  slot: number;
}

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

interface Event {
  EventID: number;
  EventName: string;
  EventTime: number;
  Assisters?: string[];
  KillerName?: string;
  KillStreak?: number;
  VictimName?: string;
  TurretKilled?: string;
  Result?: string;
  [EventName: string]: any;
}

export interface EventData {
  Events: Event[];
}

export interface LeagueItemDTO {
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
}

export interface LeagueListDTO {
  tier: string;
  leagueId: string;
  queue: string;
  name: string;
  entries: LeagueItemDTO[];
}

export interface GetStreamsResponse {
  data: {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    interface: string;
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
}

export interface GameStats {
  gameMode: string;
  gameTime: number;
  mapName: string;
  mapNumber: number;
  mapTerrain: string;
}

export interface AuxData {
  selectedIndex: number;
  exGameTime: number;
  fixCount: number;
  endReservation: boolean;
}

export interface ChampionAttributes {
  id: number;
  korName: string;
  engName: string;
}

export interface TeamAttributes {
  id: number;
  name: string;
  exactName: string;
}

export interface SummonerAttributes {
  id: number;
  summonerId: string;
  name: string;
  proId: number;
}

export interface ProAttributes {
  id: number;
  name: string;
  imageName: string | null;
  teamId: number | null;
}

export interface ChampionCreationAttributes
  extends Optional<ChampionAttributes, 'id'> {}

export interface TeamCreationAttributes
  extends Optional<TeamAttributes, 'id'> {}

export interface SummonerCreationAttributes
  extends Optional<SummonerAttributes, 'id'> {}

export interface ProCreationAttributes extends Optional<ProAttributes, 'id'> {}

export interface ChampionInstance
  extends Model<ChampionAttributes, ChampionCreationAttributes>,
    ChampionAttributes {}

export interface TeamInstance
  extends Model<TeamAttributes, TeamCreationAttributes>,
    TeamAttributes {}

export interface SummonerInstance
  extends Model<SummonerAttributes, SummonerCreationAttributes>,
    SummonerAttributes {}

export interface ProInstance
  extends Model<ProAttributes, ProCreationAttributes>,
    ProAttributes {}

export interface DB {
  Champion: ModelCtor<ChampionInstance>;
  Team: ModelCtor<TeamInstance>;
  Summoner: ModelCtor<SummonerInstance>;
  Pro: ModelCtor<ProInstance>;
  sequelize: Sequelize;
}

export interface Data {
  isSpectating: boolean;
  isPaused: boolean;
  spectateRank: number;
  encryptionKey: string;
  gameId: number;
  peopleCount: number;
  lastHighRankSpectateTime: number;
  lastSpectateTime: number;
  httpsAgent: Agent;
  pq: Heap<{ name: string; playerIndex: number; championName?: string }>;
  idPriority: string[][];
  currSummonerID: number;
  isPermitted: boolean;
  isCommandAvailable: boolean;
  noOnePlayWaitLimit: number;
  gameWaitLimit: number;
  spectateWaitLimit: number;
  gameProcess?: ChildProcessWithoutNullStreams;
}

export interface ValidateResponse {
  client_id: string;
  login: string;
  scopes: string[];
  user_id: number;
  expires_in: number;
}

export interface MiniSeriesDTO {
  losses: number;
  progress: string;
  target: number;
  wins: number;
}

export interface LeagueEntryDTO {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  miniSeries: MiniSeriesDTO;
}
