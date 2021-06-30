import axios from 'axios';
import sleep from './sleep';
import printDate from './printDate';
import Constants from '../Constants';
import { Data, DB, PlayerList } from '../types';

type Name = keyof typeof Constants.PRIORITIES;

export default async (data: Data, db: DB) => {
  const overlayInfos: {
    index: number;
    name: string;
    imgSrc?: string;
  }[] = [];
  try {
    await sleep(1000);
    console.log(`Starting GET ${Constants.PLAYERLIST_URL} ${printDate()}`);
    const { data: gameInfo } = await axios.get<PlayerList>(
      Constants.PLAYERLIST_URL,
      {
        httpsAgent: data.httpsAgent,
        timeout: 5000,
      }
    );
    if (gameInfo.length !== data.peopleCount) {
      data.isSpectating = false;
      return [];
    }
    let redStart: number = Constants.NONE;
    for (let index = 0; index < gameInfo.length; index++) {
      const { summonerName, team, championName } = gameInfo[index];
      const trimmedTeam = team.trim();
      if (trimmedTeam === 'CHAOS' && redStart === Constants.NONE) {
        redStart = index;
      }
      const summonerInstance = await db.Summoner.findOne({
        where: {
          name: summonerName,
        },
      });
      if (summonerInstance !== null) {
        const proInstance = await db.Pro.findOne({
          where: {
            id: summonerInstance.proId,
          },
        });
        if (proInstance !== null) {
          // 프로와 매핑
          let teamAndName = proInstance.name;
          const bracketIndex = teamAndName.indexOf('(');
          if (bracketIndex !== -1) {
            teamAndName = teamAndName.slice(0, bracketIndex - 1);
          }
          if (proInstance.teamId !== null) {
            const teamInstance = await db.Team.findOne({
              where: {
                id: proInstance.teamId,
              },
            });
            if (teamInstance !== null) {
              teamAndName = `${teamInstance.name} ${teamAndName}`;
            }
          }
          const playerIndex =
            trimmedTeam === 'ORDER' ? index : 5 + (index - redStart);
          const info: {
            index: number;
            name: string;
            imgSrc?: string;
          } = {
            index: playerIndex,
            name: teamAndName,
            imgSrc:
              proInstance.imageName !== null
                ? proInstance.imageName
                : undefined,
          };
          if (proInstance.name in Constants.PRIORITIES) {
            const championInstance = await db.Champion.findOne({
              where: {
                korName: championName.trim(),
              },
            });
            data.pq.add(Constants.PRIORITIES[proInstance.name as Name], {
              name: proInstance.name,
              playerIndex,
              championName:
                championInstance !== null
                  ? championInstance.engName
                  : undefined,
            });
          }
          overlayInfos.push(info);
        }
      }
    }
    data.isSpectating = true;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return null;
    }
  } finally {
    console.log(
      `GET request finished for: ${Constants.PLAYERLIST_URL} ${printDate()}`
    );
  }
  return overlayInfos;
};
