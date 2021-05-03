import { Data } from '../types';

export default (data: Data) => {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (key) => {
    const sequence = key.toString();
    if (sequence === '\u0003') {
      // ctrl + c
      process.exit();
    }
    if (data.isCommandAvailable) {
      if (sequence === '\u0017') {
        // ctrl + w
        data.isPermitted = true;
        console.log('Current mode does not require permission');
        console.log(`data.isPermitted : ${data.isPermitted}`);
      } else if (sequence === '\u0010') {
        // ctrl + p
        data.isPermitted = false;
        console.log('Current mode requires permission');
        console.log(`data.isPermitted : ${data.isPermitted}`);
      } else if (sequence === '\u0014') {
        console.log(
          `Current mode is ${
            data.isPermitted ? 'without permission' : 'permission'
          }`
        );
      }
    }
  });
};
