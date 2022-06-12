import express, { Application, Router } from 'express';
import * as http from 'http';
import { MetadataKey } from './constants/enums';
import { IApp, IController, IRouter } from './abstractions/interfaces';
import {
  AppConfiguration,
  ErrorHandlerFunc,
  HandlerInfo,
  LaunchCallback,
} from './abstractions/types';
import { ControllerClass } from './abstractions/classes';
import { defaultErrorMiddleware, defaultLaunchCallback } from './constants/common';

export class App implements IApp {
  private readonly instance: Application = express();
  private readonly handlerInfo: HandlerInfo[] = [];

  private port: number | string = 5000;
  private errorHandler: ErrorHandlerFunc = defaultErrorMiddleware;

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
  }

  private registerRouters(controllers: ControllerClass[], isShowInfo: boolean) {
    controllers.forEach((controllerClass) => {
      const controllerInstance: IController = new controllerClass();
      const basePath: string = Reflect.getMetadata(MetadataKey.BASE_PATH, controllerClass);
      const routers: IRouter[] = Reflect.getMetadata(MetadataKey.ROUTERS, controllerClass);
      const router = Router();

      routers.forEach(({ method, path, handlerName }) => {
        router[method](path, controllerInstance[String(handlerName)].bind(controllerInstance));

        this.handlerInfo.push({
          api: `${method.toLocaleUpperCase()} ${basePath + path}`,
          handler: `${controllerClass.name}.${String(handlerName)}`,
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
      const server: http.Server = http.createServer(this.instance);

      await launchCallback(server, this.port);
    } catch (error) {
      console.error(`Server error: ${error}`);
    }
  }
}
