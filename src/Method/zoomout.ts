import { keyboard, Key, mouse } from '@nut-tree/nut-js';

export default async (degree: number) => {
  await keyboard.pressKey(Key.LeftControl);
  await keyboard.pressKey(Key.LeftShift);
  await keyboard.pressKey(Key.Z);
  await keyboard.releaseKey(Key.LeftControl);
  await keyboard.releaseKey(Key.LeftShift);
  await keyboard.releaseKey(Key.Z);
  await mouse.scrollDown(degree);
};
