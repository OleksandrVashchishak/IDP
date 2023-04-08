import React, { createContext, PropsWithChildren, useContext } from 'react';

import { FetchSuccess } from '../types';
import { DefaultFetchError, FetchCreate, FetchUpdate } from '../hooks/fetch';
import { UserCreateParams, UserUpdateParams, useUserCreate, useUserUpdate } from '../hooks/users';

interface UsersContext {
  userCreate: FetchCreate<FetchSuccess, DefaultFetchError, UserCreateParams> | null;
  userUpdate: FetchUpdate<FetchSuccess, DefaultFetchError, UserUpdateParams> | null;
}

const defaultValue = {
  userCreate: null,
  userUpdate: null,
};

export const UsersContext = createContext<UsersContext>(defaultValue);

function UsersProvider({ children }: PropsWithChildren) {
  const userCreate = useUserCreate();
  const userUpdate = useUserUpdate();

  return (
    <UsersContext.Provider value={{ userCreate, userUpdate }}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersProvider;

export const useContextUsers = (): UsersContext => useContext(UsersContext);
