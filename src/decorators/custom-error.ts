import { ErrorHandler } from '../abstractions/types';
import { ControllerService } from '../services';

export const CustomError = (errorHandler: ErrorHandler): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol) => {
    new ControllerService(target).updateHandlers({ name: String(propertyKey), errorHandler });
  };
};
