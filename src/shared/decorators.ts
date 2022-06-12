import 'reflect-metadata';
import { IRouter } from '../abstractions/interfaces';
import { MetadataKey, HttpMethod } from '../constants/enums';
import { formatPath } from './helpers';

export const Controller = (basePath: string = ''): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(MetadataKey.BASE_PATH, formatPath(basePath), target);
  };
};

const methodDecoratorFactory = (method: HttpMethod) => {
  return (path: string = ''): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
      const controllerClass: Function = target.constructor;

      const routers: IRouter[] = Reflect.hasMetadata(MetadataKey.ROUTERS, controllerClass)
        ? Reflect.getMetadata(MetadataKey.ROUTERS, controllerClass)
        : [];

      routers.push({
        method,
        path: formatPath(path),
        handlerName: propertyKey,
      });

      Reflect.defineMetadata(MetadataKey.ROUTERS, routers, controllerClass);
    };
  };
};

export const Get = methodDecoratorFactory(HttpMethod.GET);
export const Post = methodDecoratorFactory(HttpMethod.POST);
export const Put = methodDecoratorFactory(HttpMethod.PUT);
export const Patch = methodDecoratorFactory(HttpMethod.PATCH);
export const Delete = methodDecoratorFactory(HttpMethod.DELETE);
