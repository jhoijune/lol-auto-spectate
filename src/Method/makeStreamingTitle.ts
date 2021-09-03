import Constants from '../Constants';
import { AuxData, Data } from '../types';

export default (data: Data, auxData: AuxData) => {
  const proNames: string[] = [];
  //let isFaker = false;
  while (!data.pq.isEmpty()) {
    const [, { name, playerIndex, championName }] = data.pq.remove();
    /*
    if (name === 'Faker') {
      isFaker = true;
    }
    */
    let nameAndChampion = name;
    if (auxData.selectedIndex === Constants.NONE) {
      auxData.selectedIndex = playerIndex;
      if (typeof championName !== 'undefined') {
        nameAndChampion = `${nameAndChampion} (${championName})`;
      }
    }
    proNames.push(nameAndChampion);
  }
  /*
  const streamingTitle = `Spectating: ${proNames.join(', ')}${
    !isFaker ? ' for a while' : ''
  }`;
  */
  const streamingTitle = `Spectating: ${proNames.join(', ')}`;
  return streamingTitle;
};
