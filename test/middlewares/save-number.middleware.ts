import { NextFunction, Request, Response } from 'express';
import { saveToStorage } from '../../src';

export const saveNumberMiddleware = async (req: Request, _: Response, next: NextFunction) => {
  saveToStorage(req, 'message', 'Hello, it message from middleware!');
  next();
};
