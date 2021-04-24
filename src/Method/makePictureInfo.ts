import { readdir } from 'fs/promises';
import { join } from 'path';

export default async () => {
  const { ASSET_PATH } = process.env;
  const picturePath =
    (ASSET_PATH && join(ASSET_PATH, 'pictures')) ||
    join(__dirname, '..', '..', 'assets', 'pictures');
  let pictures: string[] = [];
  const pictureMap = new Map<string, number>();
  try {
    pictures = await readdir(picturePath);
  } catch (error) {
    console.error(JSON.stringify(error));
    return {
      pictures,
      pictureMap,
    };
  }
  pictures.forEach((file, index) => {
    const [name] = file.split(' ');
    pictureMap.set(name.trim().toLowerCase(), index);
  });
  return {
    pictures,
    pictureMap,
  };
};
