import robot from 'robotjs';

const mapping = ['1', '2', '3', '4', '5', 'q', 'w', 'e', 'r', 't'] as const;

export default async (playerIndex: number) => {
  try {
    const selectedKey = mapping[playerIndex];
    await robot.mouseClick('left', true);
    await robot.keyToggle(selectedKey, 'down');
    await robot.keyToggle(selectedKey, 'up');
    await robot.keyTap(selectedKey);
    await robot.typeString(selectedKey);
    console.log(
      `Fixed view ${playerIndex / 5 < 1 ? 'Blue' : 'Red'} Team player ${
        (playerIndex % 5) + 1
      }`
    );
  } catch (error) {
    console.log(error);
    console.log(playerIndex, mapping[playerIndex]);
  }
};
