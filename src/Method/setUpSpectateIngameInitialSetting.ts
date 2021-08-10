import robot from 'robotjs';

import fixSpectateView from './fixSpectateView';

export default (playerIndex: number) => {
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
  /* see widely
  robot.keyToggle('control', 'down');
  robot.keyToggle('shift', 'down');
  robot.keyToggle('z', 'down');
  robot.keyToggle('z', 'up');
  robot.keyToggle('shift', 'up');
  robot.keyToggle('control', 'up');
  robot.scrollMouse(0, -250);
  */
  fixSpectateView(playerIndex);
};
