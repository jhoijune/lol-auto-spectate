export default class {
  static PRO_LIST_URL = 'https://op.gg/spectate/list' as const;

  static PLAYERLIST_URL = 'https://127.0.0.1:2999/liveclientdata/playerlist' as const;

  static EVENDATA_URL = 'https://127.0.0.1:2999/liveclientdata/eventdata' as const;

  static GAME_STATS_URL = 'https://127.0.0.1:2999/liveclientdata/gamestats' as const;

  static SUMMONER_PUUID_URL = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' as const;

  static SUMMONER_NAME_URL = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' as const;

  static SUMMONER_ID_URL = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/' as const;

  static SPECTATE_URL = 'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' as const;

  static STREAMS_URL = 'https://api.twitch.tv/helix/streams' as const;

  static BROADCASTER_URL = 'https://api.twitch.tv/helix/channels?broadcaster_id' as const;

  static OBS_ADDRESS = 'localhost:4444' as const;

  static RIOT_API_WAIT_TIME = 2 * 60 * 10;

  static RIOT_API_LIMIT_TIME = 2 * 60 * 1000;

  static SUMMONERS_RIFT_ID = 11 as const;

  static SOLO_RANK_ID = 420 as const;

  static NONE = -1 as const;

  static FAKER_RANK = 0 as const;

  static GROUP1_RANK = 1 as const;

  static GROUP2_RANK = 2 as const;

  static OTHERS_RANK = 3 as const;

  static PRIORITIES = {
    Faker: 0,
    Teddy: 1,
    Canna: 2,
    Gumayusi: 3,
    Keria: 4,
    Zeus: 5,
    Cuzz: 6,
    Ellim: 7,
    Oner: 8,
    Clozer: 9,
    Roach: 10,
    Hoit: 11,
    Mowgli: 11,
    Mireu: 11,
    Berserker: 11,
    Asper: 11,
    Fisher: 12,
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
    'T1 Faker': [
      '3XgyIfpjVnlRYOiVJi9BuzYXABU4srlKnNCd7zO6ou4r9Q',
      '3kFXTl-XQ6ckWRDnPevKx-hzfY8xMmrw0nv9D6W_8W32ag',
    ],
    'T1 Teddy': [
      'Lp2if0FZhWCVmVCLNIl7biKcydzFQOOBGWPCT7Ru17MoHH0',
      'bpo39bz8ZWjGI0rj00mRjFYzCRymGqkV6xXgykMV3rp57js',
    ],
    'T1 Cuzz': [
      '7i-1vJWjO6a_Z-UfsWP1veTiPY0V3TC6CzYlaxbAT6bk5Yg',
      'sCj2TgopepW0VQKGVfV9zP9YdL2KVRAzCjKnyi2R0FPc4z4',
      'wTNxvyFMyQ3QkZ1kqbvMt25Fc8jOyFpnDhk5BpfQpLmKkJk',
      'PeTp3Rfa_f6j25H27aVt10ke2mx5yBRSF3DoSJ4oxy7pSJk',
    ],
    'T1 Canna': [
      'Rpmv4q-p9jw_XywfvtMfaD9YAeR0OvGgQHSGs7N0Ugt721E',
      '4DN2JakRykjWRuENPImKJQ6M6q6nr2MNB9L67_ItMbBIAUg',
    ],
    'T1 Ellim': [
      'X-cmR6H-54lFtI-WWRmWVh-15etQ5D9Yofrn5ep3jjr0KnE',
      '05IoegFtxkYL2o69GUzMNQzETWimOsUZ3qykAc8BnJI7x1o',
    ],
    'T1 Gumayusi': [
      'WSD8-_fi6vmR6lRBIKg2mLI5rvnKc5FalGBz5ynNUzVkRi8',
      'QTQFU6OubT3w4s3rJ70scYNPvO2kq61Hl4jlN95Bglu4TA',
      'k1h4Ct6wh_EB3kHMX8EK4SYwmcAr1TRx_CKIT07mreApWNBPBULfRnol4g',
    ],
    'T1 Keria': [
      'hOTwMMHiUoE7uB0s3pJmfeDVOYou0m2WDrjV7kHe4uNP0UE',
      'foe5GUqR2nD1RvUVk7srD4Cqh-FkPosDDiGpWn7D8nMYw0s',
    ],
    'T1 Zeus': [
      'vc3SXcYKhVhTrAt8Xgg0-rOv9vvY6ilaBERlegto-BrmPTk',
      '8IxiySn4-R0oi_0xXGgbsfmma-PXJvpW94WIaKG1Oy5wEzE',
      'o5A_KMplNw9TBT7YS7DWXOapNdPAOk0D0-7D2lkQOTfLs5M',
    ],
    'T1 Oner': [
      'IXtLthCZ0Qw_OgCkkCVs15krMmJpPYmZ6NweYlKrPaAW5LXlcLNsj5k4dg',
      'DoYpR6ll4MgLyibG6ww1s9IPaw5defOu695gPTnnYjC0LQs',
    ],
    'T1 Clozer': [
      '9v7Azbh82ox7Te3T3BEMq-IZdaylvDw3J06cmGS8J1bmbkPF9OV-bET6wA',
      'rkMjlQDkla0Rsk4AbfMwRasOMP_AopxJcprKSA_-SeaioyQ',
      'fTi0pPvsk2-1ttIAw_l6ixg3e2lbwVLNRaYBQMKMPXuQgfA',
    ],
    'T1.C Roach': [
      '3ed4S0Be6loem7nbaFY1ksHoncd05Oxohtj9szZifIuO7A',
      '8f9GfadY9Wa9CMD1qf2RkH07RaZi9H8fyHBTZrz-IrYNFsQ',
    ],
    'T1.C Hoit': [
      'wFBeLnyc-WaO1otfgEohXHolKlnvjtOkCPY2EKxJMa_nRDs',
      'k4qd8N6tj4LOy-bha1yVGwDVN5tgNjCrMV3OD_m1Oo8FKA',
      'dWjF04z47wN95VD8qANyUW3YDRsItPW5kPM_4t0apC-aOTo',
    ],
    'T1.C Berserker': ['-ZTgOZPToM8AlQoaU8jFCvXfmAaf7_GrMuGnuW5ZpPXTsgM'],
    'T1.C Mowgli': ['hyPZGnGZEEIdUeYC4Z_jCeX1j9CxBF7pkCVrOWtge9qSk1g'],
    'T1.C Mireu': ['UK9eE3qNzV4kMD9JU9pt7pNfSim4LdnGW3ohVkILoWBCOdE'],
    'T1.C Asper': ['oXDJiJRcX_AgzawO-yamimEoZ1J0GzvMvS-76GK3s-3uBtY'],
    'T1.A Fisher': ['XGCsjHeykKEjU1LG8fhRgi5HaIFTMky1mF7YOAw6t3HGWHw'],
  };

  static ID_PRIORITY = [
    [
      '3XgyIfpjVnlRYOiVJi9BuzYXABU4srlKnNCd7zO6ou4r9Q',
      '3kFXTl-XQ6ckWRDnPevKx-hzfY8xMmrw0nv9D6W_8W32ag',
    ],
    [
      'Lp2if0FZhWCVmVCLNIl7biKcydzFQOOBGWPCT7Ru17MoHH0',
      'bpo39bz8ZWjGI0rj00mRjFYzCRymGqkV6xXgykMV3rp57js',
      'Rpmv4q-p9jw_XywfvtMfaD9YAeR0OvGgQHSGs7N0Ugt721E',
      '4DN2JakRykjWRuENPImKJQ6M6q6nr2MNB9L67_ItMbBIAUg',
      'WSD8-_fi6vmR6lRBIKg2mLI5rvnKc5FalGBz5ynNUzVkRi8',
      'QTQFU6OubT3w4s3rJ70scYNPvO2kq61Hl4jlN95Bglu4TA',
      'k1h4Ct6wh_EB3kHMX8EK4SYwmcAr1TRx_CKIT07mreApWNBPBULfRnol4g',
      'hOTwMMHiUoE7uB0s3pJmfeDVOYou0m2WDrjV7kHe4uNP0UE',
      'foe5GUqR2nD1RvUVk7srD4Cqh-FkPosDDiGpWn7D8nMYw0s',
      'vc3SXcYKhVhTrAt8Xgg0-rOv9vvY6ilaBERlegto-BrmPTk',
      '8IxiySn4-R0oi_0xXGgbsfmma-PXJvpW94WIaKG1Oy5wEzE',
      'o5A_KMplNw9TBT7YS7DWXOapNdPAOk0D0-7D2lkQOTfLs5M',
      '7i-1vJWjO6a_Z-UfsWP1veTiPY0V3TC6CzYlaxbAT6bk5Yg',
      'sCj2TgopepW0VQKGVfV9zP9YdL2KVRAzCjKnyi2R0FPc4z4',
      'wTNxvyFMyQ3QkZ1kqbvMt25Fc8jOyFpnDhk5BpfQpLmKkJk',
      'PeTp3Rfa_f6j25H27aVt10ke2mx5yBRSF3DoSJ4oxy7pSJk',
      'X-cmR6H-54lFtI-WWRmWVh-15etQ5D9Yofrn5ep3jjr0KnE',
      '05IoegFtxkYL2o69GUzMNQzETWimOsUZ3qykAc8BnJI7x1o',
      'IXtLthCZ0Qw_OgCkkCVs15krMmJpPYmZ6NweYlKrPaAW5LXlcLNsj5k4dg',
      'DoYpR6ll4MgLyibG6ww1s9IPaw5defOu695gPTnnYjC0LQs',
      '9v7Azbh82ox7Te3T3BEMq-IZdaylvDw3J06cmGS8J1bmbkPF9OV-bET6wA',
      'rkMjlQDkla0Rsk4AbfMwRasOMP_AopxJcprKSA_-SeaioyQ',
      'fTi0pPvsk2-1ttIAw_l6ixg3e2lbwVLNRaYBQMKMPXuQgfA',
    ],
    [
      '3ed4S0Be6loem7nbaFY1ksHoncd05Oxohtj9szZifIuO7A',
      '8f9GfadY9Wa9CMD1qf2RkH07RaZi9H8fyHBTZrz-IrYNFsQ',
      'wFBeLnyc-WaO1otfgEohXHolKlnvjtOkCPY2EKxJMa_nRDs',
      'k4qd8N6tj4LOy-bha1yVGwDVN5tgNjCrMV3OD_m1Oo8FKA',
      'dWjF04z47wN95VD8qANyUW3YDRsItPW5kPM_4t0apC-aOTo',
      '-ZTgOZPToM8AlQoaU8jFCvXfmAaf7_GrMuGnuW5ZpPXTsgM',
      'hyPZGnGZEEIdUeYC4Z_jCeX1j9CxBF7pkCVrOWtge9qSk1g',
      'UK9eE3qNzV4kMD9JU9pt7pNfSim4LdnGW3ohVkILoWBCOdE',
      'oXDJiJRcX_AgzawO-yamimEoZ1J0GzvMvS-76GK3s-3uBtY',
      'XGCsjHeykKEjU1LG8fhRgi5HaIFTMky1mF7YOAw6t3HGWHw',
    ],
  ] as const;
}
