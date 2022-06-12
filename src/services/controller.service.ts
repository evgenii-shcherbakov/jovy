import 'reflect-metadata';
import { IControllerService, IHandler } from '../abstractions/interfaces';
import { MetadataKey } from '../constants/enums';

export class ControllerService implements IControllerService {
  private readonly controllerClass: Function;

  constructor(private readonly target: Object) {
    this.controllerClass = target.constructor;
  }

  get basePath(): string {
    console.log(Reflect.getMetadata(MetadataKey.BASE_PATH, this.controllerClass));

    if (!Reflect.hasMetadata(MetadataKey.BASE_PATH, this.controllerClass)) {
      throw new Error(`Controller ${this.controllerClass.name} without basePath!`);
    }

    return Reflect.getMetadata(MetadataKey.BASE_PATH, this.controllerClass);
  }

  get handlers(): IHandler[] {
    return Reflect.hasMetadata(MetadataKey.HANDLERS, this.controllerClass)
      ? Reflect.getMetadata(MetadataKey.HANDLERS, this.controllerClass)
      : [];
  }

  getHandler(name: string | symbol): IHandler | undefined {
    return this.handlers.find(({ name: hName }) => String(hName) === String(name));
  }

  updateHandlers(...handlers: IHandler[]): void {
    let currentHandlers: IHandler[] = this.handlers;

    handlers.forEach((updatedHandler: IHandler) => {
      let existsHandlerIndex: number = currentHandlers.findIndex(({ name }) => {
        return String(name) === String(updatedHandler.name);
      });

      if (existsHandlerIndex > -1) {
        currentHandlers[existsHandlerIndex] = {
          ...currentHandlers[existsHandlerIndex],
          ...updatedHandler,
        };
      } else {
        currentHandlers.push(updatedHandler);
      }
    });

    Reflect.defineMetadata(MetadataKey.HANDLERS, currentHandlers, this.controllerClass);
  }
}
