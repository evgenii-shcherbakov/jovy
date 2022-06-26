import { HandlerType, HttpMethod } from '../constants/enums';
import { Application, Handler } from 'express';
import { ErrorHandler, HandlerInfo, LaunchCallback, Middleware, ParameterInfo } from './types';

export interface IStorage {
  [property: string]: any;
}

export interface IHandler {
  name: string;
  method?: HttpMethod;
  path?: string;
  type?: HandlerType;
  middlewares?: Middleware[];
  errorHandler?: ErrorHandler;
  params?: ParameterInfo[];
}

export interface IController {
  [handlerName: string]: Handler | Function;
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

export interface IHandlerService {
  parseConfiguration(params: IHandler): IHandlerService;
  buildHandler(controller: IController): Handler;
}
