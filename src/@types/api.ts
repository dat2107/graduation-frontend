import { AnyObject } from './common';

export interface APIRequest {
  functionName: string;
  headers?: AnyObject;
  header?: AnyObject | string;
  body?: AnyObject | string;
}

export interface APIRespond<T> {
  secure: boolean;
  exception: boolean;
  clientHeader: AnyObject;
  body: T;
}
