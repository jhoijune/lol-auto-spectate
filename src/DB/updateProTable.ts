import { Op } from 'sequelize';

import { DB } from '../types';

export default async (db: DB, proName: string, teamName?: string) => {
  const { Pro, Team } = db;
  const proInstance = await Pro.findOne({
    where: {
      name: {
        [Op.like]: proName,
      },
    },
  });
  if (proInstance === null) {
    // 프로이름이 없을 때
    let teamId: null | number = null;
    if (typeof teamName === 'string' && teamName !== 'Progamer') {
      // team테이블에서 teamName으로 exactName 레코드 검색해서 id 반환
      const teamInstance = await Team.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.like]: teamName } },
            { exactName: { [Op.like]: teamName } },
          ],
        },
      });
      if (teamInstance === null) {
        // 팀 이름이 맞는게 없을 때
        console.log(`Renew the team table ${teamName}`);
      } else {
        teamId = teamInstance.id;
      }
    }
    return await Pro.create({
      teamId,
      name: proName,
      imageName: null,
    });
  }
  // 프로이름이 있을 때
  if (
    (typeof teamName === 'undefined' || teamName === 'Progamer') &&
    proInstance.teamId !== null
  ) {
    proInstance.teamId = null;
    proInstance.save();
  } else if (typeof teamName === 'string' && teamName !== 'Progamer') {
    const teamInstance = await Team.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.like]: teamName } },
          { exactName: { [Op.like]: teamName } },
        ],
      },
    });
    if (teamInstance !== null && proInstance.teamId !== teamInstance.id) {
      proInstance.teamId = teamInstance.id;
      proInstance.save();
    }
  }
  return proInstance;
};
