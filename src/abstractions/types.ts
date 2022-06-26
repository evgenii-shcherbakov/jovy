import { Application, NextFunction, Request, Response } from 'express';
import { ControllerClass } from './factories';
import { ParameterType } from '../constants/enums';
import { IStorage } from './interfaces';

export type StorableRequest = Request & {
  storage?: IStorage;
};

export type HandlerInfo = {
  method: string;
  endpoint: string;
  handler: string;
};

export type ParameterInfo = {
  index: number;
  type: ParameterType;
  value: string;
};

export type ConfigureAppFunc = (app: Application) => void;

export type ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type LaunchCallback = (app: Application, port: string | number) => Promise<void> | void;

export type Middleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export type AppConfiguration = {
  port?: number | string;
  disableCors?: boolean;
  routesInfo?: boolean;
  controllers?: ControllerClass[];
  middlewares?: any[];
  configure?: ConfigureAppFunc;
  errorHandler?: ErrorHandler;
};
