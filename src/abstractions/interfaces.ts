import { HttpMethod } from '../constants/enums';
import { Application, Handler } from 'express';
import { HandlerInfo, LaunchCallback } from './types';

export interface IRouter {
  method: HttpMethod;
  path: string;
  handlerName: string | symbol;
}

export interface IController {
  [handleName: string]: Handler;
}

export interface IApp {
  getInstance(): Application;
  getHandlerInfo(): HandlerInfo[];
  launch(launchCallback?: LaunchCallback): Promise<void>;
}
