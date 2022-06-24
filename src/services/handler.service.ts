import { IController, IHandler, IHandlerService } from '../abstractions/interfaces';
import { Handler, NextFunction, Request, Response } from 'express';
import { ErrorHandler, ParameterInfo } from '../abstractions/types';
import { HandlerType, ParameterType } from '../constants/enums';

export class HandlerService implements IHandlerService {
  private errorHandler: ErrorHandler | undefined;
  private handlerParams: ParameterInfo[] = [];
  private handlerType: HandlerType = HandlerType.REST;
  private handlerName: string = '';

  buildHandler(controller: IController): Handler {
    const originalHandler: Handler | Function = controller[this.handlerName];

    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const args: any[] = this.getHandlerArgs(req, res, next);

        switch (this.handlerType) {
          case HandlerType.CLASSIC:
            await (originalHandler as Handler).call(controller, req, res, next);
            break;
          case HandlerType.RENDER:
            res.send(await (originalHandler as Function).apply(controller, args));
            break;
          default:
            res.json(await (originalHandler as Function).apply(controller, args));
            break;
        }
      } catch (error) {
        if (!this.errorHandler) {
          next(error);
        } else {
          this.errorHandler(error as Error, req, res, next);
        }
      }
    };
  }

  private getHandlerArgs(req: Request, res: Response, next: NextFunction): any[] {
    return this.handlerParams
      .sort((prev: ParameterInfo, next: ParameterInfo) => prev.index - next.index)
      .map(({ type, value }) => {
        switch (type) {
          case ParameterType.PARAM:
            return req.params[value];
          case ParameterType.QUERY:
            return req.query[value];
          case ParameterType.HEADER:
            return req.header(value);
          case ParameterType.BODY:
            const fields: string[] = value.split('|');

            if (!fields.length) {
              return req.body;
            }

            return fields.reduce((acc: { [property: string]: any }, field: string) => {
              if (req.body[field]) {
                acc[field] = req.body[field];
              }

              return acc;
            }, {});
          case ParameterType.REQUEST:
            return req;
          case ParameterType.RESPONSE:
            return res;
          case ParameterType.NEXT:
            return next;
          case ParameterType.FILE:
            return req.files?.[value];
          default:
            return;
        }
      });
  }

  parseConfiguration(params: IHandler): IHandlerService {
    this.handlerParams = params.params || [];
    this.handlerName = params.name;

    if (params.errorHandler) {
      this.errorHandler = params.errorHandler;
    }

    if (params.type) {
      this.handlerType = params.type;
    }

    return this;
  }
}
