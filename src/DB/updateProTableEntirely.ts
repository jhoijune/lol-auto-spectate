import inquirer from 'inquirer';
import { Op } from 'sequelize';

import connectDB from '../Models';

export default async (startId: number = 1) => {
  /**
   *  선수 한명씩 돌면서
   * 현재 팀이름 알려주고
   *  팀이름 같은지 다른지
   *  다르면 새로운 팀명으로
   *  새로운 팀명이 없으면  잘못 입력한거로 간주해서 다시 입력하던가
   *  새로운 팀이름을 추가하던가
   */
  const db = await connectDB({ logging: false });
  const structureDb = await connectDB({
    logging: false,
    dbName: 'structure',
  });
  const proInstances = await db.Pro.findAll({
    where: {
      id: {
        [Op.gte]: startId,
      },
    },
  });
  for (const proInstance of proInstances) {
    let teamName = 'Progamer';
    if (proInstance.teamId !== null) {
      const teamInstance = await db.Team.findOne({
        where: {
          id: proInstance.teamId,
        },
      });
      if (teamInstance !== null) {
        teamName = `${teamInstance.name} (${teamInstance.exactName})`;
      }
    }
    const { isRightTeamName } = await inquirer.prompt<{
      isRightTeamName: boolean;
    }>({
      type: 'confirm',
      name: 'isRightTeamName',
      message: `[ ${proInstance.name} ] team name is [ ${teamName} ]. Is it right?`,
      default: true,
    });
    if (isRightTeamName) {
      continue;
    }
    let isTypeRight = false;
    while (!isTypeRight) {
      teamName = (
        await inquirer.prompt<{
          teamName: string;
        }>({
          type: 'input',
          name: 'teamName',
          message: `What is the name of the [ ${proInstance.name} ] team?`,
          default: 'Progamer',
        })
      ).teamName;
      isTypeRight = (
        await inquirer.prompt<{
          isTypeRight: boolean;
        }>({
          type: 'confirm',
          name: 'isTypeRight',
          message: `Is the team name you entered [ ${teamName} ] correct?`,
          default: true,
        })
      ).isTypeRight;
    }
    if (teamName === 'Progamer') {
      proInstance.teamId = null;
      proInstance.save();
      continue;
    }
    const teamInstance = await db.Team.findOne({
      where: {
        [Op.or]: [
          { name: { [Op.like]: teamName } },
          { exactName: { [Op.like]: teamName } },
        ],
      },
    });
    if (teamInstance !== null) {
      proInstance.teamId = teamInstance.id;
      proInstance.save();
      continue;
    }
    console.log(`Team name [ ${teamName} ] does not exist.`);
    const { name, exactName } = await inquirer.prompt<{
      name: string;
      exactName: string;
    }>([
      {
        type: 'input',
        name: 'name',
        message: `What is team name?`,
        default: teamName,
      },
      {
        type: 'input',
        name: 'exactName',
        message: `What is exact team name?`,
        default: teamName,
      },
    ]);
    const newTeamInstance = await db.Team.create({
      name,
      exactName: exactName,
    });
    structureDb.Team.create({
      name,
      exactName: exactName,
    });
    proInstance.teamId = newTeamInstance.id;
    proInstance.save();
  }
};
