import robot from 'robotjs';

export default (degree: number) => {
  const { width, height } = robot.getScreenSize();
  robot.moveMouse(width / 2, height / 2);
  robot.mouseClick('left', false);
  robot.keyToggle('control', 'down');
  robot.keyToggle('shift', 'down');
  robot.keyToggle('z', 'down');
  robot.keyToggle('z', 'up');
  robot.keyToggle('shift', 'up');
  robot.keyToggle('control', 'up');
  robot.scrollMouse(0, -degree);
};
