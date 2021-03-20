export default class {
  static PLAYERLIST_URL = 'https://127.0.0.1:2999/liveclientdata/playerlist' as const;

  static EVENDATA_URL = 'https://127.0.0.1:2999/liveclientdata/eventdata' as const;

  static SUMMONER_PUUID_URL = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' as const;

  static SPECTATE_URL = 'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' as const;

  static SUMMONERS_RIFT_ID = 11 as const;

  static SOLO_RANK_ID = 420 as const;

  static GAME_END_ID = 34 as const;

  static NONE = -1 as const;

  static PRIORITIES: {
    [name: string]: number;
  } = {
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
  } as const;

  static LEAGUE_URLS = [
    'https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',
    'https://kr.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5',
    'https://kr.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5',
  ] as const;

  static PRO_STREAMING_IDS = [
    'faker',
    't1_teddy',
    't1_cuzz',
    'canna',
    't1_ellim',
    'gumayusi',
    't1_keria',
    'clozer_t1',
  ] as const;
}
