import {
  call, put, race, delay,
} from 'redux-saga/effects';
import * as Sentry from '@sentry/react';
import { name as appName, pageSize } from '../../config';
import { Action } from '../index';

/**
 * Constants
 * */
export const moduleName = 'common';
const prefix = `${appName}/${moduleName}`;

export const CANCELABLE_SAGA_ERROR = `${prefix}/CANCELABLE_SAGA_ERROR`;
export const CANCELABLE_LOCATION_DELAY = 0; // create auto DELAY_REACHABLE
export const ERROR_TIMEOUT_CANCEL = 'Response timed out';
export const ERROR_CUSTOM_CANCEL = 'Custom cancel. Name: ';
// export const ERROR_LOCATION_CHANGE = 'Location change.';

export const DELAY_REACHABLE = 30000;

interface CancelableOptions {
  timeout?: number;
  cancel?: {
    [key: string]: Generator;
  };
  // locationCancel?: boolean | string;
}

const CANCELABLE_OPTIONS = {
  timeout: CANCELABLE_LOCATION_DELAY,
  cancel: {},
  // locationCancel: true,
};

const listStatusText: { [key: string]: string; } = {
  0: 'Failed to get data. The server may not be available right now.',

  100: 'Continue',
  102: 'Processing',

  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',

  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  426: 'Upgrade Required',
  429: 'Too Many Requests',
  499: 'Client Closed Request',

  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  520: 'Unknown Error',
  521: 'Web Server Is Down',
  522: 'Connection Timed Out',
  523: 'Origin Is Unreachable',
  524: 'A Timeout Occurred',
};

export type SimpleArray = (string | number | boolean | null)[];

export interface JsonResult {
  // eslint-disable-next-line
  [key: string]: any;
}

export interface SimpleObject {
  [key: string]: JsonResult | string | number | boolean | null;
}

export type Error = SimpleObject

export interface CRUDPayload {
  reload?: boolean;
}

export interface FetchResponse {
  status: number;
  ok: boolean;
  statusText: string;
  body: string | number | null | undefined;
  json: () => JsonResult;
  headers: Headers;
  arrayBuffer: () => Blob;
  message?: string;
}

export interface QueryFilter {
 [key: string]: string | number | string[] | number[];
}

export interface LoadComplicatedQuery extends CRUDPayload {
  id?: number | string;
  page?: number | string;
  page_size?: number;
  order?: string;
  year?: number | string;
  month?: number | string;
  sort?: string;
  filter?: QueryFilter;
}

export const defaultPropsComplicatedQuery = (props: LoadComplicatedQuery): LoadComplicatedQuery => ({
  page: 1,
  page_size: pageSize,
  ...props,
});

// eslint-disable-next-line
export const fetchResponse = (status: number, body: any): FetchResponse => {
  const response = {
    status,
    ok: status >= 200 && status < 300,
    statusText: listStatusText[status] || 'fake response',
    body: '',
    json: () => ({}),
    headers: new Headers(),
  };

  if (status === 204) {
    return response as FetchResponse;
  }

  response.body = JSON.stringify(body);
  response.json = (): JSON => JSON.parse(response.body || '');

  return response as FetchResponse;
};

export interface ErrorPutResponse {
  status: number;
  statusText: {
    type: string;
    message?: string;
    messages?: string;
  } | string;
}

export function* errorPut(
  action: string,
  response: ErrorPutResponse,
  err?: Error,
): Generator {
  let message = err?.message || listStatusText[response.status];
  let type = err?.name || 'undefined';

  if (typeof response.statusText === 'string') {
    message = response.statusText || message;
  } else {
    message = response.statusText?.message || response.statusText?.messages || message;
    type = response.statusText?.type || type;
  }

  yield put({
    type: action,
    payload: {
      status: response.status,
      message,
      type,
    },
  });
}

/**
 * @param {Object} response
 * @param {String} LOAD_SUCCESS
 * @param {String} LOAD_ERROR
 * @param {(Generator|Function|Promise)} isValidData
 * @param {(Generator|Function|Promise)} prepareData
 *
 * @returns {IterableIterator<{payload: *, type: *}>|any | never | Promise<any>|IterableIterator<*>}
 */
export function* defaultResponseProcessing(
  response: FetchResponse,
  LOAD_SUCCESS: string,
  LOAD_ERROR: string,
  isValidData?: false | ((data?: JsonResult) => boolean),
  // eslint-disable-next-line
  prepareData?: (data: JsonResult) => any,
): Generator {
  if (!response || response?.message === 'Failed to fetch') {
    Sentry.captureException(response);
    yield errorPut(LOAD_ERROR, {
      status: 0,
      statusText: '',
    }, {
      name: 'Failed to fetch',
    });
  } else if (response.ok && response.status === 204) {
    yield put({
      type: LOAD_SUCCESS,
      payload: isValidData ? yield isValidData() : true,
    });
  } else {
    try {
      let data: JsonResult = response;
      const type = response.headers.get('Content-Type');

      if (type === null || (type && type.indexOf('/json') !== -1)) {
        data = (yield response.json()) as JsonResult;
      }

      if (response.status >= 200 && response.status < 300
          && (typeof isValidData !== 'function' || (yield isValidData(data)))
      ) {
        yield put({
          type: LOAD_SUCCESS,
          payload: prepareData ? yield prepareData(data) : data,
        });
      } else {
        yield errorPut(LOAD_ERROR, {
          statusText: data?.message || data?.error || response.statusText || listStatusText[response.status] || '',
          status: response.status,
        });
      }
    } catch (err) {
      Sentry.captureException(err);
      yield errorPut(LOAD_ERROR, response, err as SimpleObject);
    }
  }
}

export class UserException {
  public type = 'User exception';

  public message = '';

  constructor(message: string) {
    this.message = message;
  }
}

export interface PropsErrors {
  page: number | string;
  page_size: number | string;
  order: string;
}

export function catchPropsErrors({
  page,
  page_size,
  order,
}: PropsErrors): void {
  if (
    typeof page !== 'undefined' && (
      Number.isNaN(page)
      || (page && page.toString() !== parseInt(page as string, 10).toString())
    )
  ) {
    throw new UserException('Parameter "page" is invalid');
  }

  if (
    typeof page_size !== 'undefined' && (
      Number.isNaN(page_size)
      || (page_size && page_size.toString() !== parseInt(page_size as string, 10).toString())
    )
  ) {
    throw new UserException('Parameter "page_size" is invalid');
  }

  if (
    typeof order !== 'undefined'
    && order
    && order.split
    && order.split(' ').length > 2
  ) {
    throw new UserException('Parameter "order" is invalid');
  }
}

/**
 * Sagas
 *
 * Generator that cancels the function at a certain interval or if change the route.
 *
 * @param {(Generator|Function|Promise)} saga // return yield call(saga, actions)
 * @param {(Generator|Function|Promise|String)} error // return yield call(error, actions, event)
 * @param {Object} options // optional
 *        default: {
 *          timeout: Number, // timeout cancels the function
 *          cancel: {
 *            ...
 *            // example - position: take(GET_CURRENT_POSITION_ERROR)
 *            ...
 *          },
 *          // locationCancel: true | string (Action)
 *        }
 * @param {Any} actions // call(saga, ACTIONS) and call(error, ACTIONS, event)
 */
export const cancelableLocationSaga = (() => {
  function* errorCatch(
    error: Generator | string,
    actions?: Action,
    event?: Error,
  ): Generator {
    const payload = {
      message: event?.message,
      type: listStatusText[((event?.status) || 0) as number],
      status: 499,
    };

    if (event?.message && event?.name) {
      Object.assign(payload, {
        message: event?.message,
        type: event?.name,
      });
    }

    if (typeof error === 'function') {
      yield call(error, actions, payload);
    } else {
      yield put({
        type: error || CANCELABLE_SAGA_ERROR,
        payload,
      });
    }
  }

  function* tryCatch(
    saga: (_?: Action) => Generator,
    error: Generator | string,
    actions?: Action,
  ): Generator {
    try {
      if (typeof saga === 'function') {
        yield saga(actions);
      }
    } catch (err) {
      Sentry.captureException(err);
      yield errorCatch(error, actions, err as SimpleObject);
    }
  }

  return function* cancelable(
    // eslint-disable-next-line
    saga: (action: any) => Generator,
    error: Generator | string,
    options?: CancelableOptions | boolean,
    actions?: Action,
  ): Generator {
    const {
      timeout,
      cancel,
      // locationCancel
    } = {
      ...CANCELABLE_OPTIONS,
      ...(typeof options === 'boolean' ? {} : options),
    } as CancelableOptions;
    const time = (timeout || DELAY_REACHABLE) | 0;
    const raceList = {
      ...cancel,
      timeoutCancel: delay(time),
      taskLoad: call(tryCatch, saga, error, actions),
    };

    // if (locationCancel) {
    //   Object.assign(raceList, {
    //     locationCancel: take(LOCATION_CHANGE),
    //   });
    // }

    // eslint-disable-next-line
    const list = (yield race(raceList)) as {[key: string]: any};
    const key = Object.keys(list)[0];

    if (key === 'timeoutCancel') {
      yield errorCatch(error, actions, {
        message: ERROR_TIMEOUT_CANCEL,
        status: 408,
        time,
      });
    } else if (key !== 'taskLoad') {
      yield errorCatch(error, actions, {
        message: ERROR_CUSTOM_CANCEL,
        status: 499,
        key,
      });
    }
    // else if (key === 'locationCancel') {
    //   if (locationCancel && typeof locationCancel === 'string') {
    //     yield errorCatch(locationCancel, actions, {
    //       message: ERROR_LOCATION_CHANGE,
    //       status: 499,
    //     });
    //   }
    // }
  };
})();
