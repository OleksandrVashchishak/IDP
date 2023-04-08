import { message } from 'antd';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { FetchError, FetchSuccess } from '../types';
import { FetchGet, FetchUpdate, getMessageInError } from '../hooks/fetch';
import { Setting, SettingUpdateParams, useSettingsGet, useSettingUpdate } from '../hooks/settings';

interface SettingsContext {
  onSave: () => void;
  values: Setting[];
  setValue: (value: Setting) => void;
  isDisabled: boolean;
  settingsGet: FetchGet<Setting[]> | null;
  setIsDisabled: (disabled: boolean) => void;
  settingUpdate: FetchUpdate<FetchSuccess, FetchError, SettingUpdateParams> | null;
}

const defaultValue = {
  onSave: () => undefined,
  values: [],
  setValue: () => undefined,
  isDisabled: false,
  settingsGet: null,
  setIsDisabled: () => undefined,
  settingUpdate: null,
};

export const SettingsContext = createContext<SettingsContext>(defaultValue);

function SettingsProvider({ children }: PropsWithChildren) {
  const settingsGet = useSettingsGet();
  const settingUpdate = useSettingUpdate();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const handleIsDisabledChange = (disabled: boolean) => {
    setIsDisabled(disabled);
  };

  const [values, setValues] = useState<Setting[]>([]);
  const handleValuesChange = (value: Setting) => {
    setValues(values.map((setting) => {
      if (setting.key === value.key) {
        return value;
      }

      return setting;
    }));
  };

  const onSave = () => {
    if (values) {
      const params: SettingUpdateParams = {
        list: values.map((value) => ({ key: value.key, value: `${value.value}` })),
      };

      settingUpdate.fetch(params);
    }
  };

  useEffect(() => {
    settingsGet.fetch();
  }, []);

  useEffect(() => {
    setIsDisabled(!!values.find(({ value }) => !value));
  }, [values]);

  useEffect(() => {
    if (settingsGet.data && !settingsGet.error) {
      setValues(settingsGet.data);
    }
  }, [settingsGet.data]);

  useEffect(() => {
    if (settingsGet.error) {
      message.error(getMessageInError(settingsGet.error));
      settingsGet.clearError();
    }
  }, [settingsGet.error]);

  useEffect(() => {
    if (settingUpdate.data && !settingUpdate.error) {
      message.success('Updated!');
    }
  }, [settingUpdate.data]);

  useEffect(() => {
    if (settingUpdate.error) {
      message.error(getMessageInError(settingUpdate.error));
      settingUpdate.clearError();
    }
  }, [settingUpdate.error]);

  return (
    <SettingsContext.Provider
      value={{
        onSave,
        values,
        setValue: handleValuesChange,
        isDisabled,
        setIsDisabled: handleIsDisabledChange,
        settingsGet,
        settingUpdate,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export default SettingsProvider;

export const useContextSettings = (): SettingsContext => useContext(SettingsContext);
