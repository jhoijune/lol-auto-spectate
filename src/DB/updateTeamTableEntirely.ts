import axios from 'axios';
import cheerio from 'cheerio';
import { Op } from 'sequelize';

import connectDB from '../Models';
import Constants from '../Constants';
import { printDate } from '../Method';
import inquirer from 'inquirer';

export default async () => {
  // 정상적으로 완료되었을시 true 반환
  const db = await connectDB({ logging: false });
  const structureDb = await connectDB({ logging: false, dbName: 'structure' });
  let html: string;
  try {
    console.log(`Starting GET ${Constants.PRO_LIST_URL} ${printDate()}`);
    ({ data: html } = await axios.get<string>(Constants.PRO_LIST_URL));
  } catch (error) {
    console.error(JSON.stringify(error));
    console.log("OP.GG Doesn't work");
    return false;
  } finally {
    console.log(
      `GET request finished for: ${Constants.PRO_LIST_URL} ${printDate()}`
    );
  }
  const $ = cheerio.load(html);
  const teams = $('.TeamName');
  const teamNames: string[] = [];
  teams.each((index, elem) => {
    const teamName = $(elem).text().trim();
    teamNames.push(teamName);
  });
  for (const teamName of teamNames) {
    const teamInstance = await db.Team.findOne({
      where: {
        [Op.or]: [{ name: teamName }, { exactName: teamName }],
      },
    });
    if (teamInstance === null) {
      const { isConfirm } = await inquirer.prompt<{ isConfirm: boolean }>({
        type: 'confirm',
        name: 'isConfirm',
        message: `[${teamName}] team name does not exist in db Do you want to add it?`,
        default: false,
      });
      if (isConfirm) {
        const { name, exactName } = await inquirer.prompt<{
          name: string;
          exactName: string;
        }>([
          {
            type: 'input',
            name: 'name',
            message: `What is team name? [${teamName}]`,
            default: teamName,
          },
          {
            type: 'input',
            name: 'exactName',
            message: `What is exact team name? [${teamName}]`,
            default: teamName,
          },
        ]);
        db.Team.create({
          name,
          exactName: exactName,
        });
        structureDb.Team.create({
          name,
          exactName: exactName,
        });
      }
    }
  }
};
