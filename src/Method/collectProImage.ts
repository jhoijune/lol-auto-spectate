import puppeteer from 'puppeteer';
import { promises as fs, constants } from 'fs';
import path from 'path';
import { DB } from '../types';

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
      const name = fileName.slice(0, index).toLowerCase();
      const rearFileName = fileName.slice(index + 1);
      fileNameMap.set(name, rearFileName);
    }
  } catch (error) {
    console.error(error);
    return;
  }
  const URL = 'https://lol.fandom.com/wiki/';
  const IMAGE_SELECTOR = '#infoboxPlayer img';
  const browser = await puppeteer.launch({ headless: true });
  let page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  const proInstances = await db.Pro.findAll({});
  const missingNames: string[] = [];
  const size = proInstances.length;
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
      const { name } = proInstances[index];
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
        const crawledFileName = imageHref.split('/')[7];
        let isWrite = true;
        if (fileNameMap.has(name.toLowerCase())) {
          if (fileNameMap.get(name.toLowerCase()) !== crawledFileName) {
            const fileName = `${name} ${fileNameMap.get(name.toLowerCase())!}`;
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
            path.join(imagePath, `${name} ${crawledFileName}`),
            await viewSource.buffer()
          );
          console.log(`Create picture ${crawledFileName}`);
          proInstances[index].image_name = `${name} ${crawledFileName}`;
          proInstances[index].save();
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
