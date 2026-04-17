import { RequestError, ResponseType } from './types.svelte';

export interface RequestOptions {
  res_type?: ResponseType;
  body?: any;
  content_type?: string;
  signal?: AbortSignal;
  fetch?: typeof fetch;
}

export const patch = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'PATCH', options);

export const put = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'PUT', options);

export const delete_ = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'DELETE', options);

export const post = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => await request(path, 'POST', options);

export const get = async <T = undefined>(
  path: string,
  options: Omit<RequestOptions, 'body'> = {}
): Promise<T | RequestError> => await request(path, 'GET', options);

// oxlint-disable-next-line complexity
export const request = async <T = undefined>(
  path: string,
  method: string,
  { res_type, body, content_type, signal, fetch }: RequestOptions = {}
): Promise<T | RequestError> => {
  const res_type_ = res_type ?? ResponseType.None;
  let content_type_ = content_type;
  let body_ = body;

  if (body_ instanceof ArrayBuffer) {
    content_type_ = 'application/octet-stream';
  } else if (body_ instanceof Blob) {
    content_type_ = body_.type;
    body_ = body_.stream();
  } else if (typeof body_ === 'string') {
    content_type_ = 'text/plain';
  } else if (typeof body_ === 'object' && body_ !== null) {
    content_type_ = 'application/json';
    body_ = JSON.stringify(body_);
  }

  const headers: HeadersInit = {};
  if (content_type_) {
    headers['Content-Type'] = content_type_;
  }

  const fetch_ = fetch ?? globalThis.fetch;

  try {
    const res = await fetch_(path, {
      body: body_,
      headers,
      method,
      signal
    });

    switch (res.status) {
      case 200: {
        break;
      }
      case 400: {
        return RequestError.BadRequest;
      }
      case 401: {
        return RequestError.Unauthorized;
      }
      case 403: {
        return RequestError.Forbidden;
      }
      case 404: {
        return RequestError.NotFound;
      }
      case 406: {
        return RequestError.NotAcceptable;
      }
      case 408: {
        return RequestError.RequestTimeout;
      }
      case 409: {
        return RequestError.Conflict;
      }
      case 410: {
        return RequestError.Gone;
      }
      case 413: {
        return RequestError.ContentTooLarge;
      }
      case 415: {
        return RequestError.UnsupportedMediaType;
      }
      case 422: {
        return RequestError.UnprocessableEntity;
      }
      case 429: {
        return RequestError.TooManyRequests;
      }
      case 500: {
        return RequestError.InternalServerError;
      }
      case 501: {
        return RequestError.NotImplemented;
      }
      case 502: {
        return RequestError.BadGateway;
      }
      case 503: {
        return RequestError.ServiceUnavailable;
      }
      case 504: {
        return RequestError.GatewayTimeout;
      }
      case 507: {
        return RequestError.InsufficientStorage;
      }
      default: {
        return RequestError.Other;
      }
    }

    switch (res_type_) {
      case ResponseType.Json: {
        const json = await res.json();
        // oxlint-disable-next-line no-unsafe-type-assertion
        return json as T;
      }
      case ResponseType.Text: {
        const text = await res.text();
        // oxlint-disable-next-line no-unsafe-type-assertion
        return text as T;
      }
      case ResponseType.None: {
        // oxlint-disable-next-line no-unsafe-type-assertion
        return undefined as T;
      }
      default: {
        return RequestError.Other;
      }
    }
  } catch {
    return RequestError.Other;
  }
};
