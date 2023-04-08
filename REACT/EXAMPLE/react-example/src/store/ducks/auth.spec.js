import { expectSaga } from 'redux-saga-test-plan';
import { appReducer, history } from '../index';
import reducer from '../reducers';
import { fetchResponse } from './common';
import {
  moduleName,
  signIn,
  signInSaga,
  historyPush,
  signOutSaga,
  fetchAuthSaga,
  clearAuthState,
} from './auth';

describe('Auth saga', () => {
  describe('sign in', () => {
    const templateTest = async (action, response) => {
      const { payload } = action;

      const store = await expectSaga(signInSaga, action)
        .provide({
          call(effect, next) {
            if (effect.fn === fetchAuthSaga) {
              return response;
            }

            return next();
          },
        })
        .withReducer(reducer(history))
        .dispatch(signIn(payload))
        .run();

      return store.storeState[moduleName];
    };
    const action = {
      payload: {
        email: 'test@gmail.com',
        password: 'dfsgrhet43t2weAfgg%gd',
        saveState: false,
      },
    };

    describe('when data exists', () => {
      it('returns data', async () => {
        const storeUser = {
          email: 'test@gmail.com',
          is_active: false,
          email_confirmed_at: 'test',
          subscription_id: 'test',
          payment_failed: 'test',
          subscribed: false,
          trial_left: 432563423,
          trial_is_active: true,
          will_canceled: null,
          onboarding_step: 3452,
          new_email: 'test',
        };
        const storeAccessToken = 'fdsgeag234tefgdh4342wawe434gwef$T#%WRDAsdffgaf';
        const storeRefreshToken = 'fdsgesfdag234dftewawe434gwef$T#%WRDAsdffgaffdg';
        const response = fetchResponse(200, {
          user: storeUser,
          tokens: {
            access_token: storeAccessToken,
            refresh_token: storeRefreshToken,
          },
        });
        const { user, accessToken, refreshToken } = await templateTest(action, response);

        expect(user).toMatchObject(storeUser);
        expect(accessToken).toEqual(storeAccessToken);
        expect(refreshToken).toEqual(storeRefreshToken);
      });
    });

    describe('when data not exists', () => {
      it('returns 401', async () => {
        const storeError = {
          message: 'Incorrect credentials',
          status: 401,
        };
        const response = fetchResponse(401, storeError);
        const {
          accessToken, authorized, errorSignIn, user,
        } = await templateTest(action, response);

        expect(user).toBe(null);
        expect(authorized).toBe(false);
        expect(accessToken).toBe(null);
        expect(errorSignIn).toMatchObject(storeError);
      });
    });

    describe('when server not allowed', () => {
      it('returns 500', async () => {
        const storeError = {
          message: 'Incorrect credentials',
          status: 500,
        };
        const response = fetchResponse(500, storeError);
        const {
          user, authorized, accessToken, errorSignIn,
        } = await templateTest(action, response);

        expect(user).toBe(null);
        expect(authorized).toBe(false);
        expect(accessToken).toBe(null);
        expect(errorSignIn).toMatchObject(storeError);
      });
    });
  });

  describe('sign out', () => {
    describe('clear auth store', () => {
      const templateTest = async () => {
        const store = await expectSaga(signOutSaga)
          .provide({
            call(effect, next) {
              if (effect.fn === clearAuthState) {
                return undefined;
              }
              if (effect.fn === historyPush) {
                return undefined;
              }

              return next();
            },
          })
          .withReducer(reducer(history))
          .run();

        return store.storeState[moduleName];
      };

      it('user to be null', async () => {
        const { user } = await templateTest();

        expect(user).toBe(null);
      });

      it('accessToken to be null', async () => {
        const { accessToken } = await templateTest();

        expect(accessToken).toBe(null);
      });

      it('refreshToken to be null', async () => {
        const { refreshToken } = await templateTest();

        expect(refreshToken).toBe(null);
      });

      it('authorized to be false', async () => {
        const { authorized } = await templateTest();

        expect(authorized).toBe(false);
      });
    });

    describe('clear global', () => {
      const templateTest = async () => {
        const store = await expectSaga(clearAuthState)
          .provide({
            call(effect, next) {
              if (effect.fn === historyPush) {
                return undefined;
              }

              return next();
            },
          })
          .withReducer(reducer(history))
          .run();

        return store.storeState;
      };

      it('localStorage', async () => {
        localStorage.setItem('test', 'data');
        await templateTest();

        expect(localStorage).toHaveLength(0);
      });

      it('redux store', async () => {
        const store = await templateTest();

        const emptyStore = appReducer(undefined, { type: null });

        expect(store).toMatchObject(emptyStore);
      });
    });
  });
});
