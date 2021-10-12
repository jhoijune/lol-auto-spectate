import robot from 'robotjs';

export default () => {
  const { width, height } = robot.getScreenSize();
  robot.moveMouse(width / 2, height / 2);
  robot.mouseClick('left', false);
};
