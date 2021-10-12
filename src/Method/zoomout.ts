import robot from 'robotjs';

export default (degree: number) => {
  robot.keyToggle('control', 'down');
  robot.keyToggle('shift', 'down');
  robot.keyToggle('z', 'down');
  robot.keyToggle('z', 'up');
  robot.keyToggle('shift', 'up');
  robot.keyToggle('control', 'up');
  robot.scrollMouse(0, -degree);
};
