import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import printDate from './printDate';

export default async function <T>(
  method: 'get' | 'post' | 'patch',
  url: string,
  config?: AxiosRequestConfig
) {
  console.log(`Starting ${method.toUpperCase()} ${url} ${printDate()}`);
  const response: AxiosResponse<T> = await axios({
    method,
    url,
    ...config,
  });
  console.log(
    `${method.toUpperCase()} request finished for: ${url} ${printDate()}`
  );
  return response;
}
