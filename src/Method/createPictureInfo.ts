import { readdir } from 'fs/promises';
import { join } from 'path';

const picturePath = join(__dirname, '..', '..', 'assets', 'pictures');

export default async () => {
  let pictures: string[] = [];
  const pictureMap = new Map<string, number>();
  try {
    pictures = await readdir(picturePath);
  } catch (error) {
    console.error(JSON.stringify(error));
    return;
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
