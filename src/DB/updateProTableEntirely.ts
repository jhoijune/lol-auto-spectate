import inquirer from 'inquirer';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { Op } from 'sequelize';

import connectDB from '../Models';
import { sleep } from '../Method';
import { ProInstance, DB } from '../types';
import { type } from 'os';

const DOMAIN = 'https://lol.fandom.com';

export default async (db: DB, startId: number = 1) => {
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

  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      type() === 'Darwin'
        ? '/Applications/Chromium.app/Contents/MacOS/Chromium'
        : undefined,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  const util = async (
    path: string,
    proInstance: ProInstance
  ): Promise<string | null> => {
    let html: string;
    try {
      await page.goto(`${DOMAIN}${path}`);
      //await sleep(1 * 1000);
      html = await page.content();
    } catch (error: any) {
      console.error(error);
      return null;
    }
    const $ = cheerio.load(html);
    const table = $('#infoboxPlayer');
    if (table.length === 0) {
      const list = $('#mw-content-text ul');
      if (list.length === 0 || proInstance.teamId === null) {
        return null;
      }
      const teamInstance = await db.Team.findOne({
        where: {
          id: proInstance.teamId,
        },
      });
      if (teamInstance === null) {
        return null;
      }
      let newPath: string | undefined | null = null;
      $(list[0])
        .find('li')
        .each((index, element) => {
          const teamName = $(element)
            .find('.teamname')
            .text()
            .trim()
            .toLowerCase();
          if (
            teamName == teamInstance.name.toLowerCase() ||
            teamName === teamInstance.exactName.toLowerCase()
          ) {
            newPath = $(element).find('a').attr('href');
          }
        });
      if (newPath == null) {
        return null;
      }
      return util(newPath, proInstance);
    }
    const rows = $(table).find('tr');
    let teamName: string | null = null;
    rows.each((index, row) => {
      const cols = $(row).find('td');
      if (cols.length >= 2 && $(cols[0]).text().trim() === 'Team') {
        teamName = $(cols[1]).find('.teamname').text().trim();
      }
    });
    return teamName;
  };

  for (const proInstance of proInstances) {
    console.log(`Current id is ${proInstance.id}`);
    const foundedTeamName = await util(
      `/wiki/${proInstance.name}`,
      proInstance
    );
    let teamName = 'Progamer';
    if (proInstance.teamId !== null) {
      const teamInstance = await db.Team.findOne({
        where: {
          id: proInstance.teamId,
        },
      });
      if (teamInstance !== null) {
        if (
          foundedTeamName !== null &&
          (foundedTeamName.toLowerCase() === teamInstance.name.toLowerCase() ||
            foundedTeamName.toLowerCase() ===
              teamInstance.exactName.toLowerCase())
        ) {
          continue;
        }
        teamName = `${teamInstance.name} (${teamInstance.exactName})`;
      }
    }
    const { isRightTeamName } = await inquirer.prompt<{
      isRightTeamName: boolean;
    }>({
      type: 'confirm',
      name: 'isRightTeamName',
      message: `[ ${proInstance.name} ] team name is [ ${teamName} ].${
        foundedTeamName !== null
          ? ` The team found is named [ ${foundedTeamName} ].`
          : ''
      } Is it right?`,
      default: true,
    });
    if (isRightTeamName) {
      continue;
    }
    let isTypeRight = false;
    while (!isTypeRight) {
      ({ teamName } = await inquirer.prompt<{
        teamName: string;
      }>({
        type: 'input',
        name: 'teamName',
        message: `What is the name of the [ ${proInstance.name} ] team? ${
          foundedTeamName !== null
            ? `The team found is named [ ${foundedTeamName} ]`
            : ''
        }`,
        default: 'Progamer',
      }));
      ({ isTypeRight } = await inquirer.prompt<{
        isTypeRight: boolean;
      }>({
        type: 'confirm',
        name: 'isTypeRight',
        message: `Is the team name you entered [ ${teamName} ] correct?`,
        default: true,
      }));
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
        message: `What is team name? ${
          foundedTeamName !== null
            ? `The team found is named [ ${foundedTeamName} ]`
            : ''
        }`,
        default: teamName,
      },
      {
        type: 'input',
        name: 'exactName',
        message: `What is exact team name? ${
          foundedTeamName !== null
            ? `The team found is named [ ${foundedTeamName} ]`
            : ''
        }`,
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
  await browser.close();
};
