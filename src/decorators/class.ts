import 'reflect-metadata';
import { MetadataKey } from '../constants/enums';
import { PathService } from '../services';
import { IController } from '../abstractions/interfaces';
import { ControllerClass } from '../abstractions/factories';
import { Handler } from 'express';

/**
 * @description Jovy controller class decorator
 * @param basePath {string?}
 * @constructor
 */
export const Controller = (basePath: string = '') => {
  return function <T extends new (...args: any[]) => any>(Constructor: T) {
    const MixinClass: ControllerClass = class extends Constructor implements IController {
      [handlerName: string]: Handler | Function;

      toString(): string {
        return Constructor.name;
      }
    };

    Reflect.defineMetadata(MetadataKey.BASE_PATH, new PathService(basePath).format(), MixinClass);
    return MixinClass;
  };
};
