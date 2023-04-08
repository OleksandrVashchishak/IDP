import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import saga from './saga';
import reducer from './reducers';
import { name as appName } from '../config';

export interface Action {
  type: string;
  // eslint-disable-next-line
  payload?: any;
}

const localMiddleware = [];

if (process.env.REACT_APP_LOGGER === 'true') {
  localMiddleware.push(logger);
}

const prefix = `${appName}`;

export const RESET_STATE = `${prefix}/RESET_STATE`;

const sagaMiddleware = createSagaMiddleware();

export const appReducer = reducer();

export const store = createStore(
  (state, action) => {
    const { type } = action;

    switch (type) {
      case RESET_STATE:
        return appReducer(undefined, action);

      default:
        return appReducer(state, action);
    }
  },
  compose(applyMiddleware(sagaMiddleware, ...localMiddleware)),
);

sagaMiddleware.run(saga);
