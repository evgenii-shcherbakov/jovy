import { Handler } from 'express';
import { IController } from '../abstractions/interfaces';

export abstract class BaseController implements IController {
  [handlerName: string]: Handler;
}
