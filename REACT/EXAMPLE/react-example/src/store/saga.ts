import { SagaIterator } from 'redux-saga';
import { spawn } from 'redux-saga/effects';
import { saga as local } from './ducks/local';
import { saga as auth } from './ducks/auth';
import { saga as user } from './ducks/user';
import { saga as popover } from './ducks/popover';

export default function* Saga(): SagaIterator {
  yield spawn(local);
  yield spawn(auth);
  yield spawn(user);
  yield spawn(popover);
}
