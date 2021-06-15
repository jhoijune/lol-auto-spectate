import puppeteer from 'puppeteer';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { type } from 'os';

import { DB, ProInstance } from '../types';

/**
 * TODO:매개변수로 빼둬야하고 이름을 무조건 소문자로만 적어야됨
 */
const exceptionList = [
  'faker',
  'fisher',
  'rudy',
  'ace',
  'tom',
  'lucid',
  'apdo',
  'avalon',
  'bluff',
  'ambition',
  'choyul',
  'cloudtemplar',
  'crow',
  'dalka',
  'dara',
  'daramg',
  'daydream',
  'edge',
  'firerain',
  'flahm',
  'foy',
  'gap',
  'haeseong',
  'highdin',
  'hipo',
  'ian',
  'hw4ng',
  'jihoon',
  'jiin',
  'karas',
  'light',
  'maknoon',
  'mephi',
  'motive',
  'natu',
  'nofe',
  'nugget',
  'paladin',
  'pure',
  'ragan',
  'rather',
  'regank',
  'rem',
  'riris',
  'road',
  'rumor',
  'scarlet',
  'search',
  'shark',
  'soar',
  'tf blade',
  'veritas',
  'vins',
  'crown',
  'cube (kim chang-seong)',
];

export default async (db: DB) => {
  const { ASSET_PATH } = process.env;
  const imagePath =
    (ASSET_PATH && path.join(ASSET_PATH, 'images')) ||
    path.join(__dirname, '..', '..', 'assets', 'images');
  let isDirectoryExist = false;
  try {
    // folder init
    await fs.access(
      imagePath,
      constants.F_OK || constants.R_OK || constants.W_OK
    );
    isDirectoryExist = true;
  } catch (error) {
    console.error(error);
    if (error.code === 'ENOENT') {
      isDirectoryExist = false;
    }
  }
  if (!isDirectoryExist) {
    try {
      console.log('Create images directory');
      await fs.mkdir(imagePath);
    } catch (error) {
      console.error(error);
      return;
    }
  }
  const fileNameMap = new Map<string, string>();
  try {
    const fileNames = await fs.readdir(imagePath);
    for (const fileName of fileNames) {
      const index = fileName.lastIndexOf(' ');
      const name = fileName.slice(0, index);
      const rearFileName = fileName.slice(index + 1);
      fileNameMap.set(name, rearFileName);
    }
  } catch (error) {
    console.error(error);
    return;
  }
  const exceptionSet = new Set(exceptionList);
  const URL = 'https://lol.fandom.com/wiki';
  const IMAGE_SELECTOR = '#infoboxPlayer img';
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      type() === 'Darwin'
        ? '/Applications/Chromium.app/Contents/MacOS/Chromium'
        : undefined,
  });
  let page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  const proInstances = await db.Pro.findAll({});
  const missingNames: string[] = [];
  const size = proInstances.length;
  let index = 0;
  let isClosed = false;

  const navigatePage = async (
    proInstance: ProInstance,
    url: string
  ): Promise<boolean> => {
    try {
      await page.goto(`${url}`);
      console.log(`GOTO ${url}`);
      const imageHref = await page.evaluate((sel) => {
        const imageOrNull = document.querySelector<HTMLImageElement>(sel);
        if (!imageOrNull) {
          return null;
        }
        return imageOrNull.getAttribute('src');
      }, IMAGE_SELECTOR);
      if (
        imageHref &&
        !imageHref.includes('Unknown_Infobox_Image_-_Player.png')
      ) {
        const crawledFileName = imageHref.split('/')[7];
        let isWrite = true;
        if (fileNameMap.has(proInstance.name)) {
          if (fileNameMap.get(proInstance.name) !== crawledFileName) {
            const fileName = `${proInstance.name} ${fileNameMap.get(
              proInstance.name
            )!}`;
            console.log(`Delete picture ${fileName}`);
            fs.rm(path.join(imagePath, fileName));
          } else {
            isWrite = false;
          }
        }
        if (isWrite) {
          const endIndex = imageHref.indexOf('/revision');
          const viewSource = await page.goto(imageHref.slice(0, endIndex));
          fs.writeFile(
            path.join(imagePath, `${proInstance.name} ${crawledFileName}`),
            await viewSource.buffer()
          );
          console.log(`Create picture ${crawledFileName}`);
          proInstances[
            index
          ].imageName = `${proInstance.name} ${crawledFileName}`;
          proInstances[index].save();
        }
      } else if (!imageHref) {
        if (proInstance.teamId === null) {
          missingNames.push(proInstance.name);
          return true;
        }
        const teamInstance = await db.Team.findOne({
          where: {
            id: proInstance.teamId,
          },
        });
        if (teamInstance === null) {
          missingNames.push(proInstance.name);
          return true;
        }
        const loweredName = teamInstance.name.toLowerCase();
        const loweredExactName = teamInstance.exactName.toLowerCase();
        const urls = await page.evaluate(
          (obj) => {
            const { selector, loweredName, loweredExactName } = obj;
            const lists = document.querySelectorAll<HTMLLIElement>(selector);
            if (lists.length === 0) {
              return null;
            }
            const urls: string[] = [];
            lists.forEach((list) => {
              let teamName = list.querySelector('.teamname')?.textContent;
              if (teamName) {
                teamName = teamName.trim().toLowerCase();
                if (teamName === loweredName || teamName === loweredExactName) {
                  const url = list.querySelector('a')?.href;
                  if (url) {
                    urls.push(url);
                  }
                }
              }
            });
            return urls;
          },
          { selector: '.mw-parser-output ul li', loweredName, loweredExactName }
        );
        if (urls === null || urls.length === 0) {
          missingNames.push(`${teamInstance.name} ${proInstance.name}`);
          return true;
        }
        let isNormal = true;
        for (let index = 0; index < urls.length && isNormal; index++) {
          const url = urls[index];
          if (!(await navigatePage(proInstance, url))) {
            isNormal = false;
          }
        }
        return isNormal;
      }
      return true;
    } catch (error) {
      console.error(error);
      isClosed = true;
      return false;
    }
  };

  while (index < size) {
    try {
      if (isClosed) {
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        isClosed = false;
      }
      const proInstance = proInstances[index];
      if (
        exceptionSet.has(proInstance.name.toLowerCase()) ||
        (await navigatePage(proInstance, `${URL}/${proInstance.name}`))
      ) {
        index += 1;
      }
    } catch (error) {
      console.error(error);
      isClosed = true;
    }
  }
  await browser.close();
  console.log('Finished pro picture collect');
  missingNames.sort();
  console.log('---------Missing name---------');
  console.log(missingNames.join('\n'));
  console.log('----------------End----------------');
};
