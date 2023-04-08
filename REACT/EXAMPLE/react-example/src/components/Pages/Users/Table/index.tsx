import Search from 'antd/es/input/Search';
import { SortOrder } from 'antd/es/table/interface';
import { ParamsType } from '@ant-design/pro-provider';
import { PlusOutlined } from '@ant-design/icons/lib';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ActionType, ProColumns, RequestData } from '@ant-design/pro-table';
import { Badge, Button, FormInstance, message } from 'antd';
import React, { Key, useCallback, useEffect, useRef, useState } from 'react';

import Table from '../../../Common/Table';
import { useAuth } from '../../../../context/auth';
import { useContextUsers } from '../../../../context/users';
import { getMessageInError } from '../../../../hooks/fetch';
import { ModalState, ModalTypes } from '../../../../types';
import { UserRoles, UserStatuses } from '../../../../enums/user';
import { TableUserRow, useTableUserRow } from '../../../../hooks/users';
import { getSorterParams, queryFilterParams } from '../../../../utils';

interface TableUsers {
  params?: Record<string, string>;
  openModal?: ((modal: ModalState) => void) | undefined;
  selectedRows?: number[];
  onRowSelection?: ((selectedRows: number[]) => void) | undefined;
}

function TableUsers({ params, openModal, selectedRows, onRowSelection }: TableUsers): JSX.Element {
  const { isRoleEnough } = useAuth();
  const formRef = useRef<FormInstance>();
  const usersGet = useTableUserRow();
  const actionRef = useRef<ActionType>();
  const { userCreate, userUpdate } = useContextUsers();
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  const [searchValue, setSearchValue] = useState<string>(searchParams.get('search') || '');

  const onSearch = (value: string) => {
    setSearchParams(queryFilterParams({
      current: searchParams.get('current') || '',
      pageSize: searchParams.get('pageSize') || '',
      role: searchParams.get('role') || '',
      login: searchParams.get('login') || '',
      email: searchParams.get('email') || '',
      search: value,
      status: searchParams.get('status') || '',
      lastName: searchParams.get('lastName') || '',
      firstName: searchParams.get('firstName') || '',
      warehouse: searchParams.get('warehouse') || '',
      orderByColumn: searchParams.get('orderByColumn') || '',
      orderBy: searchParams.get('orderBy') || '',
    }));
    formRef.current?.submit();
  };

  useEffect(() => {
    if ((userCreate?.data && !userCreate?.error) || (userUpdate?.data && !userUpdate.error)) {
      actionRef.current?.reload();
    }
  }, [userCreate?.data, userUpdate?.data]);

  useEffect(() => {
    if (usersGet.error) {
      message.error(getMessageInError(usersGet.error));
      usersGet.clearError();
    }
  }, [usersGet.error]);

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams.get('search')]);

  const toolBarRender = useCallback(() => [
    <Search
      key="search"
      value={searchValue}
      style={{ width: 264 }}
      onSearch={onSearch}
      onChange={(value) => setSearchValue(value.target.value)}
      placeholder="Search"
    />,
    openModal ? (
      <Button
        key="button"
        icon={<PlusOutlined />}
        type="primary"
        onClick={() => openModal({ type: ModalTypes.create })}
      >
        Add New
      </Button>
    ) : null,
  ], [searchValue, onSearch]);

  const tableRequest = (
    { current, pageSize, ...args }: Record<string, string>
      & { pageSize?: number | undefined; current?: number | undefined; keyword?: string | undefined; },
    sorter: Record<string, SortOrder>,
  ): Promise<Partial<RequestData<TableUserRow>>> => {
    const newParams = queryFilterParams({
      page: current ? `${current}` : '1',
      limit: pageSize ? `${pageSize}` : '10',
      ...args,
      ...getSorterParams(sorter),
    });

    setSearchParams({ ...args, ...getSorterParams(sorter) });

    return usersGet.fetch({ ...newParams, ...params }).then((data) => {
      if (data) {
        const { users, total } = data;

        return ({ data: users || [], success: true, total });
      }

      return ({ data: [], success: false, total: 0 });
    });
  };

  const beforeSearchSubmit = useCallback((beforeSubmitParams: Partial<ParamsType>) => {
    const newParams = queryFilterParams({
      ...beforeSubmitParams,
      _timestamp: '',
      search: searchParams.get('search') || '',
    });

    setSearchParams({ ...newParams, ...params });

    return { ...newParams, ...params };
  }, [searchParams.get('search')]);

  const columns: ProColumns<TableUserRow>[] = [
    {
      title: 'Username ',
      dataIndex: 'login',
      sorter: true,
      renderText: (login, { id, role }) => openModal
      && ((isRoleEnough('manager') && role === 'user') || isRoleEnough('admin'))
        ? (
          <Button
            type="link"
            onClick={() => openModal({ type: ModalTypes.update, id })}
            style={{ padding: 0, border: 0 }}
          >
            {login}
          </Button>
        ) : login,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      sorter: true,
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      sorter: true,
      valueEnum: UserRoles,
      width: 105,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      renderText: (status) => <Badge status={status ? 'success' : 'default'} text={status ? 'Active' : 'Archived'} />,
      hideInSearch: !pathname.includes('users'),
      valueEnum: UserStatuses,
    },
  ];

  const onRowChange = useCallback((selectedRowKeys: Key[]) => {
    if (onRowSelection) {
      onRowSelection(selectedRowKeys as number[]);
    }
  }, [onRowSelection]);

  const rowSelection = {
    onChange: onRowChange,
    selectedRowKeys: selectedRows,
    alwaysShowAlert: false,
    preserveSelectedRowKeys: true,
  };

  return (
    <Table<TableUserRow>
      formRef={formRef}
      columns={columns}
      request={tableRequest}
      actionRef={actionRef}
      headerTitle="Users list"
      rowSelection={!!onRowSelection && !!isRoleEnough('admin') && rowSelection}
      toolBarRender={toolBarRender}
      showSorterTooltip={false}
      beforeSearchSubmit={beforeSearchSubmit}
    />
  );
}

TableUsers.defaultProps = {
  params: {},
  openModal: undefined,
  selectedRows: [],
  onRowSelection: undefined,
};

export default TableUsers;
