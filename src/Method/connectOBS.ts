import OBSWebSocket from 'obs-websocket-js';

import Constants from '../Constants';

export default async (obs: OBSWebSocket) => {
  const { OBS_PASSWORD } = process.env;
  try {
    await obs.connect({
      address: Constants.OBS_ADDRESS,
      password: OBS_PASSWORD,
    });
    return Constants.OBS_SUCCESS;
  } catch (error) {
    if (error.error === 'Connection error.') {
      return Constants.OBS_FAIL;
    } else if (error.error === 'Authentication Failed.') {
      console.log('password is wrong');
    } else {
      console.error(error);
    }
    return Constants.OBS_ERROR;
  }
};
