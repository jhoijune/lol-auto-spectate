export default class {
  static PRO_LIST_URL = 'https://op.gg/spectate/list' as const;

  static PLAYERLIST_URL =
    'https://127.0.0.1:2999/liveclientdata/playerlist' as const;

  static EVENDATA_URL =
    'https://127.0.0.1:2999/liveclientdata/eventdata' as const;

  static GAME_STATS_URL =
    'https://127.0.0.1:2999/liveclientdata/gamestats' as const;

  static SUMMONER_PUUID_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' as const;

  static SUMMONER_NAME_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' as const;

  static SUMMONER_ID_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/' as const;

  static SPECTATE_URL =
    'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' as const;

  static STREAMS_URL = 'https://api.twitch.tv/helix/streams' as const;

  static BROADCASTER_URL =
    'https://api.twitch.tv/helix/channels?broadcaster_id' as const;

  static OBS_ADDRESS = 'localhost:4444' as const;

  static OBS_SUCCESS = 0 as const;

  static OBS_FAIL = 1 as const;

  static OBS_ERROR = 2 as const;

  static RIOT_API_WAIT_TIME = 2 * 60 * 10;

  static RIOT_API_LIMIT_TIME = 2 * 60 * 1000;

  static SUMMONERS_RIFT_ID = 11 as const;

  static SOLO_RANK_ID = 420 as const;

  static NONE = -1 as const;

  static FAKER_RANK = 0 as const;

  static GROUP1_RANK = 1 as const;

  static OTHERS_RANK = 2 as const;

  static PRIORITIES = {
    Faker: 0,
  } as const;

  static LEAGUE_URLS = [
    'https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',
    'https://kr.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5',
    'https://kr.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5',
  ] as const;

  static PRO_STREAMING_IDS = [
    't1_teddy',
    't1_cuzz',
    'canna',
    't1_ellim',
    'gumayusi',
    't1_keria',
    't1zeus_',
    't1_oner',
    'clozer_t1',
    't1zeus_',
    't1_oner',
  ] as const;

  static ID = {
    Faker: [
      '3XgyIfpjVnlRYOiVJi9BuzYXABU4srlKnNCd7zO6ou4r9Q',
      '3kFXTl-XQ6ckWRDnPevKx-hzfY8xMmrw0nv9D6W_8W32ag',
    ],
  };

  static ID_PRIORITY = [
    [
      '3XgyIfpjVnlRYOiVJi9BuzYXABU4srlKnNCd7zO6ou4r9Q',
      '3kFXTl-XQ6ckWRDnPevKx-hzfY8xMmrw0nv9D6W_8W32ag',
    ],
  ] as const;
}
