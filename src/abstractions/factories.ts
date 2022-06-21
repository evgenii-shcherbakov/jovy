import { IController } from './interfaces';

export type ControllerClass = new (...args: any[]) => IController & any;
