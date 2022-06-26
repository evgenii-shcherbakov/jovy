import { Middleware, StorableRequest } from '../abstractions/types';
import { IControllerService, IHandler, IStorage } from '../abstractions/interfaces';
import { ControllerService } from '../services';
import { Request } from 'express';

/**
 * @description Utility for easy add middlewares to route
 * @param newMiddlewares {Middleware[]} List of classic express middlewares
 */
export function setMiddlewares(...newMiddlewares: Middleware[]): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    const controllerService: IControllerService = new ControllerService(target);
    const existsHandler: IHandler | undefined = controllerService.getHandler(propertyKey);

    const middlewares: Middleware[] = (existsHandler?.middlewares || []).concat(newMiddlewares);

    const updatedHandler: IHandler = { name: String(propertyKey), middlewares };
    controllerService.updateHandlers(updatedHandler);
  };
}

/**
 * @description Utility for save in Request object user data based on key-pairs
 * @param req {Request} Request object
 * @param key {string} Storage key
 * @param value {any} Any saved value
 */
export function saveToStorage(req: Request, key: string, value: any) {
  const storage: IStorage | undefined = (req as StorableRequest).storage;

  if (!storage) {
    (req as StorableRequest).storage = {};
  }

  (req as StorableRequest).storage![key] = value;
}
