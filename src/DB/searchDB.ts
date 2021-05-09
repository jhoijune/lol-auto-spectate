import inquirer from 'inquirer';
import { Op } from 'sequelize';

import connectDB from '../Models';
import { ProInstance } from '../types';

type Category = 'Summoner name' | 'Pro name' | 'Team name';

export default async () => {
  const { Summoner, Pro, Team } = await connectDB();

  const createTeamLog = async function (proInstance: ProInstance) {
    const logs: string[] = [];
    const teamInstance = await Team.findOne({
      where: {
        id: proInstance.team_id,
      },
    });
    if (teamInstance !== null) {
      logs.push(`Team Name : ${teamInstance.name}`);
      logs.push(`Exact Team Name : ${teamInstance.exact_name}`);
    } else {
      console.log(
        `Team Id with [${proInstance.team_id}] does not exist, so please correct it`
      );
      return null;
    }
    return logs;
  };

  while (true) {
    const { category, name } = await inquirer.prompt<{
      category: Category;
      name: string;
    }>([
      {
        type: 'list',
        name: 'category',
        message: 'What do you want to search for?',
        choices: ['Summoner name', 'Pro name', 'Team name'],
        default: 'permission',
      },
      {
        type: 'input',
        name: 'name',
        message: 'What name are you looking for?',
      },
    ]);
    const logs: string[] = [];
    if (category === 'Summoner name') {
      const summonerInstances = await Summoner.findAll({
        where: {
          name: { [Op.like]: `%${name}%` },
        },
      });
      for (const summonerInstance of summonerInstances) {
        logs.push(`Summoner Name : ${summonerInstance.name}`);
        const proInstance = await Pro.findOne({
          where: {
            id: summonerInstance.pro_id,
          },
        });
        if (proInstance !== null) {
          logs.push(`Pro Name : ${proInstance.name}`);
          if (proInstance.image_name !== null) {
            logs.push(`Image Name : ${proInstance.image_name}`);
          }
          if (proInstance.team_id !== null) {
            const teamLogs = await createTeamLog(proInstance);
            if (teamLogs === null) {
              return;
            }
            logs.push(...teamLogs);
          }
          logs.push('');
        } else {
          console.log(
            `Pro Id with [${summonerInstance.pro_id}] does not exist, so please correct it`
          );
          return;
        }
      }
    } else if (category === 'Pro name') {
      const proInstances = await Pro.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
      for (const proInstance of proInstances) {
        logs.push(`Pro Name : ${proInstance.name}`);
        if (proInstance.image_name !== null) {
          logs.push(`Image Name : ${proInstance.image_name}`);
        }
        if (proInstance.team_id !== null) {
          const teamLogs = await createTeamLog(proInstance);
          if (teamLogs === null) {
            return;
          }
          logs.push(...teamLogs);
        }
        const summonerInstances = await Summoner.findAll({
          where: {
            pro_id: proInstance.id,
          },
        });
        for (const summonerInstance of summonerInstances) {
          logs.push(`Summoner Name : ${summonerInstance.name}`);
        }
        logs.push('');
      }
    } else {
      const teamInstances = await Team.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${name}%` } },
            { exact_name: { [Op.like]: `%${name}%` } },
          ],
        },
      });
      for (const teamInstance of teamInstances) {
        logs.push(`Team Name : ${teamInstance.name}`);
        logs.push(`Exact Team Name : ${teamInstance.exact_name}`);
        const proInstances = await Pro.findAll({
          where: {
            team_id: teamInstance.id,
          },
        });
        for (const proInstance of proInstances) {
          logs.push('');
          logs.push(`Pro Name : ${proInstance.name}`);
          if (proInstance.image_name !== null) {
            logs.push(`Image Name : ${proInstance.image_name}`);
          }
          const summonerInstances = await Summoner.findAll({
            where: {
              pro_id: proInstance.id,
            },
          });
          for (const summonerInstance of summonerInstances) {
            logs.push(`Summoner Name : ${summonerInstance.name}`);
          }
        }
        logs.push('');
      }
    }
    console.log();
    console.log(`What you've entered is ${name}`);
    console.log();
    console.log(logs.join('\n'));
  }
};
