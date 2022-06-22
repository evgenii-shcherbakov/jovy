import { IHandler } from '../abstractions/interfaces';
import { ControllerService, PathService } from '../services';
import { HandlerType, HttpMethod } from '../constants/enums';
import { ErrorHandler } from '../abstractions/types';

const handlerDecoratorFactory = (updatedProps: Partial<IHandler> = {}): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol) => {
    new ControllerService(target).updateHandlers({ name: String(propertyKey), ...updatedProps });
  };
};

const methodDecoratorFactory = (method: HttpMethod) => {
  return (path: string = ''): MethodDecorator => {
    return handlerDecoratorFactory({ method, path: new PathService(path).format() });
  };
};

export const Get = methodDecoratorFactory(HttpMethod.GET);
export const Post = methodDecoratorFactory(HttpMethod.POST);
export const Put = methodDecoratorFactory(HttpMethod.PUT);
export const Patch = methodDecoratorFactory(HttpMethod.PATCH);
export const Delete = methodDecoratorFactory(HttpMethod.DELETE);

export const CustomError = (errorHandler: ErrorHandler): MethodDecorator => {
  return handlerDecoratorFactory({ errorHandler });
};

export const Render = (): MethodDecorator => {
  return handlerDecoratorFactory({ type: HandlerType.RENDER });
};

export const Classic = (): MethodDecorator => {
  return handlerDecoratorFactory({ type: HandlerType.CLASSIC });
};
