export default class {
  static PRO_LIST_URL = 'https://op.gg/spectate/list' as const;

  static PLAYERLIST_URL = 'https://127.0.0.1:2999/liveclientdata/playerlist' as const;

  static EVENDATA_URL = 'https://127.0.0.1:2999/liveclientdata/eventdata' as const;

  static GAME_STATS_URL = 'https://127.0.0.1:2999/liveclientdata/gamestats' as const;

  static SUMMONER_PUUID_URL = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' as const;

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
    'T1 Faker': 0,
    'T1 Teddy': 1,
    'T1 Canna': 2,
    'T1 Gumayusi': 3,
    'T1 Keria': 4,
    'T1 Zeus': 5,
    'T1 Cuzz': 6,
    'T1 Ellim': 7,
    'T1 Oner': 8,
    'T1 Clozer': 9,
    'T1.C Roach': 10,
    'T1.C Hoit': 11,
    'T1.C Mowgli': 11,
    'T1.C Mireu': 11,
    'T1.C Berserker': 11,
    'T1.C Asper': 11,
    'T1.A Fisher': 12,
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

  static foo = [];

  static PUUID = {
    'T1 Faker': [
      'UWLdkv7QfJLoaA3pQXEKpmmjrUspydRl7h0h4vZT6U0uSFM9RWXlWw_PXGDrcQs87UmXtvyh_iMAvw',
      'yUP2nDkAUIqoHf6NUCRhrVNcGUWfRaFHW2U1ObXXapqPJdLdAUIiiyw9cjY5JKdsH1SbQ8m8Z_1lNw',
    ],
    'T1 Teddy': [
      'hZrIKNtOVPgQwzto1szBbbKZFp3kaYrcNxC75VCEgfptW1yT34NR0mk-HStLDMiD73F-7qh1dd3KfQ',
      '9aDj-tgh_WvSw-gtSENUrlQm7h0ZKP0ZKSeVljcKdjy7vylCHXvNBQfUXLH2cg2dBtaeHeJ9i5GbNQ',
    ],
    'T1 Cuzz': [
      'BthRtIUa_k30h1zYGsZZc-mET0AKzdk1fOr0GcyjtYPzOE2X_lW6d7xgP3qhhwfryoMm59HxOceGTA',
      '2S9-PoYaxCxbZgEXKlQrSNg1RKFGNzLko8h1KJL-NwIhV63HSvF95ogpAvREAVtxipkokNl15saiRg',
      'mLcxi-d4OOjIFcgrPKzgwqQwHq9QckGDLz8tx1FqHIiCtBs1E9ylSRTDARYSZD6Rij1hEvM-eMoHHQ',
      'Z7M_-KQQ8a2aZ9J57ab_2aLq_aCXqqo45_xX7oxokcN2f7un5mrma3P2mS9rO3SZHpy62iTIKM38aw',
    ],
    'T1 Canna': [
      'NjZ3zun7yICZXia63MfsimgX-DuVOTUs8gB8UeHBVb_p7e5icfk-nMQG5f4yx4R0CdiZaOBzeBXQOQ',
      'lOkIIiHBFsI_oVSqZMTynLToUI1rIq6dFYjNV7uqgc08RDEV0tquel0Eszlsbt4be7FO1y-1vSoSZw',
    ],
    'T1 Ellim': [
      'yLCRXIpOx8RXrGIbB2hM3VQnKuWRQ4Xi76tIMeEnBwu7KusExWOJoDDqFIffvidYoGFeaKMO_urbmQ',
      'NP1_ImmkFtIA6IuzS__2zzZ63M8CpWcdJAtZGYN6MoLxjKfW0L2R7w9nywzj4dAZm9ag9FcE_k8-1A',
    ],
    'T1 Gumayusi': [
      'es_pEWJv1qYgd6-KAWRjzCun4B8JNtc67Avqn27GM8n5MxryUxGq1RCllA5HDJnkDSWk1_-Cf3gScg',
      'jUCaat-sZW6ivHH80Di2ByNrLTh448f6LcW9CN8bkSuyMKG7DD1qciOiNyY5bTWu1Kx8yef2qKp4bA',
      '_iy8yTOfFHtJLD0jME7k5Pg0oMS06PvIUcSV9fZtB0H_0zhKv-nPbLdVcX-5ZzkzoMPrY4LdXGYcaw',
    ],
    'T1 Keria': [
      'vqukIGn2xt_ifiNGjQW27f3i0Wwf5CIq0IZ9lwoMBhEN7rDBT6gF-jCvCCi-eDIYiTCWlmoh4CuLtA',
      'qEM--zGXNVMhLxR06OvdWKwsCQSlytBFByZ2sg9rMBdIAArCKGmRHK3bkwdLDh5866yXSbZ74dWIPQ',
    ],
    'T1 Zeus': [
      'GUBCYE4A80jjHFwCDA672pcbRdy0GgPgjHVEQZWIaVfgmrj0aG-eFYEiGtdx8SO30bsibv8CohgquQ',
      'B8O9AUl5CYPiglELcaXXykTE2GiDCGyeNCnC6MiMOMj0tbtSmnz0zcHHrLUsIouDr11Hb34qskQvyQ',
      'HNVV7L-WelxzRk6UcazZsmKH3FCOpwCEwFzIVyDw3TogL5rPdT7b5sFrFc80GCpMX162xdxPy1Z0IA',
    ],
    'T1 Oner': [
      'iKnnw00vpUcA_Pg5TbfQC78KsZGp_svWVqLyoCZ73vcp5zC8rNRYPB2k7sWRvKH-icI--obdE1ExVg',
      'kM5JgMCRqNYhdsf3CxkVbpaVvpilYAGD7oh_tTP6Kk1H4cMxECqpxxE1J7cQBDly92ubf2ZgdYSM7A',
    ],
    'T1 Clozer': [
      'OUQe96GYixaVL_9ygBWm2HXpHO1e223VX9C3b6vfvIHoL5ewo7xh02gcAS0em_5wkFuN17lVmcIbng',
      '2nKp9qzO9u3c6pVrT3ZIXE_Q1w6tpgprs9lyjZ7j2I9dZBLS9LCOqwmnynQTegN8g-X4gZqXvsOHjA',
      'oEuiIBDdUpNird9P5ld5J6AvXYMd9Zo-pWZycVz_So0ZYlJa7FP2urbUYv5JpULA8A_lMYjC7aX-3A',
    ],
    'T1.C Roach': [
      'aOGhr7U8qdOBPx8Y0yp4FlN3To8B6AZC5E4Xcqmo6qf1OLT4PztQh70jZz0vXcqr19z_191S-Mfcgw',
      'OrlERSiTCROGFMWoLGW1buHvzXpkpKlQzZRgizQUjS3fgWJQYvXxe03OWw3RSLT__AyIgj_AvTWZ-g',
    ],
    'T1.C Hoit': [
      'ozMZm8gBRpRIYzbxXWwiItzq23cSIW2NUyNLJfaLmk3EKeHZQUqPjwQwsiyDWEdO4aVrBgn6dfU47g',
      'CAJXxRA8T-XrZIAxi-hbkxZ3RLdJyxqm07HClHrj-FG5CJcxs8ECcHadjfLISr_5IpzY9PLzosxUkg',
      'CKW9HXSSwfa6w-Yrgs4kl4cIb7skmaS94IQ75a68D6f67HJK6A-4fU1CNshQ10AQG_3FdPRclb7mmw',
    ],
    'T1.C Berserker': [
      '9OzGLp-ba2bv1WH-ObEt7Xmpe1GhEDItFDDva0P2FB864WfzUAQbLD7DGXSbgJyeL7ZoPI3LU3eIyw',
    ],
    'T1.C Mowgli': [
      '0XxzszbA2IRjDI-1wmK9bgEHwrtymPU4P668s2QGE2jsaOAVci12jDXy7ybqlSc482WrRdQ0EyAaow',
    ],
    'T1.C Mireu': [
      'Q1cMtcddNZptIFvpkHKZbZ37gMqGVivZMfqheqm0Y75C2zy2L2lqejM0FXcfNXxacjxqsn6EpAo_GQ',
    ],
    'T1.C Asper': [
      'k7m2u5BKbT1No33WHWebeUcd2cWBlyRgJiGjsTHZgussWIDUxIXWoX9X4SCEzI8AEEyKvhgDy5jd6g',
    ],
    'T1.A Fisher': [
      'dpIGxB74HxotkxgFukXAT7AA21nubKriXJKfy03jAnsqFxHsqfQTdqqWnXcJAZ5G9LZYpsR2KzX3gg',
    ],
  } as const;

  static PUUID_PRIORITY = [
    [
      'UWLdkv7QfJLoaA3pQXEKpmmjrUspydRl7h0h4vZT6U0uSFM9RWXlWw_PXGDrcQs87UmXtvyh_iMAvw',
      'yUP2nDkAUIqoHf6NUCRhrVNcGUWfRaFHW2U1ObXXapqPJdLdAUIiiyw9cjY5JKdsH1SbQ8m8Z_1lNw',
    ],
    [
      'hZrIKNtOVPgQwzto1szBbbKZFp3kaYrcNxC75VCEgfptW1yT34NR0mk-HStLDMiD73F-7qh1dd3KfQ',
      '9aDj-tgh_WvSw-gtSENUrlQm7h0ZKP0ZKSeVljcKdjy7vylCHXvNBQfUXLH2cg2dBtaeHeJ9i5GbNQ',
      'NjZ3zun7yICZXia63MfsimgX-DuVOTUs8gB8UeHBVb_p7e5icfk-nMQG5f4yx4R0CdiZaOBzeBXQOQ',
      'lOkIIiHBFsI_oVSqZMTynLToUI1rIq6dFYjNV7uqgc08RDEV0tquel0Eszlsbt4be7FO1y-1vSoSZw',
      'es_pEWJv1qYgd6-KAWRjzCun4B8JNtc67Avqn27GM8n5MxryUxGq1RCllA5HDJnkDSWk1_-Cf3gScg',
      'jUCaat-sZW6ivHH80Di2ByNrLTh448f6LcW9CN8bkSuyMKG7DD1qciOiNyY5bTWu1Kx8yef2qKp4bA',
      '_iy8yTOfFHtJLD0jME7k5Pg0oMS06PvIUcSV9fZtB0H_0zhKv-nPbLdVcX-5ZzkzoMPrY4LdXGYcaw',
      'vqukIGn2xt_ifiNGjQW27f3i0Wwf5CIq0IZ9lwoMBhEN7rDBT6gF-jCvCCi-eDIYiTCWlmoh4CuLtA',
      'qEM--zGXNVMhLxR06OvdWKwsCQSlytBFByZ2sg9rMBdIAArCKGmRHK3bkwdLDh5866yXSbZ74dWIPQ',
      'GUBCYE4A80jjHFwCDA672pcbRdy0GgPgjHVEQZWIaVfgmrj0aG-eFYEiGtdx8SO30bsibv8CohgquQ',
      'B8O9AUl5CYPiglELcaXXykTE2GiDCGyeNCnC6MiMOMj0tbtSmnz0zcHHrLUsIouDr11Hb34qskQvyQ',
      'HNVV7L-WelxzRk6UcazZsmKH3FCOpwCEwFzIVyDw3TogL5rPdT7b5sFrFc80GCpMX162xdxPy1Z0IA',
      'BthRtIUa_k30h1zYGsZZc-mET0AKzdk1fOr0GcyjtYPzOE2X_lW6d7xgP3qhhwfryoMm59HxOceGTA',
      '2S9-PoYaxCxbZgEXKlQrSNg1RKFGNzLko8h1KJL-NwIhV63HSvF95ogpAvREAVtxipkokNl15saiRg',
      'mLcxi-d4OOjIFcgrPKzgwqQwHq9QckGDLz8tx1FqHIiCtBs1E9ylSRTDARYSZD6Rij1hEvM-eMoHHQ',
      'Z7M_-KQQ8a2aZ9J57ab_2aLq_aCXqqo45_xX7oxokcN2f7un5mrma3P2mS9rO3SZHpy62iTIKM38aw',
      'yLCRXIpOx8RXrGIbB2hM3VQnKuWRQ4Xi76tIMeEnBwu7KusExWOJoDDqFIffvidYoGFeaKMO_urbmQ',
      'NP1_ImmkFtIA6IuzS__2zzZ63M8CpWcdJAtZGYN6MoLxjKfW0L2R7w9nywzj4dAZm9ag9FcE_k8-1A',
      'iKnnw00vpUcA_Pg5TbfQC78KsZGp_svWVqLyoCZ73vcp5zC8rNRYPB2k7sWRvKH-icI--obdE1ExVg',
      'kM5JgMCRqNYhdsf3CxkVbpaVvpilYAGD7oh_tTP6Kk1H4cMxECqpxxE1J7cQBDly92ubf2ZgdYSM7A',
    ],
    [
      'OUQe96GYixaVL_9ygBWm2HXpHO1e223VX9C3b6vfvIHoL5ewo7xh02gcAS0em_5wkFuN17lVmcIbng',
      '2nKp9qzO9u3c6pVrT3ZIXE_Q1w6tpgprs9lyjZ7j2I9dZBLS9LCOqwmnynQTegN8g-X4gZqXvsOHjA',
      'oEuiIBDdUpNird9P5ld5J6AvXYMd9Zo-pWZycVz_So0ZYlJa7FP2urbUYv5JpULA8A_lMYjC7aX-3A',
      'aOGhr7U8qdOBPx8Y0yp4FlN3To8B6AZC5E4Xcqmo6qf1OLT4PztQh70jZz0vXcqr19z_191S-Mfcgw',
      'OrlERSiTCROGFMWoLGW1buHvzXpkpKlQzZRgizQUjS3fgWJQYvXxe03OWw3RSLT__AyIgj_AvTWZ-g',
      'ozMZm8gBRpRIYzbxXWwiItzq23cSIW2NUyNLJfaLmk3EKeHZQUqPjwQwsiyDWEdO4aVrBgn6dfU47g',
      'CAJXxRA8T-XrZIAxi-hbkxZ3RLdJyxqm07HClHrj-FG5CJcxs8ECcHadjfLISr_5IpzY9PLzosxUkg',
      'CKW9HXSSwfa6w-Yrgs4kl4cIb7skmaS94IQ75a68D6f67HJK6A-4fU1CNshQ10AQG_3FdPRclb7mmw',
      '9OzGLp-ba2bv1WH-ObEt7Xmpe1GhEDItFDDva0P2FB864WfzUAQbLD7DGXSbgJyeL7ZoPI3LU3eIyw',
      '0XxzszbA2IRjDI-1wmK9bgEHwrtymPU4P668s2QGE2jsaOAVci12jDXy7ybqlSc482WrRdQ0EyAaow',
      'Q1cMtcddNZptIFvpkHKZbZ37gMqGVivZMfqheqm0Y75C2zy2L2lqejM0FXcfNXxacjxqsn6EpAo_GQ',
      'k7m2u5BKbT1No33WHWebeUcd2cWBlyRgJiGjsTHZgussWIDUxIXWoX9X4SCEzI8AEEyKvhgDy5jd6g',
      'dpIGxB74HxotkxgFukXAT7AA21nubKriXJKfy03jAnsqFxHsqfQTdqqWnXcJAZ5G9LZYpsR2KzX3gg',
    ],
  ] as const;

  static TEAM_ACRONYM = {
    RNG: 'RNG',
    Progamer: '',
    'G-Rex': 'GRX',
    T1: 'T1',
    'Clutch Gaming': 'DIG',
    'VSG (Korean Team)': 'VSG',
    AXIZ: 'AXZ',
    '100 Thieves': '100',
    'FunPlus Phoenix': 'FPX',
    DRX: 'DRX',
    'Liiv SANDBOX': 'LSB',
    'Seorabeol Gaming': 'SRB',
    'Invictus Gaming': 'IG',
    'Team Liquid': 'TL',
    'EDward Gaming': 'EDG',
    'SoftBank Hawks': 'SHG',
    'bbq Olivers': 'BBQ',
    Suning: 'SN',
    'DWG KIA': 'DK',
    'Sengoku Gaming': 'SG',
    'Beşiktaş Esports': 'BJK',
    'Flamengo eSports': 'FLA',
    'T1 Challengers': 'T1.C',
    'Rascal Jester': 'RJ',
    Griffin: 'GRF',
    Winners: 'WNS',
    'Team Flash': 'FL',
    'GC Busan Rising Star': 'RSG',
    'Afreeca Freecs': 'AF',
    'Jin Air Green Wings': 'JAG',
    'Counter Logic Gaming': 'CLG',
    'Hanwha Life Esports Academy': 'HLE.A',
    'FunPlus Blaze': 'FPB',
    'LGD Gaming': 'LGD',
    'OZ Gaming': 'OZ',
    'PSG Talon': 'PSG',
    'Royal Never Give Up': 'RNG',
    'Hanwha Life Esports': 'HLE',
    'V3 Esports': 'V3',
    'SK Gaming': 'SK',
    'Team WE': 'WE',
    'ahq e-Sports Club': 'AHQ',
    'LNG Esports': 'LNG',
    'JD Gaming': 'JDG',
    'Gen.G': 'GEN',
    'Vici Gaming': 'RA',
    'Rogue Warriors': 'RW',
    FlyQuest: 'FLY',
    'Fredit BRION': 'BRO',
    'KT Rolster': 'KT',
    'Top Esports': 'TES',
    'Team Dynamics Academy': 'NS.A',
    'NS RedForce': 'NS',
    'Awesome Spear': 'SPG',
    'Crest Gaming Act': 'CGA',
    RunAway: 'RNW',
    'Burning Core': 'BC',
    'J Team': 'JT',
    'Bilibili Gaming': 'BLG',
    'Team Vitality': 'VIT',
    'Gen.G Academy': 'GEN.A',
    'Legend Esport Gaming': 'LEG',
    'Team WE Academy': 'WEA',
    'DetonatioN FocusMe': 'DFM',
    'All Knights': 'AK',
    'Element Mystic': 'EM',
    'SANDBOX Gaming Academy': 'LSB.A',
    'Oh My God': 'OMG',
    'KaBuM eSports': 'KBM',
    'Fredit BRION Academy': 'BRO.A',
    'Machi E-Sports': 'MCX',
    'Kaos Latin Gamers': 'KLG',
    'Afreeca Freecs Academy': 'AF.A',
    'Rogue Warriors Shark': 'RWS',
    'Dominus Esports': 'TT',
    eStar: 'ES',
    'Top Esports Challenger': 'TES.C',
    'Young Miracles': 'YM',
    'Hong Kong Attitude': 'HKA',
    'Suning Gaming-S': 'SNS',
    'IG Young': 'IGY',
    'Victory Five': 'V5',
    'Joy Dream': 'JDM',
    Cloud9: 'C9',
    'GAM Esports': 'GAM',
  } as const;
}
