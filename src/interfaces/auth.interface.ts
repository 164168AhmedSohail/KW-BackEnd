import { Request } from 'express';

export default interface IGetUserIdAuthInfoRequest extends Request {
  user: {
    uid: string;
    role: string;
    permissions: string[];
  };
}
