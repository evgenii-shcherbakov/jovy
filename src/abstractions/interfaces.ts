import { HttpMethod } from '../constants/enums';
import { Application, Handler } from 'express';
import { ErrorHandler, HandlerInfo, LaunchCallback, Middleware } from './types';

export interface IHandler {
  method?: HttpMethod;
  path?: string;
  name?: string | symbol;
  middlewares?: Middleware[];
  errorHandler?: ErrorHandler;
}

export interface IController {
  [handleName: string]: Handler;
}

export interface IApp {
  getInstance(): Application;
  getHandlerInfo(): HandlerInfo[];
  launch(launchCallback?: LaunchCallback): Promise<void>;
}

export interface IControllerService {
  basePath: string;
  handlers: IHandler[];
  getHandler(name: string | symbol): IHandler | undefined;
  updateHandlers(...handlers: IHandler[]): void;
}

export interface IPathService {
  format(): string;
}
