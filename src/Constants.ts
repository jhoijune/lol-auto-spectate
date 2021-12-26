export default class {
  static PLAYERLIST_URL =
    'https://127.0.0.1:2999/liveclientdata/playerlist' as const;

  static EVENTDATA_URL =
    'https://127.0.0.1:2999/liveclientdata/eventdata' as const;

  static GAME_STATS_URL =
    'https://127.0.0.1:2999/liveclientdata/gamestats' as const;

  static SUMMONER_PUUID_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' as const;

  static SUMMONER_NAME_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' as const;

  static SUMMONER_ID_URL =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/' as const;

  static SUMMONER_RANK_URL =
    'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' as const;

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
    Gumayusi: 1,
    Zeus: 2,
    Keria: 3,
    Oner: 4,
  } as const;

  static LEAGUE_URLS = [
    'https://kr.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/RANKED_SOLO_5x5',
    'https://kr.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/RANKED_SOLO_5x5',
    'https://kr.api.riotgames.com/lol/league/v4/masterleagues/by-queue/RANKED_SOLO_5x5',
  ] as const;

  static PRO_STREAMING_IDS = [
    'gumayusi',
    't1_keria',
    't1zeus_',
    't1_oner',
  ] as const;

  static ID = {
    Faker: [
      '3XgyIfpjVnlRYOiVJi9BuzYXABU4srlKnNCd7zO6ou4r9Q',
      '3kFXTl-XQ6ckWRDnPevKx-hzfY8xMmrw0nv9D6W_8W32ag',
    ],
    'T1 Gumayusi': [
      'WSD8-_fi6vmR6lRBIKg2mLI5rvnKc5FalGBz5ynNUzVkRi8',
      'jaBd0zN4X3FJygQO7g10FGpq3oSVMcfbYLVZjuPpmYGZq9ygKaw0weLe1w',
      'QTQFU6OubT3w4s3rJ70scYNPvO2kq61Hl4jlN95Bglu4TA',
    ],
    'T1 Keria': [
      'hOTwMMHiUoE7uB0s3pJmfeDVOYou0m2WDrjV7kHe4uNP0UE',
      'foe5GUqR2nD1RvUVk7srD4Cqh-FkPosDDiGpWn7D8nMYw0s',
      'a0AUJMKARlLd9MBpYSCHug6tQUBjh-5jdUyTYNtlQPUYjck',
    ],
    'T1 Oner': [
      'IXtLthCZ0Qw_OgCkkCVs15krMmJpPYmZ6NweYlKrPaAW5LXlcLNsj5k4dg',
      'DoYpR6ll4MgLyibG6ww1s9IPaw5defOu695gPTnnYjC0LQs',
      '18E3LyMMEsnbmpGC7q1hMyLmPHUAYN8uAFnZ1VPgCgXK5X9j49MO4zaBuQ',
    ],
    'T1 Zeus': [
      'vc3SXcYKhVhTrAt8Xgg0-rOv9vvY6ilaBERlegto-BrmPTk',
      '8IxiySn4-R0oi_0xXGgbsfmma-PXJvpW94WIaKG1Oy5wEzE',
      '_KsnqhF5237SndycuCOJ1oHNR1Cutw1g-rx4VYnZC5JVVF1_VCvD5vWtKw',
    ],
  };

  static ID_PRIORITY = [
    [
      '3XgyIfpjVnlRYOiVJi9BuzYXABU4srlKnNCd7zO6ou4r9Q',
      '3kFXTl-XQ6ckWRDnPevKx-hzfY8xMmrw0nv9D6W_8W32ag',
    ],
    [
      'WSD8-_fi6vmR6lRBIKg2mLI5rvnKc5FalGBz5ynNUzVkRi8',
      'jaBd0zN4X3FJygQO7g10FGpq3oSVMcfbYLVZjuPpmYGZq9ygKaw0weLe1w',
      'QTQFU6OubT3w4s3rJ70scYNPvO2kq61Hl4jlN95Bglu4TA',
      'vc3SXcYKhVhTrAt8Xgg0-rOv9vvY6ilaBERlegto-BrmPTk',
      '8IxiySn4-R0oi_0xXGgbsfmma-PXJvpW94WIaKG1Oy5wEzE',
      '_KsnqhF5237SndycuCOJ1oHNR1Cutw1g-rx4VYnZC5JVVF1_VCvD5vWtKw',
      'IXtLthCZ0Qw_OgCkkCVs15krMmJpPYmZ6NweYlKrPaAW5LXlcLNsj5k4dg',
      'DoYpR6ll4MgLyibG6ww1s9IPaw5defOu695gPTnnYjC0LQs',
      '18E3LyMMEsnbmpGC7q1hMyLmPHUAYN8uAFnZ1VPgCgXK5X9j49MO4zaBuQ',
      'hOTwMMHiUoE7uB0s3pJmfeDVOYou0m2WDrjV7kHe4uNP0UE',
      'foe5GUqR2nD1RvUVk7srD4Cqh-FkPosDDiGpWn7D8nMYw0s',
      'a0AUJMKARlLd9MBpYSCHug6tQUBjh-5jdUyTYNtlQPUYjck',
    ],
  ] as const;
}
