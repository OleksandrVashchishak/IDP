import { UserRoles } from '../enums/user';
import { FetchSuccess, PagingDataResponse } from '../types';
import {
  DefaultFetchError,
  FetchCreate,
  FetchGet,
  FetchGetId,
  FetchUpdate,
  useFetchCreate,
  useFetchGet,
  useFetchGetId,
  useFetchUpdate,
} from './fetch';

export interface UserSimple {
  id: number;
  lastName: string;
  firstName: string;
}

export interface User extends UserSimple {
  role: UserRoles;
  login: string;
  email: string;
  status: boolean;
  updated: string;
  created: string;
}

export interface UserCreateParams {
  role: UserRoles;
  login: string;
  email?: string;
  password: string;
  lastName?: string;
  firstName?: string;
}

export const useUserCreate = (): FetchCreate<FetchSuccess, DefaultFetchError, UserCreateParams> => (
  useFetchCreate('users')
);

export interface UsersGetParams {
  name?: string;
  role?: string;
  page?: number;
  limit?: number;
  login?: string;
  email?: string;
  search?: string;
  status?: boolean;
  orderBy?: 'ASC' | 'DESC';
  lastName?: string;
  firstName?: string;
  warehouses?: string;
  orderByColumn?: 'id' | 'firstName' | 'lastName' | 'login' | 'email' | 'role' | 'status' | 'created' | 'updated';
}

export interface TableUserRow extends UserSimple {
  key: number;
  role: string;
  login: string;
  email: string;
  status: boolean;
  created: string;
}

interface UsersTableData {
  users: TableUserRow[];
  total: number;
}

export const useTableUserRow = (): FetchGet<UsersTableData, UsersGetParams> => (
  useUsersGet((data: PagingDataResponse<User>): UsersTableData => ({
    users: data.items.map((user: User): TableUserRow => ({
      id: user.id,
      key: user.id,
      role: user.role,
      login: user.login,
      email: user.email,
      status: user.status,
      created: user.created,
      lastName: user.lastName,
      firstName: user.firstName,
    })),
    total: data.meta.totalItems,
  }))
);

export function useUsersGet<D = PagingDataResponse<User>,
  DD = D>(decorateData?: (data: D) => DD): FetchGet<DD, UsersGetParams> {
  return useFetchGet<D, DefaultFetchError, unknown, DD>(
    'users',
    { decorateData, autoStart: false },
  );
}

export interface UserUpdateParams {
  role: UserRoles;
  login: string;
  email?: string;
  status: boolean;
  password?: string;
  lastName?: string;
  firstName?: string;
}

export const useUserUpdate = (): FetchUpdate<FetchSuccess, DefaultFetchError, UserUpdateParams> => (
  useFetchUpdate('users')
);

export const useUserId = (): FetchGetId<User> => useFetchGetId('users', '', { autoStart: false });

export const useUsersRolesGet = (): FetchGet<string[]> => useFetchGet('users/roles');
