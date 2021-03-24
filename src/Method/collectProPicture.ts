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
  try {
    const nickMap = await mapNickToName();
    if (nickMap === null) {
      return;
    }
    const proName = new Set<string>();
    for (const [, teamName] of nickMap) {
      const [teamOrName, name] = teamName.split(' ');
      if (name === undefined) {
        proName.add(teamOrName);
      } else {
        proName.add(name);
      }
    }
    const files = await fs.readdir(picturesPath);
    const fileMap = new Map<string, string>();
    for (const file of files) {
      const [name, fileName] = file.split(' ');
      fileMap.set(name, fileName);
    }
    const size = files.length;
    const URL = 'https://lol.gamepedia.com/';
    const IMAGE_SELECTOR = '#infoboxPlayer img';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    for (const name of proName) {
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
          const viewSource = await page.goto(imageHref);
          fs.writeFile(
            path.join(picturesPath, `${name} ${fileName}`),
            await viewSource.buffer()
          );
          console.log(`Create picture ${fileName}`);
        }
      }
    }
    await browser.close();
    console.log('Finished pro picture collect');
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};
