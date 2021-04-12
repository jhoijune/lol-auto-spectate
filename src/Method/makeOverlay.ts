import { constants, promises as fs } from 'fs';
import { join } from 'path';
import Constants from '../Constants';
import { Data } from '../types';

const makeComponent = function (info: {
  index: number;
  name: string;
  imgSrc?: string;
}): string {
  const positions = ['top', 'jungle', 'mid', 'adc', 'supporter'];
  const team = info.index < 5 ? 'blue-team' : 'red-team';
  const position = positions[info.index % 5];
  const image = info.imgSrc
    ? `<div class="image-container"><img src="../pictures/${info.imgSrc}"></div>`
    : '';
  return `<div class="${team} ${position}">
  <p${info.name in Constants.PRIORITIES ? ' style="font-weight:bold"' : ''}>${
    info.name
  }</p>
  ${image}
  </div>`;
};

export default async (
  overlayInfos: { index: number; name: string; imgSrc?: string }[],
  data: Data
) => {
  const { ASSET_PATH } = process.env;
  const overlayPath =
    (ASSET_PATH && join(ASSET_PATH, 'overlay')) ||
    join(__dirname, '..', '..', 'assets', 'overlay');
  let isDirectoryExist = false;
  try {
    // folder init
    await fs.access(
      overlayPath,
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
      console.log('Create overlay directory');
      await fs.mkdir(overlayPath);
    } catch (error) {
      console.error(error);
    }
  }

  const components = overlayInfos.map(makeComponent);
  const html = `
  <!DOCTYPE html>
    <head>
      <link rel="stylesheet" href="../overlay-${data.resolution}p.css"/>
    </head>
    <body>
    ${components.join('')}
    </body>
  </html>`;
  try {
    await fs.writeFile(
      join(overlayPath, `${data.gameId}-${data.resolution}p.html`),
      html
    );
  } catch (error) {
    console.error(error);
  }
};
