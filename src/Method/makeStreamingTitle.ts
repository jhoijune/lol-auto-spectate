import Constants from '../Constants';
import { AuxData, Data } from '../types';

export default (data: Data, auxData: AuxData) => {
  const proNames: string[] = [];
  while (!data.pq.isEmpty()) {
    const [, { name, playerIndex, championName }] = data.pq.remove();
    let nameAndChampion: string;
    if (typeof championName !== 'undefined') {
      nameAndChampion = `${name} (${championName})`;
    } else {
      nameAndChampion = name;
    }
    if (auxData.selectedIndex === Constants.NONE) {
      auxData.selectedIndex = playerIndex;
    }
    proNames.push(nameAndChampion);
  }
  const streamingTitle = `Spectating: ${proNames.join(', ')}`;
  return streamingTitle;
};
