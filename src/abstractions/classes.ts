import { Handler } from 'express';
import { IController } from './interfaces';

export abstract class BaseController implements IController {
  [handlerName: string]: Handler;
}
