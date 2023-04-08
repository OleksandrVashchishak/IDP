import { combineReducers, Reducer } from 'redux';
import local, { State as localState, moduleName as localModule } from './ducks/local';
import auth, { State as authState, moduleName as authModule } from './ducks/auth';
import user, { State as userState, moduleName as userModule } from './ducks/user';
import popover, { State as popoverState, moduleName as popoverModule } from './ducks/popover';

export interface RootState {
  [localModule]: localState;
  [authModule]: authState;
  [userModule]: userState;
  [popoverModule]: popoverState;
}

export default function AppReducer(): Reducer {
  return combineReducers({
    [localModule]: local,
    [authModule]: auth,
    [userModule]: user,
    [popoverModule]: popover,
  });
}
