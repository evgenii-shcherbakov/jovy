import express, { Application, Handler, Router, json, static as staticMiddleware } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
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
import { ControllerService, HandlerService, PathService } from './services';

export class App implements IApp {
  private readonly instance: Application = express();
  private readonly handlerInfo: HandlerInfo[] = [];
  private readonly middlewares: any[] = [json(), fileUpload()];

  private port: number | string = 5000;
  private errorHandler: ErrorHandler = defaultErrorHandler;

  constructor(config: AppConfiguration = {}) {
    this.parseConfig(config);
  }

  private parseConfig(config: AppConfiguration): void {
    const {
      port,
      disableCors,
      routesInfo,
      controllers,
      middlewares: customMiddlewares,
      configure,
      errorHandler,
      serveStatic,
    } = config;

    if (port) {
      this.port = port;
    }

    if (!disableCors) {
      this.middlewares.push(cors());
    }

    if (!serveStatic?.disable) {
      const staticPath: string = serveStatic?.root || 'static';
      this.instance.use(staticMiddleware(join(process.cwd(), staticPath), serveStatic?.options));
      console.info(`Static files are served from '${staticPath}' folder`);
    }

    this.middlewares
      .concat(customMiddlewares || [])
      .forEach((middleware) => this.instance.use(middleware));

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
        if (!handler.method || !handler.path) return;

        const middlewares: Middleware[] = handler.middlewares || [];

        const finalHandler: Handler = new HandlerService()
          .parseConfiguration(handler)
          .buildHandler(controllerInstance);

        router[handler.method](handler.path, ...middlewares, finalHandler.bind(controllerInstance));

        const path: string = new PathService(join(basePath, handler.path)).format();

        this.handlerInfo.push({
          method: handler.method.toLocaleUpperCase(),
          endpoint: path || '/',
          handler: `${controllerInstance.toString()}.${String(handler.name)}`,
        });
      });

      this.instance.use(basePath, router);
    });

    if (isShowInfo) {
      console.log('App routing table:');
      console.table(this.handlerInfo);
    }
  }

  /**
   * @description Get express instance
   */
  getInstance(): Application {
    return this.instance;
  }

  /**
   * @description Get mapped handlers info
   */
  getHandlerInfo(): HandlerInfo[] {
    return this.handlerInfo;
  }

  /**
   * @description App start function
   * @param launchCallback {LaunchCallback?} Callback, which will execute on startup
   */
  async launch(launchCallback: LaunchCallback = defaultLaunchCallback): Promise<void> {
    try {
      await launchCallback(this.instance, this.port);
    } catch (error) {
      console.error(`Server error: ${error}`);
      process.exit(1);
    }
  }
}
