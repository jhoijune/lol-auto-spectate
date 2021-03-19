import robot from 'robotjs';

const mapping = ['1', '2', '3', '4', '5', 'q', 'w', 'e', 'r', 't'];

export default (playerIndex: number) => {
  const selectedKey = mapping[playerIndex];
  robot.keyToggle(selectedKey, 'down');
  robot.keyToggle(selectedKey, 'up');
  robot.keyToggle(selectedKey, 'down');
  robot.keyToggle(selectedKey, 'up');
  console.log(
    `Fixed view ${playerIndex / 5 < 1 ? 'Blue' : 'Red'} Team player ${
      (playerIndex % 5) + 1
    }`
  );
};
