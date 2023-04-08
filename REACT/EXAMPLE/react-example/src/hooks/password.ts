import { FetchSuccess } from '../types';
import { DefaultFetchError, FetchCreate, useFetchCreate } from './fetch';

export interface PasswordCreateParams {
  login: string;
}

export const usePasswordForgot = (): FetchCreate<FetchSuccess, DefaultFetchError, PasswordCreateParams> => (
  useFetchCreate('auth/forgot/password')
);
