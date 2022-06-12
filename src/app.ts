import express, { Application, NextFunction, Request, Response, Router } from 'express';
import { join } from 'path';
import { IApp, IController, IControllerService, IHandler } from './abstractions/interfaces';
import {
  AppConfiguration,
  ErrorHandler,
  HandlerInfo,
  LaunchCallback,
  Middleware,
} from './abstractions/types';
import { ControllerClass } from './abstractions/factories';
import { defaultErrorHandler, defaultLaunchCallback } from './constants/defaults';
import { ControllerService, PathService } from './services';

export class App implements IApp {
  private readonly instance: Application = express();
  private readonly handlerInfo: HandlerInfo[] = [];

  private port: number | string = 5000;
  private errorHandler: ErrorHandler = defaultErrorHandler;

  constructor(config: AppConfiguration = {}) {
    this.parseConfig(config);
  }

  private parseConfig(config: AppConfiguration): void {
    const { port, routesInfo, controllers, middlewares, configure, errorHandler } = config;

    if (port) {
      this.port = port;
    }

    (middlewares || []).forEach((middleware) => this.instance.use(middleware));

    if (configure) {
      configure(this.instance);
    }

    this.registerRouters(controllers || [], routesInfo ?? true);

    if (errorHandler) {
      this.errorHandler = errorHandler;
    }

    this.instance.use(this.errorHandler);
  }

  private registerRouters(controllers: ControllerClass[], isShowInfo: boolean) {
    controllers.forEach((controllerClass: ControllerClass) => {
      const controllerInstance: IController = new controllerClass();
      const controllerService: IControllerService = new ControllerService(controllerInstance);

      const basePath: string = controllerService.basePath;
      const router = Router();

      controllerService.handlers.forEach((handler: IHandler) => {
        if (!handler.method || !handler.path || !handler.name) return;

        const originalHandler = controllerInstance[String(handler.name)];
        const middlewares: Middleware[] = handler.middlewares || [];

        const finalHandler = async function (req: Request, res: Response, next: NextFunction) {
          try {
            originalHandler.call(controllerInstance, req, res, next);
          } catch (error) {
            if (!handler.errorHandler) {
              next(error);
            } else {
              handler.errorHandler(error as Error, req, res, next);
            }
          }
        };

        router[handler.method](handler.path, ...middlewares, finalHandler);

        const path: string = new PathService(join(basePath, handler.path)).format();

        this.handlerInfo.push({
          endpoint: `${handler.method.toLocaleUpperCase()} ${path}`,
          handler: `${controllerClass.name}.${String(handler.name)}`,
        });
      });

      this.instance.use(basePath, router);
    });

    if (isShowInfo) {
      console.table(this.handlerInfo);
    }
  }

  getInstance(): Application {
    return this.instance;
  }

  getHandlerInfo(): HandlerInfo[] {
    return this.handlerInfo;
  }

  async launch(launchCallback: LaunchCallback = defaultLaunchCallback): Promise<void> {
    try {
      await launchCallback(this.instance, this.port);
    } catch (error) {
      console.error(`Server error: ${error}`);
      process.exit();
    }
  }
}
