import axios from 'axios';
import sleep from './sleep';
import printDate from './printDate';
import Constants from '../Constants';
import { Data, PlayerList } from '../types';

type Name = keyof typeof Constants.PRIORITIES;

export default async (data: Data) => {
  const overlayInfos: { index: number; name: string; imgSrc?: string }[] = [];
  try {
    await sleep(1000);
    console.log(`Starting GET ${Constants.PLAYERLIST_URL} ${printDate()}`);
    const { data: gameInfo } = await axios.get<PlayerList>(
      Constants.PLAYERLIST_URL,
      {
        httpsAgent: data.httpsAgent,
      }
    );
    if (gameInfo.length !== data.peopleCount) {
      data.isSpectating = false;
      return [];
    }
    let redStart: number = Constants.NONE;
    for (let index = 0; index < gameInfo.length; index++) {
      const { summonerName, team } = gameInfo[index];
      const trimmedTeam = team.trim();
      if (trimmedTeam === 'CHAOS' && redStart === Constants.NONE) {
        redStart = index;
      }
      const trimmedName = summonerName.trim();
      if (data.nickMap.has(trimmedName)) {
        // 프로와 매핑
        const teamAndName = data.nickMap.get(trimmedName)!;
        const playerIndex =
          trimmedTeam === 'ORDER' ? index : 5 + (index - redStart);
        const info: { index: number; name: string; imgSrc?: string } = {
          index: playerIndex,
          name: teamAndName,
        };
        const [teamOrName, name] = teamAndName.split(' ');
        if (name === undefined && data.pictureMap.has(teamOrName)) {
          const picIndex = data.pictureMap.get(teamOrName)!;
          info.imgSrc = data.pictures[picIndex];
        } else if (name !== undefined && data.pictureMap.has(name)) {
          const picIndex = data.pictureMap.get(name)!;
          info.imgSrc = data.pictures[picIndex];
        }
        if (teamAndName in Constants.PRIORITIES) {
          data.pq.add(Constants.PRIORITIES[teamAndName as Name], {
            name: teamAndName,
            playerIndex,
          });
        }
        overlayInfos.push(info);
      }
    }
    data.isSpectating = true;
  } catch {
  } finally {
    console.log(
      `GET request finished for: ${Constants.PLAYERLIST_URL} ${printDate()}`
    );
  }
  return overlayInfos;
};