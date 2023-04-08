import { User } from './users';
import { PagingDataResponse } from '../types';
import { FetchGet, useFetchGet } from './fetch';

export interface Log {
  id: number;
  user: User;
  event: string;
  entity: string;
  created: string;
  updated: string;
  entityId: number | undefined;
}

export type EntityType = 'auth' | 'users' | 'warehouses' | 'images' | 'customers'
  | 'commodities' | 'templates' | 'template_fields' | 'loggers' | 'records' | 'reports'
  | 'report_types' | 'report_templates' | 'report_template_fields' | 'configurations' | 'generators';

export interface LoggersGetParams {
  page?: number;
  user?: string;
  limit?: number;
  event?: number;
  entity: EntityType;
  orderBy?: 'ASC' | 'DESC';
  entityId?: number;
  orderByColumn?: 'id' | 'event' | 'entity' | 'created' | 'updated';
}

export const useLoggersGet = (): FetchGet<PagingDataResponse<Log>, LoggersGetParams> => useFetchGet(
  'loggers',
  { autoStart: false },
);
