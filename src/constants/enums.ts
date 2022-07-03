export enum MetadataKey {
  BASE_PATH = 'base-path',
  HANDLERS = 'handlers',
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export enum ParameterType {
  REQUEST = 'request',
  RESPONSE = 'response',
  NEXT = 'next',
  PARAM = 'param',
  QUERY = 'query',
  HEADER = 'header',
  BODY = 'body',
  FILE = 'file',
  COOKIES = 'cookies',
  SIGNED_COOKIES = 'signed-cookies',
  IP = 'ip',
  HOST_NAME = 'host-name',
  STORAGE = 'storage',
}

/**
 * @description Request handler type enum
 */
export enum HandlerType {
  REST = 'rest',
  RENDER = 'render',
  CLASSIC = 'classic',
}
