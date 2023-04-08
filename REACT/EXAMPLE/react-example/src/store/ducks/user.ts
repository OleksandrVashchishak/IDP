import {
  call, delay, put, select, takeLatest,
} from 'redux-saga/effects';
import {
  alertDelayError,
  alertDelaySuccess,
  alertDelayConfirmationEmail,
  alertDelayChangeEmail,
  alertDelayForgotPassword,
  alertDelayNewPassword,
  name as appName,
} from '../../config';
import {
  Error,
  SimpleObject,
  FetchResponse,
  cancelableLocationSaga,
  defaultResponseProcessing,
} from './common';
import { Action } from '../index';
import {
  State as StateAuth,
  moduleName as moduleNameAuth,
  getUser,
  fetchSaga,
  signInSuccessSaga,
} from './auth';
import { RootState } from '../reducers';

/**
 * Constants
 * */
export const moduleName = 'user';
const prefix = `${appName}/${moduleName}`;

export const FORGOT_PASSWORD = `${prefix}/FORGOT_PASSWORD`;
export const FORGOT_PASSWORD_START = `${prefix}/FORGOT_PASSWORD_START`;
export const FORGOT_PASSWORD_SUCCESS = `${prefix}/FORGOT_PASSWORD_SUCCESS`;
export const FORGOT_PASSWORD_ERROR = `${prefix}/FORGOT_PASSWORD_ERROR`;
export const FORGOT_PASSWORD_ERROR_RESET = `${prefix}/FORGOT_PASSWORD_ERROR_RESET`;
export const FORGOT_PASSWORD_CLEAR = `${prefix}/FORGOT_PASSWORD_CLEAR`;

export const NEW_PASSWORD = `${prefix}/NEW_PASSWORD`;
export const NEW_PASSWORD_START = `${prefix}/NEW_PASSWORD_START`;
export const NEW_PASSWORD_SUCCESS = `${prefix}/NEW_PASSWORD_SUCCESS`;
export const NEW_PASSWORD_ERROR = `${prefix}/NEW_PASSWORD_ERROR`;
export const NEW_PASSWORD_ERROR_RESET = `${prefix}/NEW_PASSWORD_ERROR_RESET`;
export const NEW_PASSWORD_CLEAR = `${prefix}/NEW_PASSWORD_CLEAR`;

export const CONFIRM_EMAIL = `${prefix}/CONFIRM_EMAIL`;
export const CONFIRM_EMAIL_START = `${prefix}/CONFIRM_EMAIL_START`;
export const CONFIRM_EMAIL_SUCCESS = `${prefix}/CONFIRM_EMAIL_SUCCESS`;
export const CONFIRM_EMAIL_ERROR = `${prefix}/CONFIRM_EMAIL_ERROR`;
export const CONFIRM_EMAIL_ERROR_RESET = `${prefix}/CONFIRM_EMAIL_ERROR_RESET`;
export const CONFIRM_EMAIL_CLEAR = `${prefix}/CONFIRM_EMAIL_CLEAR`;

export const CHANGE_EMAIL = `${prefix}/CHANGE_EMAIL`;
export const CHANGE_EMAIL_START = `${prefix}/CHANGE_EMAIL_START`;
export const CHANGE_EMAIL_SUCCESS = `${prefix}/CHANGE_EMAIL_SUCCESS`;
export const CHANGE_EMAIL_ERROR = `${prefix}/CHANGE_EMAIL_ERROR`;
export const CHANGE_EMAIL_ERROR_RESET = `${prefix}/CHANGE_EMAIL_ERROR_RESET`;
export const CHANGE_EMAIL_CLEAR = `${prefix}/CHANGE_EMAIL_CLEAR`;

export const UPDATE_EMAIL = `${prefix}/UPDATE_EMAIL`;
export const UPDATE_EMAIL_START = `${prefix}/UPDATE_EMAIL_START`;
export const UPDATE_EMAIL_SUCCESS = `${prefix}/UPDATE_EMAIL_SUCCESS`;
export const UPDATE_EMAIL_ERROR = `${prefix}/UPDATE_EMAIL_ERROR`;
export const UPDATE_EMAIL_ERROR_RESET = `${prefix}/UPDATE_EMAIL_ERROR_RESET`;
export const UPDATE_EMAIL_CLEAR = `${prefix}/UPDATE_EMAIL_CLEAR`;

export const CHANGE_PASSWORD = `${prefix}/CHANGE_PASSWORD`;
export const CHANGE_PASSWORD_START = `${prefix}/CHANGE_PASSWORD_START`;
export const CHANGE_PASSWORD_SUCCESS = `${prefix}/CHANGE_PASSWORD_SUCCESS`;
export const CHANGE_PASSWORD_ERROR = `${prefix}/CHANGE_PASSWORD_ERROR`;
export const CHANGE_PASSWORD_ERROR_RESET = `${prefix}/CHANGE_PASSWORD_ERROR_RESET`;
export const CHANGE_PASSWORD_CLEAR = `${prefix}/CHANGE_PASSWORD_CLEAR`;

/**
 * Selectors
 * */
// ...

/**
 * Reducer
 * */
export interface State {
  loadingForgotPassword: boolean;
  responseForgotPassword: boolean | null;
  errorForgotPassword: Error | null;

  loadingNewPassword: boolean;
  responseNewPassword: boolean | null;
  errorNewPassword: Error | null;

  loadingConfirmEmail: boolean;
  responseConfirmEmail: boolean | null;
  errorConfirmEmail: Error | null;

  loadingChangeEmail: boolean;
  responseChangeEmail: boolean | null;
  errorChangeEmail: Error | null;

  loadingEmail: boolean;
  responseEmail: SimpleObject | null;
  errorEmail: Error | null;

  loadingPassword: boolean;
  responsePassword: SimpleObject | null;
  errorPassword: Error | null;
}

export default function reducer(
  state = {
    loadingForgotPassword: false,
    responseForgotPassword: null,
    errorForgotPassword: null,

    loadingNewPassword: false,
    responseNewPassword: null,
    errorNewPassword: null,

    loadingConfirmEmail: false,
    responseConfirmEmail: null,
    errorConfirmEmail: null,

    loadingChangeEmail: false,
    responseChangeEmail: null,
    errorChangeEmail: null,

    loadingEmail: false,
    responseEmail: null,
    errorEmail: null,

    loadingPassword: false,
    responsePassword: null,
    errorPassword: null,
  },
  action: Action = { type: 'undefined' },
): State {
  const { type, payload } = action;

  switch (type) {
    case FORGOT_PASSWORD_START:
      return { ...state, loadingForgotPassword: true, errorForgotPassword: null };
    case FORGOT_PASSWORD_SUCCESS:
      return { ...state, loadingForgotPassword: false, responseForgotPassword: payload };
    case FORGOT_PASSWORD_ERROR:
      return { ...state, loadingForgotPassword: false, errorForgotPassword: payload };
    case FORGOT_PASSWORD_ERROR_RESET:
      return { ...state, loadingForgotPassword: false, errorForgotPassword: null };
    case FORGOT_PASSWORD_CLEAR:
      return { ...state, loadingForgotPassword: false, responseForgotPassword: null };

    case NEW_PASSWORD_START:
      return { ...state, loadingNewPassword: true, errorNewPassword: null };
    case NEW_PASSWORD_SUCCESS:
      return { ...state, loadingNewPassword: false, responseNewPassword: payload };
    case NEW_PASSWORD_ERROR:
      return { ...state, loadingNewPassword: false, errorNewPassword: payload };
    case NEW_PASSWORD_ERROR_RESET:
      return { ...state, loadingNewPassword: false, errorNewPassword: null };
    case NEW_PASSWORD_CLEAR:
      return { ...state, loadingNewPassword: false, responseNewPassword: null };

    case CONFIRM_EMAIL_START:
      return { ...state, loadingConfirmEmail: true, errorConfirmEmail: null };
    case CONFIRM_EMAIL_SUCCESS:
      return { ...state, loadingConfirmEmail: false, responseConfirmEmail: payload };
    case CONFIRM_EMAIL_ERROR:
      return { ...state, loadingConfirmEmail: false, errorConfirmEmail: payload };
    case CONFIRM_EMAIL_ERROR_RESET:
      return { ...state, loadingConfirmEmail: false, errorConfirmEmail: null };
    case CONFIRM_EMAIL_CLEAR:
      return { ...state, loadingConfirmEmail: false, responseConfirmEmail: null };

    case CHANGE_EMAIL_START:
      return { ...state, loadingChangeEmail: true, errorChangeEmail: null };
    case CHANGE_EMAIL_SUCCESS:
      return { ...state, loadingChangeEmail: false, responseChangeEmail: payload };
    case CHANGE_EMAIL_ERROR:
      return { ...state, loadingChangeEmail: false, errorChangeEmail: payload };
    case CHANGE_EMAIL_ERROR_RESET:
      return { ...state, loadingChangeEmail: false, errorChangeEmail: null };
    case CHANGE_EMAIL_CLEAR:
      return { ...state, loadingChangeEmail: false, responseChangeEmail: null };

    case UPDATE_EMAIL_START:
      return { ...state, loadingEmail: true, errorEmail: null };
    case UPDATE_EMAIL_SUCCESS:
      return { ...state, loadingEmail: false, responseEmail: payload };
    case UPDATE_EMAIL_ERROR:
      return { ...state, loadingEmail: false, errorEmail: payload };
    case UPDATE_EMAIL_ERROR_RESET:
      return { ...state, loadingEmail: false, errorEmail: null };
    case UPDATE_EMAIL_CLEAR:
      return { ...state, loadingEmail: false, responseEmail: null };

    case CHANGE_PASSWORD_START:
      return { ...state, loadingPassword: true, errorPassword: null };
    case CHANGE_PASSWORD_SUCCESS:
      return { ...state, loadingPassword: false, responsePassword: payload };
    case CHANGE_PASSWORD_ERROR:
      return { ...state, loadingPassword: false, errorPassword: payload };
    case CHANGE_PASSWORD_ERROR_RESET:
      return { ...state, loadingPassword: false, errorPassword: null };
    case CHANGE_PASSWORD_CLEAR:
      return { ...state, loadingPassword: false, responsePassword: null };

    default:
      return state;
  }
}

/**
 * Action Creators
 * */
interface ForgotPassword {
  payload: {
    email: string;
  };
}

export const forgotPassword = (email: string): Action => ({
  type: FORGOT_PASSWORD,
  payload: { email },
});

interface NewPassword {
  payload: {
    key: string;
    password: string;
  };
}

export const newPassword = (key: string, password: string): Action => ({
  type: NEW_PASSWORD,
  payload: { key, password },
});

interface ConfirmEmail {
  payload: {
    key: string;
  };
}

export const confirmEmail = (key: string): Action => ({
  type: CONFIRM_EMAIL,
  payload: { key },
});

interface ChangeEmail {
  payload: {
    key: string;
  };
}

export const changeEmail = (key: string): Action => ({
  type: CHANGE_EMAIL,
  payload: { key },
});

interface UpdateEmail {
  payload: {
    email: string;
  };
}

export const updateEmail = (email: string): Action => ({
  type: UPDATE_EMAIL,
  payload: { email },
});

interface ChangePassword {
  payload: {
    currentPassword: string;
    password: string;
  };
}

export const changePassword = (currentPassword: string, password: string): Action => ({
  type: CHANGE_PASSWORD,
  payload: {
    currentPassword,
    password,
  },
});

export interface Segmentation {
  payload: {
    onboarding_bills: boolean;
    onboarding_rewards: boolean;
    onboarding_debt_irs: boolean;
    onboarding_spending: boolean;
    onboarding_debt_auto: boolean;
    onboarding_credit_score: boolean;
    onboarding_debt_student: boolean;
    onboarding_debt_medical: boolean;
    onboarding_debt_mortgage: boolean;
    onboarding_debt_credit_card: boolean;
    onboarding_cancel_subscriptions: boolean;
  };
}

export interface SetSubscription {
  payload: {
    id: string;
  };
}

/**
 * Sagas
 */
export function* forgotPasswordSaga({ payload: { email } }: ForgotPassword): Generator {
  yield put({
    type: FORGOT_PASSWORD_START,
  });

  const body = new FormData();

  body.append('email', email);

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}send-forgot-password-email`,
    {
      method: 'POST',
      body,
    },
    { authorization: false },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
  );
}

export function* newPasswordSaga({ payload: { key, password } }: NewPassword): Generator {
  yield put({
    type: NEW_PASSWORD_START,
  });

  const body = new FormData();

  body.append('current_password', password);
  body.append('new_password', password);

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}user/change-password-with-token/${key}`,
    {
      method: 'POST',
      body,
    },
    { authorization: false },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_ERROR,
  );
}

export function* confirmEmailSaga({ payload: { key } }: ConfirmEmail): Generator {
  yield put({
    type: CONFIRM_EMAIL_START,
  });

  const { user } = (yield select((state: RootState) => state[moduleNameAuth])) as StateAuth;

  if (user && user.email_confirmed_at !== null) {
    yield put({
      type: CONFIRM_EMAIL_SUCCESS,
      payload: true,
    });

    return;
  }

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}confirm-email/${key}`,
    {
      method: 'POST',
    },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    CONFIRM_EMAIL_SUCCESS,
    CONFIRM_EMAIL_ERROR,
  );
}

export function* changeEmailSaga({ payload: { key } }: ChangeEmail): Generator {
  yield put({
    type: CHANGE_EMAIL_START,
  });

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}user/update-email/${key}`,
    { method: 'POST' },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    CHANGE_EMAIL_SUCCESS,
    CHANGE_EMAIL_ERROR,
  );
}

export function* updateEmailSaga({ payload: { email } }: UpdateEmail): Generator {
  yield put({
    type: UPDATE_EMAIL_START,
  });

  const body = new FormData();

  body.append('email', email);

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}user/send-update-email`,
    {
      method: 'POST',
      body,
    },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    UPDATE_EMAIL_SUCCESS,
    UPDATE_EMAIL_ERROR,
  );
}

export function* changePasswordSaga({ payload: { currentPassword, password } }: ChangePassword): Generator {
  yield put({
    type: CHANGE_PASSWORD_START,
  });

  const body = new FormData();

  body.append('current_password', currentPassword);
  body.append('new_password', password);

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}user/change-password`,
    {
      method: 'POST',
      body,
    },
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_ERROR,
  );
}

export function* saga(): Generator {
  yield takeLatest(
    FORGOT_PASSWORD,
    cancelableLocationSaga.bind(
      null,
      forgotPasswordSaga,
      FORGOT_PASSWORD_ERROR,
      false,
    ),
  );
  yield takeLatest(FORGOT_PASSWORD_SUCCESS, function* clear() {
    yield delay(alertDelayForgotPassword);
    yield put({
      type: FORGOT_PASSWORD_CLEAR,
    });
  });
  yield takeLatest(FORGOT_PASSWORD_ERROR, function* errorReset() {
    yield delay(alertDelayForgotPassword);
    yield put({
      type: FORGOT_PASSWORD_ERROR_RESET,
    });
  });

  yield takeLatest(
    NEW_PASSWORD,
    cancelableLocationSaga.bind(null, newPasswordSaga, NEW_PASSWORD_ERROR, false),
  );
  yield takeLatest([
    NEW_PASSWORD_SUCCESS,
  ], signInSuccessSaga);
  yield takeLatest(NEW_PASSWORD_SUCCESS, function* clear() {
    yield delay(alertDelayNewPassword);
    yield put({
      type: NEW_PASSWORD_CLEAR,
    });
  });
  yield takeLatest(NEW_PASSWORD_ERROR, function* errorReset() {
    yield delay(alertDelayNewPassword);
    yield put({
      type: NEW_PASSWORD_ERROR_RESET,
    });
  });

  yield takeLatest(
    CONFIRM_EMAIL,
    cancelableLocationSaga.bind(
      null,
      confirmEmailSaga,
      CONFIRM_EMAIL_ERROR,
      false,
    ),
  );
  yield takeLatest(CONFIRM_EMAIL_SUCCESS, function* clear() {
    yield put(getUser());
    yield delay(alertDelayConfirmationEmail);
    yield put({
      type: CONFIRM_EMAIL_CLEAR,
    });
  });
  yield takeLatest(CONFIRM_EMAIL_ERROR, function* errorReset() {
    yield delay(alertDelayConfirmationEmail);
    yield put({
      type: CONFIRM_EMAIL_ERROR_RESET,
    });
  });

  yield takeLatest(
    CHANGE_EMAIL,
    cancelableLocationSaga.bind(
      null,
      changeEmailSaga,
      CHANGE_EMAIL_ERROR,
      false,
    ),
  );
  yield takeLatest(CHANGE_EMAIL_SUCCESS, function* clear() {
    yield put(getUser());
    yield delay(alertDelayChangeEmail);
    yield put({
      type: CHANGE_EMAIL_CLEAR,
    });
  });
  yield takeLatest(CHANGE_EMAIL_ERROR, function* errorReset() {
    yield delay(alertDelayChangeEmail);
    yield put({
      type: CHANGE_EMAIL_ERROR_RESET,
    });
  });

  yield takeLatest(
    UPDATE_EMAIL,
    cancelableLocationSaga.bind(
      null,
      updateEmailSaga,
      UPDATE_EMAIL_ERROR,
      false,
    ),
  );
  yield takeLatest(UPDATE_EMAIL_SUCCESS, function* clear() {
    yield put(getUser());
    yield delay(alertDelaySuccess);
    yield put({
      type: UPDATE_EMAIL_CLEAR,
    });
  });
  yield takeLatest(UPDATE_EMAIL_ERROR, function* errorReset() {
    yield delay(alertDelayError);
    yield put({
      type: UPDATE_EMAIL_ERROR_RESET,
    });
  });

  yield takeLatest(
    CHANGE_PASSWORD,
    cancelableLocationSaga.bind(
      null,
      changePasswordSaga,
      CHANGE_PASSWORD_ERROR,
      false,
    ),
  );
  yield takeLatest(CHANGE_PASSWORD_SUCCESS, function* clear() {
    yield put(getUser());
    yield delay(alertDelaySuccess);
    yield put({
      type: CHANGE_PASSWORD_CLEAR,
    });
  });
  yield takeLatest(CHANGE_PASSWORD_ERROR, function* errorReset() {
    yield delay(alertDelayError);
    yield put({
      type: CHANGE_PASSWORD_ERROR_RESET,
    });
  });
}
