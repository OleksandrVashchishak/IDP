import {
  call, put, takeLatest, select,
} from 'redux-saga/effects';
import { name as appName } from '../../config';
import {
  cancelableLocationSaga, defaultResponseProcessing, Error, FetchResponse,
} from './common';
import { Action } from '../index';
import {
  fetchSaga,
  GET_USER_SUCCESS,
  SIGN_IN_SUCCESS,
  SIGN_IN_WITHOUT_PASSWORD_SUCCESS,
} from './auth';
import { RootState } from '../reducers';

/**
 * Constants
 * */
export const moduleName = 'popover';
const prefix = `${appName}/${moduleName}`;

export const LOAD_POPOVER_START = `${prefix}/LOAD_POPOVER_START`;
export const LOAD_POPOVER_SUCCESS = `${prefix}/LOAD_POPOVER_SUCCESS`;
export const LOAD_POPOVER_ERROR = `${prefix}/LOAD_POPOVER_ERROR`;

/**
 * Reducer
 * */

export interface Item {
  slug: string;
  title: string | null;
  content: string;
  action_button_label: string | null;
  action_button_url: string | null;
}

export interface State {
  data: Item[] | null;
  time: number | null;
  error: Error | null;
  loading: boolean;
}

export default function reducer(
  state = {
    data: null,
    time: null,
    loading: false,
    error: null,
  },
  action: Action = { type: 'undefined' },
): State {
  const { type, payload } = action;

  switch (type) {
    case LOAD_POPOVER_START:
      return { ...state, loading: true, error: null };

    case LOAD_POPOVER_SUCCESS: {
      const { data, time } = payload;

      return {
        ...state, loading: false, data, time,
      };
    }

    case LOAD_POPOVER_ERROR:
      return { ...state, loading: false, error: payload };

    default:
      return { ...state };
  }
}

/**
 * Sagas
 */
export function* loadPopoverSaga(): Generator {
  const { data, time } = (yield select((state: RootState) => state[moduleName])) as State;

  if (data && time && time + 2 * 60 * 60 * 1000 > Date.now()) {
    return;
  }

  yield put({ type: LOAD_POPOVER_START });

  const response = (yield call(
    fetchSaga,
    `${process.env.REACT_APP_API}help_content`,
  )) as FetchResponse;

  yield defaultResponseProcessing(
    response,
    LOAD_POPOVER_SUCCESS,
    LOAD_POPOVER_ERROR,
    false,
    (result) => ({
      data: result,
      time: Date.now(),
    }),
  );
}

export function* saga(): Generator {
  yield takeLatest(
    [
      SIGN_IN_SUCCESS,
      SIGN_IN_WITHOUT_PASSWORD_SUCCESS,
      GET_USER_SUCCESS,
    ],
    cancelableLocationSaga.bind(
      null,
      loadPopoverSaga,
      LOAD_POPOVER_ERROR,
      false,
    ),
  );
}
