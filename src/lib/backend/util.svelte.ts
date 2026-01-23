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
): Promise<T | RequestError> => {
  return await request(path, 'PATCH', options);
};

export const put = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => {
  return await request(path, 'PUT', options);
};

export const delete_ = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => {
  return await request(path, 'DELETE', options);
};

export const post = async <T = undefined>(
  path: string,
  options: RequestOptions = {}
): Promise<T | RequestError> => {
  return await request(path, 'POST', options);
};

export const get = async <T = undefined>(
  path: string,
  options: Omit<RequestOptions, 'body'> = {}
): Promise<T | RequestError> => {
  return await request(path, 'GET', options);
};

export const request = async <T = undefined>(
  path: string,
  method: string,
  { res_type, body, content_type, signal, fetch }: RequestOptions = {}
): Promise<T | RequestError> => {
  res_type = res_type ?? ResponseType.None;

  if (body instanceof ArrayBuffer) {
    content_type = 'application/octet-stream';
  } else if (body instanceof Blob) {
    content_type = body.type;
    body = body.stream();
  } else if (typeof body === 'string') {
    content_type = 'text/plain';
  } else if (typeof body === 'object' && body !== null) {
    content_type = 'application/json';
    body = JSON.stringify(body);
  }

  let headers: HeadersInit = {};
  if (content_type) {
    headers['Content-Type'] = content_type;
  }

  fetch = fetch ?? globalThis.fetch;

  try {
    let res = await fetch!(`${path}`, {
      method,
      headers,
      body,
      signal
    });

    switch (res.status) {
      case 200:
        break;
      case 401:
        return RequestError.Unauthorized;
      case 409:
        return RequestError.Conflict;
      case 410:
        return RequestError.Gone;
      default:
        return RequestError.Other;
    }

    switch (res_type) {
      case ResponseType.Json:
        let json = await res.json();
        return json as T;
      case ResponseType.Text:
        let text = await res.text();
        return text as T;
      case ResponseType.None:
        return undefined as T;
    }
  } catch (_) {
    return RequestError.Other;
  }
};
