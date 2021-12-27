import { keyboard, Key } from '@nut-tree/nut-js';

import Constants from '../Constants';

const mapping = [
  Key.Num1,
  Key.Num2,
  Key.Num3,
  Key.Num4,
  Key.Num5,
  Key.Q,
  Key.W,
  Key.E,
  Key.R,
  Key.T,
] as const;

export default async (playerIndex: number) => {
  if (playerIndex === Constants.NONE) {
    return;
  }
  const selectedKey = mapping[playerIndex];
  await keyboard.type(selectedKey);
  await keyboard.type(selectedKey);
};
