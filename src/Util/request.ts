import axios, { AxiosResponse } from 'axios';

import printDate from './printDate';

export default async function <T>(
  method: 'get' | 'post',
  url: string,
  data?: object
) {
  console.log(`Starting ${method.toUpperCase()} ${url} ${printDate()}`);
  const response: AxiosResponse<T> = await axios({ method, url, data });
  console.log(
    `${method.toUpperCase()} request finished for: ${url} ${printDate()}`
  );
  return response;
}
