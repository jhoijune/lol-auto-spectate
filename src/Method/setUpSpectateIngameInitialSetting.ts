import robot from 'robotjs';

import fixSpectateView from './fixSpectateView';
import Constants from '../Constants';

export default (playerIndex: number) => {
  robot.setMouseDelay(100);
  robot.setKeyboardDelay(200);
  const { width, height } = robot.getScreenSize();
  robot.moveMouse(width / 2, height / 2);
  robot.mouseClick('left', false);
  //  playback menu off
  robot.keyToggle('u', 'down');
  robot.keyToggle('u', 'up');
  // scoreboard on
  robot.keyToggle('o', 'down');
  robot.keyToggle('o', 'up');
  // target timer on
  robot.keyToggle('n', 'down');
  robot.keyToggle('n', 'up');
  if (playerIndex !== Constants.NONE) {
    fixSpectateView(playerIndex);
  }
};
