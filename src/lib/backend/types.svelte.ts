export enum RequestError {
  BadRequest = 'BadRequest',
  Unauthorized = 'Unauthorized',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  NotAcceptable = 'NotAcceptable',
  RequestTimeout = 'RequestTimeout',
  Conflict = 'Conflict',
  Gone = 'Gone',
  ContentTooLarge = 'ContentTooLarge',
  UnsupportedMediaType = 'UnsupportedMediaType',
  UnprocessableEntity = 'UnprocessableEntity',
  TooManyRequests = 'TooManyRequests',
  InternalServerError = 'InternalServerError',
  NotImplemented = 'NotImplemented',
  BadGateway = 'BadGateway',
  ServiceUnavailable = 'ServiceUnavailable',
  GatewayTimeout = 'GatewayTimeout',
  InsufficientStorage = 'InsufficientStorage',
  Other = 'Other'
}

export enum ResponseType {
  Json = 'Json',
  Text = 'Text',
  None = 'None'
}
