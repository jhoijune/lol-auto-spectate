import { Op } from 'sequelize';

import { DB } from '../types';
import { searchSummonerName } from '../Method';

export default async (
  db: DB,
  summonerName: string,
  proName: string,
  teamName: string,
  imageMap?: Map<string, string>
) => {
  const instance = await db.Summoner.findOne({
    where: {
      name: summonerName,
    },
  });
  if (instance === null) {
    // db에 summonerName이 없을 때
    const data = await searchSummonerName(summonerName);
    if (typeof data === 'number') {
      switch (data) {
        case 403: {
          return false;
        }
      }
      return true;
    }
    const instance = await db.Summoner.findOne({
      where: {
        summoner_id: data.id,
      },
    });
    if (instance !== null) {
      // db에 summonerId가 있을 때 db summonerName 갱신
      instance.name = data.name;
      instance.save();
    } else {
      // db에 summonerId가 없을 때 새로 추가
      const proInstance = await db.Pro.findOne({
        where: {
          name: proName,
        },
      });
      let proId: number;
      if (proInstance === null) {
        // 프로이름이 없을 때
        let teamId: null | number = null;
        if (teamName !== 'Progamer') {
          // team테이블에서 teamName으로 exact_name 레코드 검색해서 id 반환
          const teamInstance = await db.Team.findOne({
            where: {
              [Op.or]: [{ name: teamName }, { exact_name: teamName }],
            },
          });
          if (teamInstance === null) {
            // 팀 이름이 맞는게 없을 때
            console.log(`Renew the team table ${teamName}`);
          } else {
            teamId = teamInstance.id;
          }
        }
        // image폴터에 pro 이름이 있는지 확인
        let imageName: null | string = null;
        if (imageMap && imageMap.has(proName.toLowerCase())) {
          imageName = imageMap.get(proName.toLowerCase())!;
        }
        // pro 테이블에 insert한뒤 id반환
        proId = (
          await db.Pro.create({
            name: proName,
            image_name: imageName,
            team_id: teamId,
          })
        ).id;
      } else {
        // 프로이름이 있을 때
        proId = proInstance.id;
      }
      // summoner에 insert
      db.Summoner.create({
        name: data.name,
        summoner_id: data.id,
        pro_id: proId,
      });
    }
  }
  return true;
};
