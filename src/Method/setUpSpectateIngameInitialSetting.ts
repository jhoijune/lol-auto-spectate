import robot from 'robotjs';

import fixSpectateView from './fixSpectateView';
import Constants from '../Constants';

export default async (playerIndex: number) => {
  try {
    const { width, height } = robot.getScreenSize();
    await robot.moveMouse(width / 2, height / 2);
    await robot.mouseClick('left', false);
    if (playerIndex !== Constants.NONE) {
      await fixSpectateView(playerIndex);
    }
    //  playback menu off
    await robot.keyToggle('u', 'down');
    await robot.keyToggle('u', 'up');
    // scoreboard on
    await robot.keyToggle('o', 'down');
    await robot.keyToggle('o', 'up');
    // target timer on
    await robot.keyToggle('n', 'down');
    await robot.keyToggle('n', 'up');
  } catch (error) {
    console.log(error);
  }
};
