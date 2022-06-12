*jovy*
# Jovy framework
Main express modification with decorators support

```typescript
import { Request, Response } from 'express';
import { App, AppConfiguration, BaseController, Controller, Get } from 'jovy';

@Controller()
class HelloController extends BaseController {
  @Get()
  getHello(_: Request, res: Response) {
    res.json('Hello jovy');
  }
}

const config: AppConfiguration = {
  port: 3000,
  controllers: [HelloController],
};

new App(config).launch();
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 16 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install jovy express
```

If you use typescript, add also express types:

```console
$ npm install -D @types/express
```

# Documentation

## Routing
Example of using routes:

```typescript
import { Request, Response } from 'express';
import { BaseController, Controller, Get } from 'jovy';

// create controller as on example below:
@Controller('sample') // there path, if needed ("sample" in this case)
export default class SampleController extends BaseController {
  @Get() // decorator for set http method, can also take a path parameter
  getHello(req: Request, res: Response) {
    // functions like in express
    res.json('Hello jovy');
  }

  @Get('middleware/:id') // of course, stock syntax from express fully supported
  getMiddleware(req: Request, res: Response) {
    res.json(req.params.id);
  }
}
```

## Middlewares
Example of using middlewares:

```typescript
import {
  setMiddlewares,
  Middleware,
  BaseController,
  Controller,
  Get,
} from 'jovy';
import { Request, Response, NextFunction } from 'express';

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
export default class MiddlewareController extends BaseController {
  @Get('middleware')
  @Auth() // our decorator!
  getMiddleware(req: Request, res: Response) {
    res.json({ message: 'middleware' });
  }
}
```

## Errors
Example of using error handling:

```typescript
import { NextFunction, Request, Response } from 'express';
import {
  App,
  AppConfiguration,
  BaseController,
  Controller,
  CustomError,
  ErrorHandler,
  Get,
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
export default class ErrorController extends BaseController {
  @Get()
  getError(req: Request, res: Response, next: NextFunction) {
    throw new Error(); // triggers global handler
  }

  @Get('custom')
  @CustomError(customError) // decorator for adding local error handlers
  getCustomError(req: Request, res: Response, next: NextFunction) {
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

## Launch
Examples of launch callback customizations:

```typescript
import { Application } from 'express';
import { App } from 'jovy';

// sync example
new App().launch((app: Application, port: string | number) => {
  console.log(port);
});

// async example
new App().launch(async (app: Application, port: string | number) => {
  const delayedPort: string | number = await new Promise((res) =>
    setTimeout(() => res(port), 1000)
  );
  console.log(delayedPort);
});
```

## Configuration
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
  routesInfo?: boolean; // set false, if no need show in console routes table
  controllers?: ControllerClass[]; // controlller classes arr
  middlewares?: any[]; // express middlewares (global)
  configure?: ConfigureAppFunc; // function for more deeper customize app, if needed
  errorHandler?: ErrorHandler; // global error handler
};
```
