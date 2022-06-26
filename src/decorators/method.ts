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
  return (path: string = '', handlerType: HandlerType = HandlerType.REST): MethodDecorator => {
    return handlerDecoratorFactory({
      method,
      path: new PathService(path).format(),
      type: handlerType,
    });
  };
};

/**
 * @description GET HTTP method decorator
 * @param path {string?} route path
 * @param handlerType {HandlerType?} type of handler (REST/RENDER/CLASSIC)
 */
export const Get = methodDecoratorFactory(HttpMethod.GET);

/**
 * @description POST HTTP method decorator
 * @param path {string?} route path
 * @param handlerType {HandlerType?} type of handler (REST/RENDER/CLASSIC)
 */
export const Post = methodDecoratorFactory(HttpMethod.POST);

/**
 * @description PUT HTTP method decorator
 * @param path {string?} route path
 * @param handlerType {HandlerType?} type of handler (REST/RENDER/CLASSIC)
 */
export const Put = methodDecoratorFactory(HttpMethod.PUT);

/**
 * @description PATCH HTTP method decorator
 * @param path {string?} route path
 * @param handlerType {HandlerType?} type of handler (REST/RENDER/CLASSIC)
 */
export const Patch = methodDecoratorFactory(HttpMethod.PATCH);

/**
 * @description DELETE HTTP method decorator
 * @param path {string?} route path
 * @param handlerType {HandlerType?} type of handler (REST/RENDER/CLASSIC)
 */
export const Delete = methodDecoratorFactory(HttpMethod.DELETE);

/**
 * @description Custom error method decorator
 * @param errorHandler {ErrorHandler} custom error handler
 */
export const CustomError = (errorHandler: ErrorHandler): MethodDecorator => {
  return handlerDecoratorFactory({ errorHandler });
};
