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

export const Param = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.PARAM, value: name });
};

export const Query = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.QUERY, value: name });
};

export const Header = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.HEADER, value: name });
};

export const Body = (...fields: string[]): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.BODY, value: fields.join('|') });
};

export const Req = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.REQUEST, value: '' });
};

export const Res = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.RESPONSE, value: '' });
};

export const Next = (): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.NEXT, value: '' });
};

export const File = (name = ''): ParameterDecorator => {
  return parameterDecoratorFactory({ type: ParameterType.FILE, value: name });
};
