# jovy
Express-based declarative server framework inspired by Nest

[![npm version](https://img.shields.io/npm/v/jovy.svg)](https://npmjs.org/package/jovy)
[![npm license](https://img.shields.io/npm/l/jovy.svg)](https://npmjs.org/package/jovy)
[![npm type definitions](https://img.shields.io/npm/types/jovy)](https://npmjs.org/package/jovy)

```typescript
import { Controller, Get, Param, HandlerType } from 'jovy';

@Controller()
class MainController {
  @Get()
  getHello(): string {
    return 'Hello';
  }

  @Get(':id/posts/:postId', HandlerType.RENDER)
  getId(@Param('id') id: string, @Param('postId') postId: string): string {
    return `
      <div>
        <h2>Id: ${id}</h2>
        <p>PostId: ${postId}</p>
      </div>
    `;
  }
}

const config: AppConfiguration = {
  port: 3000,
  controllers: [MainController],
};

new App(config).launch();
```

### Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 16 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```shell
npm install jovy reflect-metadata
```

If needed, you can also add express deps:

```shell
npm install express
npm install -D @types/express
```

Add string below in the top of main app file (main.ts, for example)

```typescript
import 'reflect-metadata';
```

Add flags `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` in `tsconfig.json` file

### Documentation

##### Middlewares

Example of using middlewares:

```typescript
import { setMiddlewares, Middleware, Controller, Get, Request, Response, NextFunction } from 'jovy';

// create you middleware, like in express
export const authMiddleware: Middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ id: req.params.id, message: 'middleware worked' });
};

// create decorator, using function setMiddlewares from jovy
export const Auth = (): MethodDecorator => setMiddlewares(authMiddleware);

// add decorator to needed functions in controllers
@Controller()
export default class MiddlewareController {
  @Get('middleware')
  @Auth() // our decorator!
  getMiddleware() {
    return { message: 'middleware' };
  }
}
```

##### Errors

Example of using error handling:

```typescript
import {
  App,
  AppConfiguration,
  Controller,
  CustomError,
  ErrorHandler,
  Get,
  NextFunction,
  Request,
  Response,
} from 'jovy';

// local error handler, can be used with CustomError decorator for only selected functions
const customError: ErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ error: err.message });
};

// global error handler, will be used, if no any local handlers present
const customGlobalErrorHandler: ErrorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({ error: true });
};

@Controller('error')
export default class ErrorController {
  @Get()
  getError() {
    throw new Error(); // triggers global handler
  }

  @Get('custom')
  @CustomError(customError) // decorator for adding local error handlers
  getCustomError() {
    throw new Error(); // triggers local handler
  }
}

const config: AppConfiguration = {
  port: 3000,
  controllers: [ErrorController],
  errorHandler: customGlobalErrorHandler, // connect your global error handler in app config
};

new App(config).launch();
```

##### Launch

Examples of launch callback customizations:

```typescript
import { App, Application } from 'jovy';

// sync example
new App().launch((app: Application, port: string | number) => {
  app.listen(port, () => console.log(port));
});

// async example
new App().launch(async (app: Application, port: string | number) => {
  const delayedPort: string | number = await new Promise((res) =>
    setTimeout(() => res(port), 1000)
  );

  app.listen(port, () => console.log(delayedPort));
});
```

##### Configuration

About app config object:

```typescript
import { Application, NextFunction, Request, Response, Handler } from 'express';

interface IController {
  [handleName: string]: Handler;
}

type ControllerClass = new (...args: any) => IController;
type ConfigureAppFunc = (app: Application) => void;

type ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

type AppConfiguration = {
  port?: number | string; // used by server port
  disableCors?: boolean; // add true, if need disable cors
  routesInfo?: boolean; // set false, if no need show in console routes table
  controllers?: ControllerClass[]; // controlller classes arr
  middlewares?: any[]; // express middlewares (global)
  configure?: ConfigureAppFunc; // function for more deeper customize app, if needed
  errorHandler?: ErrorHandler; // global error handler
};
```
