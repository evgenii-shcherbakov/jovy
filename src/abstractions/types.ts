import { Application, NextFunction, Request, Response } from 'express';
import { ControllerClass } from './factories';

export type HandlerInfo = {
  endpoint: string;
  handler: string;
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
  routesInfo?: boolean;
  controllers?: ControllerClass[];
  middlewares?: any[];
  configure?: ConfigureAppFunc;
  errorHandler?: ErrorHandler;
};
