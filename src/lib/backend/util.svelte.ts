import { RequestError, ResponseType } from './types.svelte';

export const patch = async <T>(
  path: string,
  res_type: ResponseType,
  body: any,
  content_type?: string,
  signal?: AbortSignal
): Promise<T | RequestError> => {
  return await request(path, 'PATCH', res_type, body, content_type, signal);
};

export const put = async <T>(
  path: string,
  res_type: ResponseType,
  body: any,
  content_type?: string,
  signal?: AbortSignal
): Promise<T | RequestError> => {
  return await request(path, 'PUT', res_type, body, content_type, signal);
};

export const delete_ = async <T>(
  path: string,
  res_type: ResponseType,
  body: any,
  content_type?: string,
  signal?: AbortSignal
): Promise<T | RequestError> => {
  return await request(path, 'DELETE', res_type, body, content_type, signal);
};

export const post = async <T>(
  path: string,
  res_type: ResponseType,
  body: any,
  content_type?: string,
  signal?: AbortSignal
): Promise<T | RequestError> => {
  return await request(path, 'POST', res_type, body, content_type, signal);
};

export const get = async <T>(
  path: string,
  res_type: ResponseType,
  content_type?: string,
  signal?: AbortSignal
): Promise<T | RequestError> => {
  return await request(path, 'GET', res_type, undefined, content_type, signal);
};

export const request = async <T>(
  path: string,
  method: string,
  res_type: ResponseType,
  body?: any,
  content_type?: string,
  signal?: AbortSignal
): Promise<T | RequestError> => {
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
