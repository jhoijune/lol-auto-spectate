import fs from 'fs/promises';
import { join } from 'path';
import { Op } from 'sequelize';

import { DB } from '../types';

export default async (db: DB) => {
  const { ASSET_PATH } = process.env;
  const imagePath =
    (ASSET_PATH && join(ASSET_PATH, 'images')) ||
    join(__dirname, '..', '..', 'assets', 'images');
  let imageNames: string[];
  try {
    imageNames = await fs.readdir(imagePath);
  } catch (error) {
    console.error(error);
    return false;
  }
  const imageNameSet = new Set(imageNames);
  /*
      사진을 변경하거나 추가했을 경우
       pictures 폴더에 파일이름들 split해서 pro디비에 lowercase 이름으로
       셀렉트한다음 인스턴스가 있을 때 이미지 네임이 다르다면 폴더의 파일이름으로 갱신
       인스턴스가 없다면 파일 삭제
    */
  const operations: Promise<boolean>[] = [];
  for (const imageName of imageNameSet) {
    const [name] = imageName.split(' ');
    const opertaion = db.Pro.findOne({
      where: {
        name: {
          [Op.like]: name,
        },
      },
    })
      .then((instance) => {
        if (instance !== null && instance.image_name !== imageName) {
          instance.image_name = imageName;
          instance.save();
        } else if (instance === null) {
          fs.rm(join(imagePath, imageName));
        }
        return true;
      })
      .catch((error) => {
        if (error) {
          console.error(error);
        }
        return false;
      });
    operations.push(opertaion);
  }
  const isSuccess = await Promise.all(operations);
  if (isSuccess.includes(false)) {
    return false;
  }
  /*
    사진을 제거했을 경우
    pro디비에서 image_name이 null이 아닐때 
    pictures폴더에 파일이 있는지 검사한 후 없으면 null로 변경
     */
  try {
    const proInstances = await db.Pro.findAll({
      where: {
        image_name: { [Op.ne]: null },
      },
    });
    for (const proInstance of proInstances) {
      if (
        proInstance.image_name !== null &&
        !imageNameSet.has(proInstance.image_name)
      ) {
        proInstance.image_name = null;
        proInstance.save();
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};
