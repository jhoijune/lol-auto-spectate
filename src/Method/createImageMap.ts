import { readdir } from 'fs/promises';
import { join } from 'path';

export default async () => {
  const { ASSET_PATH } = process.env;
  const imagePath =
    (ASSET_PATH && join(ASSET_PATH, 'images')) ||
    join(__dirname, '..', '..', 'assets', 'images');
  let imageNames: string[];
  const imageMap = new Map<string, string>(); // 선수 이름 -> 전체 파일이름
  try {
    imageNames = await readdir(imagePath);
  } catch (error: any) {
    console.error(JSON.stringify(error));
    return null;
  }
  for (const imageName of imageNames) {
    const index = imageName.lastIndexOf(' ');
    const name = imageName.slice(0, index).trim().toLowerCase();
    imageMap.set(name, imageName);
  }
  return imageMap;
};
