import { HttpMethod } from '../constants/enums';
import { ControllerService, PathService } from '../services';

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
