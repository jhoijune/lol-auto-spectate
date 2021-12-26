import robot from 'robotjs';
import { type } from 'os';
// @ts-ignore
import ks from 'node-key-sender';

import Constants from '../Constants';

const mapping = ['1', '2', '3', '4', '5', 'q', 'w', 'e', 'r', 't'] as const;

export default (playerIndex: number) => {
  if (playerIndex === Constants.NONE) {
    return;
  }
  const selectedKey = mapping[playerIndex];
  if (type() === 'Darwin') {
    robot.keyToggle(selectedKey, 'down');
    robot.keyToggle(selectedKey, 'up');
    robot.keyToggle(selectedKey, 'down');
    robot.keyToggle(selectedKey, 'up');
  } else {
    // need jre
    ks.sendKey(selectedKey);
    ks.sendKey(selectedKey);
  }
};
