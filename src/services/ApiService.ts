import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { APIRequest } from '@/@types/api';
import BaseService from './BaseService';

const ApiService = {
  fetchData<TReq, TRes>(
    config: AxiosRequestConfig<TReq>
  ): Promise<AxiosResponse<TRes>> {
    return new Promise((resolve, reject) => {
      BaseService(config)
        .then((response: AxiosResponse<TRes>) => resolve(response))
        .catch((error: AxiosError) => reject(error));
    });
  },
  fetch<TRes>({
    functionName,
    header,
    headers,
    body,
  }: APIRequest): Promise<AxiosResponse<TRes>> {
    const moment = Date.now().toString();
    const clientRequest = Math.floor(Math.random() * Date.now()).toString();
    return new Promise((resolve, reject) => {
      BaseService({
        url: '/',
        method: 'POST',
        headers: {
          ...headers,
        },
        data: {
          clientHeader: {
            language: 'VN',
            clientRequestId: clientRequest,
            deviceId: 'WEBLV24H',
            platform: 'LV24HWEB',
            clientAddress: '127.1.1.1',
            function: functionName,
          },
          body: {
            header: {
              platform: 'LV24HWEB',
              clientRequestId: clientRequest,
              clientTime: dayjs().format('YYYYMMDDHHmmss.SSS'),
              zonedClientTime: moment,
              channelCode: 'WEBVIVIET',
              deviceId: 'WEBLV24H',
              ip: '127.1.1.1',
              makerId: 'LV24HWEB',
              language: 'VN',
              ...(header as object),
            },
            ...(body as object),
          },
        },
      })
        .then((response: AxiosResponse<TRes>) => resolve(response))
        .catch((error: AxiosError) => reject(error));
    });
  },
};

export default ApiService;
