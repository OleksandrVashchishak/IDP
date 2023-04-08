import { FetchSuccess } from '../types';
import { DefaultFetchError, FetchGet, FetchUpdate, useFetchGet, useFetchUpdate } from './fetch';

export interface Setting {
  id: number;
  key: string;
  value: string;
}

export const useSettingsGet = (): FetchGet<Setting[]> => useFetchGet('configurations');

export interface SettingUpdateParams {
  list: { value: string; key: string; }[];
}

export const useSettingUpdate = (): FetchUpdate<FetchSuccess, DefaultFetchError, SettingUpdateParams> => (
  useFetchUpdate('configurations')
);
