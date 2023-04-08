import {
  call, put, takeLatest, select, delay, spawn, race, take,
} from 'redux-saga/effects';
import * as Sentry from '@sentry/react';
import { RootState } from '../reducers';
import {
  alertDelayError,
  alertDelaySuccess,
  userLifetime,
  name as appName,
} from '../../config';
import {
  cancelableLocationSaga,
  defaultResponseProcessing,
  FetchResponse,
  Error,
  JsonResult,
} from './common';
import { Action, RESET_STATE } from '../index';
import { getDataInStorage } from '../../utils/storage';

/**
 * Constants
 * */
export const moduleName = 'auth';
const prefix = `${appName}/${moduleName}`;

export const SIGN_IN = `${prefix}/SIGN_IN`;
export const SIGN_IN_START = `${prefix}/SIGN_IN_START`;
export const SIGN_IN_SUCCESS = `${prefix}/SIGN_IN_SUCCESS`;
export const SIGN_IN_ERROR = `${prefix}/SIGN_IN_ERROR`;
export const SIGN_IN_ERROR_RESET = `${prefix}/SIGN_IN_ERROR_RESET`;
export const SIGN_IN_CLEAR = `${prefix}/SIGN_IN_CLEAR`;

export const SIGN_IN_WITHOUT_PASSWORD = `${prefix}/SIGN_IN_WITHOUT_PASSWORD`;
export const SIGN_IN_WITHOUT_PASSWORD_START = `${prefix}/SIGN_IN_WITHOUT_PASSWORD_START`;
export const SIGN_IN_WITHOUT_PASSWORD_SUCCESS = `${prefix}/SIGN_IN_WITHOUT_PASSWORD_SUCCESS`;
export const SIGN_IN_WITHOUT_PASSWORD_ERROR = `${prefix}/SIGN_IN_WITHOUT_PASSWORD_ERROR`;
export const SIGN_IN_WITHOUT_PASSWORD_ERROR_RESET = `${prefix}/SIGN_IN_WITHOUT_PASSWORD_ERROR_RESET`;
export const SIGN_IN_WITHOUT_PASSWORD_CLEAR = `${prefix}/SIGN_IN_WITHOUT_PASSWORD_CLEAR`;

export const GET_USER = `${prefix}/GET_USER`;
export const GET_USER_START = `${prefix}/GET_USE_START`;
export const GET_USER_SUCCESS = `${prefix}/GET_USER_SUCCESS`;
export const GET_USER_ERROR = `${prefix}/GET_USER_ERROR`;
export const GET_USER_ERROR_RESET = `${prefix}/GET_USER_ERROR_RESET`;
export const GET_USER_CLEAR = `${prefix}/GET_USER_CLEAR`;

export const SIGN_OUT = `${prefix}/SIGN_OUT`;
export const SIGN_OUT_START = `${prefix}/SIGN_OUT_START`;
export const SIGN_OUT_SUCCESS = `${prefix}/SIGN_OUT_SUCCESS`;
export const SIGN_OUT_ERROR = `${prefix}/SIGN_OUT_ERROR`;
export const SIGN_OUT_ERROR_RESET = `${prefix}/SIGN_OUT_ERROR_RESET`;

export const REFRESH_TOKEN_START = `${prefix}/REFRESH_TOKEN_START`;
export const REFRESH_TOKEN_SUCCESS = `${prefix}/REFRESH_TOKEN_SUCCESS`;
export const REFRESH_TOKEN_ERROR = `${prefix}/REFRESH_TOKEN_ERROR`;
export const REFRESH_TOKEN_ERROR_RESET = `${prefix}/REFRESH_TOKEN_ERROR_RESET`;

export const UPDATE_USER = `${prefix}/UPDATE_USER`;

export const ERROR_401 = `${prefix}/ERROR_401`;
export const ERROR_403 = `${prefix}/ERROR_403`;

/**
 * Reducer
 * */
export interface User {
  email: string;
  is_active: boolean;
  email_confirmed_at: string | null;
  subscription_id: string | null;
  payment_failed: null | string;
  subscribed: boolean;
  trial_left?: number | undefined;
  trial_is_active?: boolean;
  will_canceled?: Date | null;
  onboarding_step: number;
  new_email: string | null;
}

export interface State {
  expiredDate?: number;

  init: boolean;

  responseSignIn: JsonResult | null;
  loadingSignIn: boolean;
  errorSignIn: Error | null;

  responseSignInWithoutPassword: JsonResult | null;
  loadingSignInWithoutPassword: boolean;
  errorSignInWithoutPassword: Error | null;

  responseGetUser: User | null;
  loadingGetUser: boolean;
  errorGetUser: Error | null;

  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  saveState: boolean;
  authorized: boolean;

  loadingSignOut: boolean;
  errorSignOut: Error | null;

  loadingRefresh: boolean;
  errorRefresh: Error | null;
}

const defaultState = {
  init: false,
  user: null,
  accessToken: null,
  refreshToken: null,

  saveState: false,
  authorized: false,

  responseSignIn: null,
  loadingSignIn: false,
  errorSignIn: null,

  responseSignInWithoutPassword: null,
  loadingSignInWithoutPassword: false,
  errorSignInWithoutPassword: null,

  responseGetUser: null,
  loadingGetUser: false,
  errorGetUser: null,

  loadingSignOut: false,
  errorSignOut: null,

  loadingRefresh: false,
  errorRefresh: null,
};

const localState = {
  ...defaultState,
  loadingRefresh: false,
  ...getDataInStorage(moduleName),
} as State;

if (localState.expiredDate && localState.expiredDate < Date.now()) {
  localState.user = null;
  localState.accessToken = null;
  localState.refreshToken = null;
}

if (!localState.user) {
  localState.authorized = false;
}

export default function reducer(
  state = localState,
  action: Action = { type: 'undefined' },
): State {
  const { type, payload } = action;

  switch (type) {
    case ERROR_401:
      return { ...state, accessToken: null };

    case UPDATE_USER:
      return { ...state, user: payload };

    case GET_USER_START:
      return { ...state, errorGetUser: null, loadingGetUser: true };
    case GET_USER_SUCCESS:
      return { ...state, loadingGetUser: false, responseGetUser: payload };
    case GET_USER_ERROR:
      return { ...state, loadingGetUser: false, errorGetUser: payload };
    case GET_USER_ERROR_RESET:
      return { ...state, loadingGetUser: false, errorGetUser: null };
    case GET_USER_CLEAR:
      return { ...state, loadingGetUser: false, responseGetUser: null };

    case SIGN_IN_START:
      return { ...state, errorSignIn: null, loadingSignIn: true };
    case SIGN_IN_SUCCESS: {
      return {
        ...state,
        loadingSignIn: false,
        authorized: true,
        responseSignIn: payload,
        ...payload,
      };
    }
    case SIGN_IN_ERROR:
      return { ...state, loadingSignIn: false, errorSignIn: payload };
    case SIGN_IN_ERROR_RESET:
      return { ...state, loadingSignIn: false, errorSignIn: null };
    case SIGN_IN_CLEAR:
      return { ...state, loadingSignIn: false, responseSignIn: null };

    case SIGN_IN_WITHOUT_PASSWORD_START:
      return { ...state, errorSignInWithoutPassword: null, loadingSignInWithoutPassword: true };
    case SIGN_IN_WITHOUT_PASSWORD_SUCCESS: {
      return {
        ...state,
        loadingSignInWithoutPassword: false,
        authorized: true,
        responseSignInWithoutPassword: payload,
        ...payload,
      };
    }
    case SIGN_IN_WITHOUT_PASSWORD_ERROR:
      return { ...state, loadingSignInWithoutPassword: false, errorSignInWithoutPassword: payload };
    case SIGN_IN_WITHOUT_PASSWORD_ERROR_RESET:
      return { ...state, loadingSignInWithoutPassword: false, errorSignInWithoutPassword: null };
    case SIGN_IN_WITHOUT_PASSWORD_CLEAR:
      return { ...state, loadingSignInWithoutPassword: false, responseSignInWithoutPassword: null };

    case SIGN_OUT_START:
      return { ...state, errorSignOut: null, loadingSignOut: true };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        loadingSignOut: false,
        authorized: false,
        saveState: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        responseGetUser: null,
      };
    case SIGN_OUT_ERROR:
      return { ...state, loadingSignOut: false, errorSignOut: payload };
    case SIGN_OUT_ERROR_RESET:
      return { ...state, loadingSignOut: false, errorSignOut: null };

    case REFRESH_TOKEN_START:
      return { ...state, errorRefresh: null, loadingRefresh: true };
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        loadingRefresh: false,
        authorized: true,
        ...payload,
      };
    case REFRESH_TOKEN_ERROR:
      return {
        ...state,
        loadingRefresh: false,
        errorRefresh: payload,
        authorized: false,
        user: null,
      };
    case REFRESH_TOKEN_ERROR_RESET:
      return { ...state, loadingRefresh: false, errorRefresh: null };

    default:
      return state;
  }
}

/**
 * Action Creators
 * */
export interface SignIn {
  email: string;
  password: string;
  saveState: boolean;
}
export const signIn = (payload: SignIn): Action => ({
  type: SIGN_IN,
  payload,
});

export interface SignInWithoutPassword {
  email: string;
}
export const signInWithoutPassword = (payload: SignInWithoutPassword): Action => ({
  type: SIGN_IN_WITHOUT_PASSWORD,
  payload,
});

export const signInClear = (): Action => ({
  type: SIGN_IN_CLEAR,
});

export const getUser = (): Action => ({
  type: GET_USER,
});

export const getUserClear = (): Action => ({
  type: GET_USER_CLEAR,
});

export const errorSignInReset = (): Action => ({
  type: SIGN_IN_ERROR_RESET,
});

export const signOut = (): Action => ({
  type: SIGN_OUT,
});

export const errorSignOutReset = (): Action => ({
  type: SIGN_OUT_ERROR_RESET,
});

/**
 * Helper functions
 */
function signInPrepareData({ user, tokens: { access_token, refresh_token } }: JsonResult) {
  return {
    user: user || null,
    accessToken: access_token || null,
    refreshToken: refresh_token || null,
    saveState: false,
  };
}

/**
 * Sagas
 */
export function* signInSaga({ payload: { email, password, saveState } }: { payload: SignIn; }): Generator {
  yield put({
    type: SIGN_IN_START,
  });

  const body = new FormData();

  body.append('email', email);
  body.append('password', password);

  const response = (yield call(
    fetchAuthSaga,
    `${process.env.REACT_APP_API}user/login`,
    {
      method: 'POST',
      body,
    },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    SIGN_IN_SUCCESS,
    SIGN_IN_ERROR,
    false,
    (...args) => {
      const result = signInPrepareData(...args);

      result.saveState = saveState;

      return result;
    },
  );
}

export function* signInWithoutPasswordSaga({ payload: { email } }: { payload: SignInWithoutPassword; }): Generator {
  yield clearAuthState();

  yield put({
    type: SIGN_IN_WITHOUT_PASSWORD_START,
  });

  const response = (yield call(
    fetchAuthSaga,
    `${process.env.REACT_APP_API}user/login_without_password/${email}`,
  )
  ) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    SIGN_IN_WITHOUT_PASSWORD_SUCCESS,
    SIGN_IN_WITHOUT_PASSWORD_ERROR,
    false,
    signInPrepareData,
  );
}

export function* getUserSaga(): Generator {
  yield put({
    type: GET_USER_START,
  });

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}user/me`,
    {},
    {
      signOut: false,
    },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
  );
}

export function* updateUserSaga({ payload }: Action): Generator {
  yield put({
    type: UPDATE_USER,
    payload,
  });
}

export function* signInSuccessSaga({
  payload: {
    user,
    tokens: {
      access_token,
      refresh_token,
    },
  },
}: Action): Generator {
  yield put({
    type: SIGN_IN_SUCCESS,
    payload: {
      user: user || null,
      accessToken: access_token || null,
      refreshToken: refresh_token || null,
      saveState: false,
    },
  });
  yield put({
    type: UPDATE_USER,
    payload: { ...user },
  });
}

export function* clearAuthState(): Generator {
  localStorage.clear();
  Object.assign(localState, defaultState);

  yield put({
    type: RESET_STATE,
  });
}

export function* signOutSaga(): Generator {
  yield put({
    type: SIGN_OUT_START,
  });

  yield put({
    type: SIGN_OUT_SUCCESS,
  });

  yield call(clearAuthState);

  window.location.pathname = '/';
}

export function* refreshTokenSaga(): Generator {
  yield put({
    type: REFRESH_TOKEN_START,
  });

  const { refreshToken } = (yield select((state: RootState) => state[moduleName])) as State;

  if (refreshToken) {
    const response = (yield call(
      fetchAuthSaga,
      `${process.env.REACT_APP_API}user/refresh-token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    )) as FetchResponse;

    yield defaultResponseProcessing(
      response,
      REFRESH_TOKEN_SUCCESS,
      REFRESH_TOKEN_ERROR,
      false,
      ({ user, tokens: { access_token, refresh_token } }) => ({
        user: user || null,
        accessToken: access_token || null,
        refreshToken: refresh_token || null,
      }),
    );
  } else {
    yield put({
      type: REFRESH_TOKEN_ERROR,
      payload: {
        message: 'Don\'t have refreshToken',
        status: 401,
      },
    });
  }
}

export function* initAuthSaga(): Generator {
  const { user, accessToken } = (yield select((state: RootState) => state[moduleName])) as State;

  if (user && accessToken && window.location.pathname.indexOf('/continue-onboarding') === -1) {
    yield put(getUser());
  }
}

/**
 * @param {String} url
 * @param {Object} init
 * @param {Object} options
 *
 * @returns {IterableIterator<Promise<Response>*>}
 */
export function* fetchAuthSaga(
  url: string,
  init: RequestInit = {},
  options: { [key: string]: boolean; } = {},
): Generator {
  const { accessToken } = (yield select((state: RootState) => state[moduleName])) as State;
  const newInit = {
    credentials: 'same-origin',
    ...init,
  };

  newInit.headers = {
    Accept: 'application/json',
    ...(newInit.headers || {}),
  };

  if (accessToken && options?.authorization !== false) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    newInit.headers.Authorization = `Bearer ${accessToken}`;
  }

  return yield fetch(url, newInit as RequestInit);
}

interface ResponseStatus {
  response: FetchResponse;
  url: string;
  init: RequestInit;
  options: {
    [key: string]: boolean;
  };
}

/**
 * @returns Promise<Response>
 *
 * @param props
 */
function* responseStatus401(props: ResponseStatus): Generator {
  const {
    response,
    url,
    init = {},
    options = {},
  } = props;

  function* tryAgain(): Generator {
    const { authorized, errorRefresh } = (yield select((state: RootState) => state[moduleName])) as State;

    if (authorized && errorRefresh === null) {
      return yield call(fetchAuthSaga, url, init, options);
    }

    return response;
  }

  const { loadingRefresh } = (yield select((state: RootState) => state[moduleName])) as State;

  if (loadingRefresh) {
    yield race({
      success: take(REFRESH_TOKEN_SUCCESS),
      error: take(REFRESH_TOKEN_ERROR),
    });

    return yield tryAgain();
  }

  yield put({
    type: ERROR_401,
  });

  let data: JsonResult = response;
  const type = response.headers.get('Content-Type');

  if (type === null || (type && type.indexOf('/json') !== -1)) {
    data = (yield response.json()) as JsonResult;
  }

  if (data?.error?.message === 'Token has expired' && data?.error?.type === 'Auth') {
    yield refreshTokenSaga();

    return yield tryAgain();
  }

  if (options.signOut !== false
    && data?.error?.message === 'Missing Authorization Header'
    && data?.error?.type === 'Auth'
  ) {
    yield signOutSaga();
  }

  return response;
}

/**
 * @returns Promise<Response>
 *
 * @param props
 */
function* responseStatus403(props: ResponseStatus): Generator {
  const {
    response,
    url,
    init = {},
    options = {},
  } = props;

  yield put({
    type: ERROR_403,
  });

  let data: JsonResult = response;
  const type = response.headers.get('Content-Type');

  if (type === null || (type && type.indexOf('/json') !== -1)) {
    data = (yield response.json()) as JsonResult;
  }

  if (data?.error?.message === 'Bad request' && data?.error?.type === 'Forbidden') {
    yield getUserSaga();

    const { responseGetUser } = (yield select((state: RootState) => state[moduleName])) as State;

    if (responseGetUser && responseGetUser.subscribed) {
      return yield call(fetchAuthSaga, url, init, options);
    }
  }

  return response;
}

/**
 * @param {String} url
 * @param {Object} init
 * @param {Object} options
 *
 * @returns Promise<Response>
 */
export function* fetchSaga(url: string, init: RequestInit = {}, options: { [key: string]: boolean; } = {}): Generator {
  if (process.env.REACT_APP_FETCH_DELAY) {
    yield delay(parseInt(process.env.REACT_APP_FETCH_DELAY, 10));
  }

  try {
    const response = (yield call(fetchAuthSaga, url, init, options)) as FetchResponse;

    switch (response.status) {
      case 401: return yield responseStatus401({
        response, url, init, options,
      });
      case 403: return yield responseStatus403({
        response, url, init, options,
      });
      default: return response;
    }
  } catch (err) {
    Sentry.captureException(err);

    return err;
  }
}

export function* updateStorage(): Generator {
  yield delay(100);

  const data = { ...(yield select((state: RootState) => state[moduleName])) as JsonResult };

  if (data.saveState === false) {
    data.expiredDate = Date.now() + userLifetime;
  } else {
    data.expiredDate = 0;
  }
  localStorage.setItem(moduleName, JSON.stringify(data));
}

export function* saga(): Generator {
  yield spawn(initAuthSaga);

  yield takeLatest(
    GET_USER,
    cancelableLocationSaga.bind(null, getUserSaga, GET_USER_ERROR, false),
  );
  yield takeLatest(GET_USER_ERROR, function* errorReset() {
    yield delay(alertDelayError);
    yield put({
      type: GET_USER_ERROR_RESET,
    });
  });
  yield takeLatest(GET_USER_SUCCESS, updateUserSaga);

  yield takeLatest(
    SIGN_IN_WITHOUT_PASSWORD,
    cancelableLocationSaga.bind(
      null,
      signInWithoutPasswordSaga,
      SIGN_IN_WITHOUT_PASSWORD_ERROR,
      false,
    ),
  );

  yield takeLatest(
    SIGN_IN,
    cancelableLocationSaga.bind(
      null,
      signInSaga,
      SIGN_IN_ERROR,
      false,
    ),
  );
  yield takeLatest(SIGN_IN_SUCCESS, function* clear() {
    yield delay(alertDelaySuccess);
    yield put({
      type: SIGN_IN_CLEAR,
    });
  });
  yield takeLatest(SIGN_IN_ERROR, function* errorReset() {
    yield delay(alertDelayError);
    yield put({
      type: SIGN_IN_ERROR_RESET,
    });
  });

  yield takeLatest(
    SIGN_OUT,
    cancelableLocationSaga.bind(
      null,
      signOutSaga,
      SIGN_OUT_ERROR,
      false,
    ),
  );
  yield takeLatest(SIGN_OUT_ERROR, function* errorReset() {
    yield delay(alertDelayError);
    yield put({
      type: SIGN_OUT_ERROR_RESET,
    });
  });

  yield takeLatest([
    UPDATE_USER,
    SIGN_IN_SUCCESS,
    SIGN_IN_WITHOUT_PASSWORD_SUCCESS,
    SIGN_OUT_SUCCESS,
    GET_USER_SUCCESS,
    SIGN_IN_CLEAR,
    ERROR_401,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_ERROR,
  ], updateStorage);
}
