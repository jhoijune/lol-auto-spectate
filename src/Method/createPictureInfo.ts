import { readdir } from 'fs/promises';
import { join } from 'path';

const picturePath = join(__dirname, '..', '..', 'assets', 'pictures');

export default async () => {
  let pictures: string[] | null = null;
  const pictureMap = new Map<string, number>();
  while (pictures === null) {
    try {
      pictures = await readdir(picturePath);
    } catch (error) {
      console.log(error);
    }
  }
  pictures.forEach((file, index) => {
    const [name] = file.split(' ');
    pictureMap.set(name, index);
  });
  return {
    pictures,
    pictureMap,
  };
};
