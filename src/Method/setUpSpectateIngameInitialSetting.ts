import robot from 'robotjs';

import fixSpectateView from './fixSpectateView';
import focusGame from './focusGame';
import zoomOut from './zoomOut';

export default (playerIndex: number) => {
  focusGame();
  //  playback menu off
  robot.keyToggle('u', 'down');
  robot.keyToggle('u', 'up');
  // scoreboard on
  robot.keyToggle('o', 'down');
  robot.keyToggle('o', 'up');
  // target timer on
  robot.keyToggle('n', 'down');
  robot.keyToggle('n', 'up');
  //see widely
  zoomOut(500);
  fixSpectateView(playerIndex);
};
