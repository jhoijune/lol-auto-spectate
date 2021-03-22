import robot from 'robotjs';
import { type } from 'os';
// @ts-ignore
import ks from 'node-key-sender';

const mapping = ['1', '2', '3', '4', '5', 'q', 'w', 'e', 'r', 't'] as const;

export default (playerIndex: number) => {
  const selectedKey = mapping[playerIndex];
  const { width, height } = robot.getScreenSize();
  robot.moveMouse(width / 2, height / 2);
  robot.mouseClick('left');
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
