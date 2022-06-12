import { Application, NextFunction, Request, Response } from 'express';
import { ControllerClass } from './classes';
import http from 'http';

export type HandlerInfo = {
  api: string;
  handler: string;
};

export type ConfigureAppFunc = (app: Application) => void;

export type ErrorHandlerFunc = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type LaunchCallback = (server: http.Server, port: string | number) => Promise<void>;

export type AppConfiguration = {
  port?: number | string;
  routesInfo?: boolean;
  controllers?: ControllerClass[];
  middlewares?: any[];
  configure?: ConfigureAppFunc;
  errorHandler?: ErrorHandlerFunc;
};
