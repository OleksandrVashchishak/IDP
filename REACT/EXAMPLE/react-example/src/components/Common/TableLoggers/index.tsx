import moment from 'moment';
import { SortOrder } from 'antd/es/table/interface';
import { ParamsType } from '@ant-design/pro-provider';
import { FormInstance, message } from 'antd';
import { useParams, useSearchParams } from 'react-router-dom';
import { ActionType, ProColumns, RequestData } from '@ant-design/pro-table';
import React, { useCallback, useEffect, useRef } from 'react';

import Table from '../Table';
import { getMessageInError } from '../../../hooks/fetch';
import { EntityType, Log, useLoggersGet } from '../../../hooks/loggers';
import { capitalizeFirstLetter, getSorterParams, queryFilterParams } from '../../../utils';

interface TableLoggers {
  entity: EntityType;
}

const TableLoggers: React.FC<TableLoggers> = ({ entity }): JSX.Element => {
  const formRef = useRef<FormInstance>();
  const logsGet = useLoggersGet();
  const actionRef = useRef<ActionType>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { id = 0 } = useParams<{ id: string; }>();

  useEffect(() => {
    if (logsGet.error) {
      message.error(getMessageInError(logsGet.error));
      logsGet.clearError();
    }
  }, [logsGet.error]);

  const tableRequest = (
    { current, pageSize, ...args }: Record<string, string>
      & { pageSize?: number | undefined; current?: number | undefined; keyword?: string | undefined; },
    sorter: Record<string, SortOrder>,
  ): Promise<Partial<RequestData<Log>>> => logsGet.fetch({
    page: current || 1,
    limit: pageSize || 10,
    entity,
    entityId: +id,
    ...args,
    ...getSorterParams(sorter),
  }).then((data) => {
    if (data) {
      return ({ data: data.items || [], success: true, total: data.meta.totalItems });
    }

    return ({ data: [], success: false, total: 0 });
  });

  const beforeSearchSubmit = useCallback((beforeSubmitParams: Partial<ParamsType>) => {
    const params = queryFilterParams({
      ...beforeSubmitParams,
      _timestamp: '',
      search: searchParams.get('search') || '',
    });

    setSearchParams(params);

    return params;
  }, [searchParams.get('search')]);

  const columns: ProColumns<Log>[] = [
    {
      title: 'Event',
      dataIndex: 'event',
      sorter: true,
      renderText: (eventName) => (capitalizeFirstLetter(eventName)),
    },
    {
      title: 'User',
      dataIndex: 'user',
      sorter: true,
      renderText: (username, { user }) => (
        <>
          {user?.login}
        </>
      ),
    },
    {
      title: 'Date/Time',
      dataIndex: 'updated',
      sorter: true,
      hideInSearch: true,
      renderText: (name, { updated }) => (
        <>
          {moment(updated).format('MM/DD/YYYY hh:mm A')}
        </>
      ),
    },
  ];

  return (
    <Table<Log>
      formRef={formRef}
      columns={columns}
      request={tableRequest}
      actionRef={actionRef}
      headerTitle="Activity log"
      columnsState={{ persistenceKey: 'pro-table-loggers', persistenceType: 'localStorage' }}
      showSorterTooltip={false}
      beforeSearchSubmit={beforeSearchSubmit}
    />
  );
};

export default TableLoggers;
