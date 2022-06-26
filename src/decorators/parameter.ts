import { IControllerService, IHandler } from '../abstractions/interfaces';
import { ControllerService } from '../services';
import { ParameterInfo } from '../abstractions/types';
import { ParameterType } from '../constants/enums';

const parameterDecoratorFactory = (
  updatedProps: Pick<ParameterInfo, 'type' | 'value'>
): ParameterDecorator => {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const { type, value } = updatedProps;

    const controllerService: IControllerService = new ControllerService(target);
    const handler: IHandler | undefined = controllerService.getHandler(propertyKey);

    const params: ParameterInfo[] = handler?.params ? handler.params : [];

    params.push({ index: parameterIndex, type, value });

    controllerService.updateHandlers({ name: String(propertyKey), params });
  };
};

/**
 * @description Request param property decorator
 * @param name {string?} Request param name, if missing - returns 'req.param' object
 */
export const Param = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.PARAM, value: name });
};

/**
 * @description Query param property decorator
 * @param name {string?} Query param name, if missing - returns 'req.query' object
 */
export const Query = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.QUERY, value: name });
};

/**
 * @description Request header property decorator
 * @param name {string?} Request header name, if missing - returns 'req.headers' object
 */
export const Header = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.HEADER, value: name });
};

/**
 * @description Request body property decorator
 * @param fields {string[]} Request body needed fields, if missing - returns 'req.body' object
 */
export const Body = (...fields: string[]): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.BODY, value: fields.join('|') });
};

/**
 * @description Request property decorator
 */
export const Req = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.REQUEST, value: '' });
};

/**
 * @description Response property decorator
 */
export const Res = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.RESPONSE, value: '' });
};

/**
 * @description Next function property decorator
 */
export const Next = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.NEXT, value: '' });
};

/**
 * @description Request file property decorator
 * @param name {string?} Request file name, if missing - returns 'req.files' object
 */
export const File = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.FILE, value: name });
};

/**
 * @description Cookies property decorator
 */
export const Cookies = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.COOKIES, value: '' });
};

/**
 * @description SignedCookies property decorator
 */
export const SignedCookies = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.SIGNED_COOKIES, value: '' });
};

/**
 * @description Request ip property decorator
 */
export const Ip = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.IP, value: '' });
};

/**
 * @description Request hostname property decorator
 */
export const HostName = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.HOST_NAME, value: '' });
};

/**
 * @description Request storage property decorator
 * @param key {string?} Request storage key, if missing - returns 'req.storage' object
 */
export const Storage = (key = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.STORAGE, value: key });
};
