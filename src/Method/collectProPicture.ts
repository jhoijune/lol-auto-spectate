import puppeteer from 'puppeteer';
import { promises as fs, constants } from 'fs';
import path from 'path';

import mapNickToName from './mapNickToName';

export default async () => {
  const picturesPath = path.join(__dirname, '..', '..', 'assets', 'pictures');
  let isDirectoryExist = false;
  try {
    // folder init
    await fs.access(
      picturesPath,
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
      console.log('Create pictures directory');
      await fs.mkdir(picturesPath);
    } catch (error) {
      console.error(error);
    }
  }
  const nickMap = await mapNickToName();
  if (nickMap === null) {
    return;
  }
  const proNameSet = new Set<string>();
  for (const [, teamName] of nickMap) {
    const [teamOrName, name] = teamName.split(' ');
    if (name === undefined) {
      proNameSet.add(teamOrName);
    } else {
      proNameSet.add(name);
    }
  }
  const fileMap = new Map<string, string>();
  try {
    const files = await fs.readdir(picturesPath);
    for (const file of files) {
      const [name, fileName] = file.split(' ');
      fileMap.set(name, fileName);
    }
  } catch (error) {
    console.error(error);
  }
  const URL = 'https://lol.gamepedia.com/';
  const IMAGE_SELECTOR = '#infoboxPlayer img';
  const browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  const proNames = [...proNameSet];
  const missingNames: string[] = [];
  const size = proNames.length;
  let index = 0;
  let isClosed = false;
  while (index < size) {
    try {
      if (isClosed) {
        // TODO: 에러 해결이 안되면 브라우저도 새로 열어야 됨
        page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        isClosed = false;
      }
      const name = proNames[index];
      await page.goto(`${URL}${name}`);
      console.log(`GOTO ${URL}${name}`);
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
        const fileName = imageHref.split('/')[7];
        let isWrite = true;
        if (fileMap.has(name)) {
          if (fileMap.get(name) !== fileName) {
            const fileName = `${name} ${fileMap.get(name)!}`;
            console.log(`Delete picture ${fileName}`);
            fs.rm(path.join(picturesPath, fileName));
          } else {
            isWrite = false;
          }
        }
        if (isWrite) {
          const endIndex = imageHref.indexOf('/revision');
          const viewSource = await page.goto(imageHref.slice(0, endIndex));
          fs.writeFile(
            path.join(picturesPath, `${name} ${fileName}`),
            await viewSource.buffer()
          );
          console.log(`Create picture ${fileName}`);
        }
      } else {
        missingNames.push(name);
      }
      index += 1;
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
