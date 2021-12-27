import { keyboard, Key } from '@nut-tree/nut-js';

import fixSpectateView from './fixSpectateView';
import focusGame from './focusGame';
import zoomOut from './zoomOut';

export default async (playerIndex: number) => {
  await focusGame();
  //  playback menu off
  await keyboard.type(Key.U);
  // scoreboard on
  await keyboard.type(Key.O);
  // target timer on
  await keyboard.type(Key.N);
  //see widely
  await zoomOut(750);
  await fixSpectateView(playerIndex);
};
