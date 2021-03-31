import checkStreaming from './checkStreaming';
import Constants from '../Constants';
import findMatch from './findMatch';

export default async (idPriority: string[][]) => {
  try {
    if (await checkStreaming(...Constants.PRO_STREAMING_IDS)) {
      const isFakerStreaming = await checkStreaming('faker');
      if (isFakerStreaming) {
        return true;
      }
      const fakerMathcInfo = await findMatch(Constants.FAKER_RANK, idPriority);
      if (fakerMathcInfo === null) {
        return true;
      }
      if (fakerMathcInfo.spectateRank === Constants.NONE) {
        return true;
      }
      return false;
    }
    return false;
  } catch {}
  return false;
};
