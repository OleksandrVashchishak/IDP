import {
  takeLatest, select, delay,
} from 'redux-saga/effects';
import { name as appName } from '../../config';
import { Action } from '../index';
import { RootState } from '../reducers';
import { getDataInStorage } from '../../utils/storage';

/**
 * Constants
 * */
export const moduleName = 'local';
const prefix = `${appName}/${moduleName}`;

export const UPDATE_PAGE_SIZE = `${prefix}/UPDATE_PAGE_SIZE`;
export const UPDATE_LAST_DATE = `${prefix}/UPDATE_LAST_DATE`;

/**
 * Reducer
 * */
export interface State {
  page_size: { [key:string]: number; };
  last_date: { [key:string]: string; };
}

const localState = {
  page_size: {},
  last_date: {},
  ...getDataInStorage(moduleName),
} as State;

export default function reducer(
  state = localState,
  action: Action = { type: 'undefined' },
): State {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_PAGE_SIZE:
      return { ...state, page_size: { ...state.page_size, ...payload } };

    case UPDATE_LAST_DATE:
      return { ...state, last_date: { ...state.last_date, ...payload } };

    default:
      return state;
  }
}

/**
 * Action Creators
 * */
export const updatePageSize = (name: string, value: number): Action => ({
  type: UPDATE_PAGE_SIZE,
  payload: {
    [name]: value,
  },
});

/**
 * Sagas
 */
export function* updateStorageSaga(): Generator {
  yield delay(100);

  const data = yield select((state: RootState) => state[moduleName]);

  localStorage.setItem(moduleName, JSON.stringify(data));
}

export function* saga(): Generator {
  yield takeLatest([
    UPDATE_PAGE_SIZE,
    UPDATE_LAST_DATE,
  ], updateStorageSaga);
}
