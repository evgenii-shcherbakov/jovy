import 'reflect-metadata';
import { MetadataKey, HttpMethod } from '../constants/enums';
import { ErrorHandler } from '../abstractions/types';
import { ControllerService, PathService } from '../services';

export const Controller = (basePath: string = ''): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(MetadataKey.BASE_PATH, new PathService(basePath).format(), target);
  };
};

const methodDecoratorFactory = (method: HttpMethod) => {
  return (path: string = ''): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
      new ControllerService(target).updateHandlers({
        method,
        path: new PathService(path).format(),
        name: propertyKey,
      });
    };
  };
};

export const Get = methodDecoratorFactory(HttpMethod.GET);
export const Post = methodDecoratorFactory(HttpMethod.POST);
export const Put = methodDecoratorFactory(HttpMethod.PUT);
export const Patch = methodDecoratorFactory(HttpMethod.PATCH);
export const Delete = methodDecoratorFactory(HttpMethod.DELETE);

export const CustomError = (errorHandler: ErrorHandler): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol) => {
    new ControllerService(target).updateHandlers({ name: String(propertyKey), errorHandler });
  };
};
