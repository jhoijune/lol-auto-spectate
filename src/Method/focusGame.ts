import { screen, mouse, Point } from '@nut-tree/nut-js';

export default async () => {
  const width = await screen.width();
  const height = await screen.height();
  await mouse.move([new Point(width / 2, height / 2)]);
  await mouse.leftClick();
};
