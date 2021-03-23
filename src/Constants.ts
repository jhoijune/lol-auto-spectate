export default class {
  static PRO_LIST_URL = 'https://op.gg/spectate/list' as const;

  static PLAYERLIST_URL = 'https://127.0.0.1:2999/liveclientdata/playerlist' as const;

  static EVENDATA_URL = 'https://127.0.0.1:2999/liveclientdata/eventdata' as const;

  static GAME_STATS_URL = 'https://127.0.0.1:2999/liveclientdata/gamestats' as const;

  static SUMMONER_PUUID_URL = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/' as const;

  static SPECTATE_URL = 'https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/' as const;

  static STREAMS_URL = 'https://api.twitch.tv/helix/streams' as const;

  static BROADCASTER_URL = 'https://api.twitch.tv/helix/channels?broadcaster_id' as const;

  static RIOT_API_WAIT_TIME = 2 * 60 * 10;

  static RIOT_API_LIMIT_TIME = 2 * 60 * 1000;

  static SUMMONERS_RIFT_ID = 11 as const;

  static SOLO_RANK_ID = 420 as const;

  static GAME_END = 'GameEnd' as const;

  static NONE = -1 as const;

  static PRIORITIES = {
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
    't1_teddy',
    't1_cuzz',
    'canna',
    't1_ellim',
    'gumayusi',
    't1_keria',
    'clozer_t1',
  ] as const;

  static PUUID = {
    Faker: [
      'K-RHiagBRJBET8cgrCowFJBrqvDGVZnFtzJEkiaOibR7QkZu9Y6cEFOaKVl6phy8MriK-uvWbVYcbQ',
      'OfZwaHMryx1JN2QWBMwWKvp-jAIwIp2tdylDIDp1aU16VgZQbA0_87HqRoh9AHfaIF4sLzSG5C0Rfw',
    ],
    Teddy: [
      'Uas0diIOJ8PFAWqecY_FpI2a9uOtf_dBnyS0s5eq89uVv-jGIP6-UhxDIfbsOH5Z2t4-sQ2GFNDx9A',
      'teC8OvkGMz9lXRzyWR-egykPb2yihOESqCGA1bcyi4IW6SORnvz9aF0-7L7JYfDGMLz-K92l_BcZKA',
    ],
    Cuzz: [
      'r3GgaNjXqKqKVcSIytC95zXK-lcOsigBmClNybJe-K_mJWHqLDN-Dmk7qASAI2is5yDNeDWS8cFcDA',
      '6Lt-b4CJ3JsFVXvB7eHItNte-rPsdh0ZEpd0ivVfdlpcXOsxXNyWGuTO8GZC0gs9A7IMNbmCGkOdaw',
      'iH8cKuPjrhH5qKOy1AKOBBLlXZQlJuKV9IMZWx4UASoInNT5aUsbnMP2j6BZXGLee9-fseEpqH_rPA',
      '9Y9TLhmThj95pm5m_vwzo4Y8rNltkBuTb6_xkvl1xOc6NlxPJ_GP3OJRRyOFrF6xYhYGRd8_yRcCjQ',
    ],
    Canna: [
      'tl5wc9oAfWeAVFL1M_b4-5LkDdTWYduDt8awmXKoTbgFwR8K9vf41-mDVO499jjqtqnvJfd3stbbhg',
      'ls92yAvIqIO9P4Ech7vRDoc9VL27VfHm9kd4sweMQ7aD6JeU9EHitIVKbWJwZeu_J5Wc9rnMunoE9A',
    ],
    Ellim: [
      'xEcxyD9ejDgjJKb3ukadmgDHLk2GfjLzZNdBAsnsft_ReVToo0GZPTHfEromIBm7Ek_dZssd64AR5w',
      'YfHF2yCIWZAOn-GFLxy9JD1149qLcIWYVnionZO2nX0w6oINGvSGOdcIx956p-cBA1jucqWRG8OSyQ',
    ],
    Keria: [
      'l10bUc06VU2YccwmNL4EfvkEX_I6URGmAOM5zLSrWvdlrK_ZVpeOSC-PucLu9zNfT7pazLlguYzlGQ',
      'O_g4xo20sv3k6ZYCNEk2-iZWG5PMrnL8zt_WGd8LJRo5gzVXM2CLtuNgqUP9l-rmu_KFbMkXl7AFKw',
    ],
    Gumayusi: [
      'S4Fh4OPPkfgh7kVcE0wwSDmXGiDSxd1U8uk-Sa1fUURR8l6Ys-YbkUmPg2gcw2SFr5ZveLsiij8JQQ',
      'pi_H60WCfILP9cwNnA3La83qvFsceihHSIX3S9UdMwv8ykv4UBjqzhKno35AO427G1KKkVg3aU5lww',
      '9keb_pM0Gh38sHUW27jdWXGXD1Fl9BX_maierw9OFx6bClu9y2SyNv5e6Fp9t7dZvrGpt3zdnMGX_Q',
    ],
    Zeus: [
      'DCNvnlv_68c1h5W8wg2ekRApYTDZB0zFOi0V4t0vjg6amJ7VUZ4MB6mMeP5zfNUe4tGJheEp6HoWCA',
      'd8KXg-EVS_zfiVAnX3_wxgCCGHB3zlz6Bgq-8qw7YMBrAR0xLIbDd0WGSgD9l4TwXVaCsxXD_g4jdA',
      'E17onfoRI2ayPuLfzSIE1Oncvp1vTdSVxf19U0XsBA9JL1G3BKQLvYYxnXK15mXmAvdxKx4_UxE4cg',
    ],
    Clozer: [
      'i_u-TDtuRiIZcxV1CXuqqdOax6nKb7RlYd_sl2kQU23fJdCxchsTu9-YkmG7SR9p9NsSFzBtAhtC0Q',
      '4tLNNRDyxWcn1U6iF2188DjneHVOm4mXbJJPoEgiKwSxJcRj86X0aj7dlI0_qXGyq_4YdCHT3_5iqg',
      'xT_wuTLRsuj6Y-SUh58HHSIocIZRxOTbc3Zh95IeCZwTBlnKQ4WouecEb4eJSzjtab4N4Ph2KaaOyw',
    ],
    Hoit: [
      'cMcy76YuzNHdwd9UsqyQDznVhiSYTj96BZIRB0VptsDqQPdH3cb0lMeg6LSIN9-sGTTR-kryK-NewA',
      'p3qgvFLN3AbelnrIIxVKjgRo0HQVV4nNuk6EP070MwuWLP_tXM3XuyFvRuHVbU3lDNCyiESw0UBLmA',
      '1gw6ErqS2afKi22C4COyo35gMQPoZLXorB4iVsLoDKare7wNHArAMg6_X9shgK1pq-lUSJiz2fVxTg',
    ],
    Roach: [
      'Z3sDfpx5MyVYLtQogKNCvGtZOQ42N8B_DH1F_eUqApN5Atkn9HL6Q9eNu16Q9WDphNPzwu_KtWW9VQ',
      'kK3bXZRPYsVQSOsJE2rmdwq00CvQsQbQCoAgFYLDOCBgaRYvyH2EURly4vqOJlXPx-6xMep4Y4843g',
    ],
    Berserker: [
      '5nAFnM35saWj1Drrijz8cYHCb0Cr2z3pyUSA_Gr1L0gbhJjoFvMXiqoUWMdOjkLQMZjlZCgqZADPpQ',
    ],
    Mowgli: [
      'fCfw6jLKT70Lm_i8xyu-lf1ShAuB9TbZe1GFzy5yvisGmthIhcyMVJJaOlVjYC0Po_Mi-sKQ2ZtsYA',
    ],
    Mireu: [
      'j6JGdklJxdOTVAJoXjeCwT6fDBFRRs9F_iW-2zyo5FNQAOLfhTTf_OZ8mNZkaBKRofBkTiSQzjTITA',
      'GJY-5I39D2PqS9mVqqtcNxJ90kci3Pey0tEV3O1C02zwBtcdxuN5wT7yNFsdzXK1WWzYeB8Mx4khbg',
    ],
    Asper: [
      'AerCri17saiPNIc27kjru_VcKRfztTUtNBbTLDHs-tTblPFd_wKXR_s-iicQTCcW8tq4NvCVJAF1eA',
    ],
    Fisher: [
      'tS3wb65ZACOvp42fxdX97VxUA_BmNKTW5HEY6shzmAZOqRTyENlucPc9BjaQA3QPZmhaAZVhzvYEGw',
    ],
  } as const;

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
    'T1 Challengers': 'T1C',
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
    'Crest Gaming Act': '',
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
    'Top Esports Challenger': 'TESC',
    'Young Miracles': 'YM',
    'Hong Kong Attitude': 'HKA',
    'Suning Gaming-S': 'SNS',
    'IG Young': 'IGY',
    'Victory Five': 'V5',
    'Joy Dream': 'JDM',
    Cloud9: 'C9',
    'GAM Esports': 'GAM',
  } as const;

  static PUUID_PRIORITY = [
    [
      'K-RHiagBRJBET8cgrCowFJBrqvDGVZnFtzJEkiaOibR7QkZu9Y6cEFOaKVl6phy8MriK-uvWbVYcbQ',
      'OfZwaHMryx1JN2QWBMwWKvp-jAIwIp2tdylDIDp1aU16VgZQbA0_87HqRoh9AHfaIF4sLzSG5C0Rfw',
    ],
    [
      'Uas0diIOJ8PFAWqecY_FpI2a9uOtf_dBnyS0s5eq89uVv-jGIP6-UhxDIfbsOH5Z2t4-sQ2GFNDx9A',
      'teC8OvkGMz9lXRzyWR-egykPb2yihOESqCGA1bcyi4IW6SORnvz9aF0-7L7JYfDGMLz-K92l_BcZKA',
      'r3GgaNjXqKqKVcSIytC95zXK-lcOsigBmClNybJe-K_mJWHqLDN-Dmk7qASAI2is5yDNeDWS8cFcDA',
      '6Lt-b4CJ3JsFVXvB7eHItNte-rPsdh0ZEpd0ivVfdlpcXOsxXNyWGuTO8GZC0gs9A7IMNbmCGkOdaw',
      'iH8cKuPjrhH5qKOy1AKOBBLlXZQlJuKV9IMZWx4UASoInNT5aUsbnMP2j6BZXGLee9-fseEpqH_rPA',
      '9Y9TLhmThj95pm5m_vwzo4Y8rNltkBuTb6_xkvl1xOc6NlxPJ_GP3OJRRyOFrF6xYhYGRd8_yRcCjQ',
      'tl5wc9oAfWeAVFL1M_b4-5LkDdTWYduDt8awmXKoTbgFwR8K9vf41-mDVO499jjqtqnvJfd3stbbhg',
      'ls92yAvIqIO9P4Ech7vRDoc9VL27VfHm9kd4sweMQ7aD6JeU9EHitIVKbWJwZeu_J5Wc9rnMunoE9A',
      'xEcxyD9ejDgjJKb3ukadmgDHLk2GfjLzZNdBAsnsft_ReVToo0GZPTHfEromIBm7Ek_dZssd64AR5w',
      'YfHF2yCIWZAOn-GFLxy9JD1149qLcIWYVnionZO2nX0w6oINGvSGOdcIx956p-cBA1jucqWRG8OSyQ',
      'l10bUc06VU2YccwmNL4EfvkEX_I6URGmAOM5zLSrWvdlrK_ZVpeOSC-PucLu9zNfT7pazLlguYzlGQ',
      'O_g4xo20sv3k6ZYCNEk2-iZWG5PMrnL8zt_WGd8LJRo5gzVXM2CLtuNgqUP9l-rmu_KFbMkXl7AFKw',
      'S4Fh4OPPkfgh7kVcE0wwSDmXGiDSxd1U8uk-Sa1fUURR8l6Ys-YbkUmPg2gcw2SFr5ZveLsiij8JQQ',
      'pi_H60WCfILP9cwNnA3La83qvFsceihHSIX3S9UdMwv8ykv4UBjqzhKno35AO427G1KKkVg3aU5lww',
      '9keb_pM0Gh38sHUW27jdWXGXD1Fl9BX_maierw9OFx6bClu9y2SyNv5e6Fp9t7dZvrGpt3zdnMGX_Q',
      'DCNvnlv_68c1h5W8wg2ekRApYTDZB0zFOi0V4t0vjg6amJ7VUZ4MB6mMeP5zfNUe4tGJheEp6HoWCA',
      'd8KXg-EVS_zfiVAnX3_wxgCCGHB3zlz6Bgq-8qw7YMBrAR0xLIbDd0WGSgD9l4TwXVaCsxXD_g4jdA',
      'E17onfoRI2ayPuLfzSIE1Oncvp1vTdSVxf19U0XsBA9JL1G3BKQLvYYxnXK15mXmAvdxKx4_UxE4cg',
      'cMcy76YuzNHdwd9UsqyQDznVhiSYTj96BZIRB0VptsDqQPdH3cb0lMeg6LSIN9-sGTTR-kryK-NewA',
      'p3qgvFLN3AbelnrIIxVKjgRo0HQVV4nNuk6EP070MwuWLP_tXM3XuyFvRuHVbU3lDNCyiESw0UBLmA',
      '1gw6ErqS2afKi22C4COyo35gMQPoZLXorB4iVsLoDKare7wNHArAMg6_X9shgK1pq-lUSJiz2fVxTg',
      'i_u-TDtuRiIZcxV1CXuqqdOax6nKb7RlYd_sl2kQU23fJdCxchsTu9-YkmG7SR9p9NsSFzBtAhtC0Q',
      '4tLNNRDyxWcn1U6iF2188DjneHVOm4mXbJJPoEgiKwSxJcRj86X0aj7dlI0_qXGyq_4YdCHT3_5iqg',
      'xT_wuTLRsuj6Y-SUh58HHSIocIZRxOTbc3Zh95IeCZwTBlnKQ4WouecEb4eJSzjtab4N4Ph2KaaOyw',
    ],
    [
      'Z3sDfpx5MyVYLtQogKNCvGtZOQ42N8B_DH1F_eUqApN5Atkn9HL6Q9eNu16Q9WDphNPzwu_KtWW9VQ',
      'kK3bXZRPYsVQSOsJE2rmdwq00CvQsQbQCoAgFYLDOCBgaRYvyH2EURly4vqOJlXPx-6xMep4Y4843g',
      '5nAFnM35saWj1Drrijz8cYHCb0Cr2z3pyUSA_Gr1L0gbhJjoFvMXiqoUWMdOjkLQMZjlZCgqZADPpQ',
      'fCfw6jLKT70Lm_i8xyu-lf1ShAuB9TbZe1GFzy5yvisGmthIhcyMVJJaOlVjYC0Po_Mi-sKQ2ZtsYA',
      'j6JGdklJxdOTVAJoXjeCwT6fDBFRRs9F_iW-2zyo5FNQAOLfhTTf_OZ8mNZkaBKRofBkTiSQzjTITA',
      'GJY-5I39D2PqS9mVqqtcNxJ90kci3Pey0tEV3O1C02zwBtcdxuN5wT7yNFsdzXK1WWzYeB8Mx4khbg',
      'AerCri17saiPNIc27kjru_VcKRfztTUtNBbTLDHs-tTblPFd_wKXR_s-iicQTCcW8tq4NvCVJAF1eA',
      'tS3wb65ZACOvp42fxdX97VxUA_BmNKTW5HEY6shzmAZOqRTyENlucPc9BjaQA3QPZmhaAZVhzvYEGw',
    ],
  ] as const;
}
