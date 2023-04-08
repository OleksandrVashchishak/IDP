import ProTable from '@ant-design/pro-table';
import { useRef } from 'react';
import { Button } from 'antd';
import { ParamsType } from '@ant-design/pro-provider';
import { ProTableProps } from '@ant-design/pro-table/lib/typing';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useCurrentLocation from '../../../hooks/router';

export default function Table<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text'
>(props: ProTableProps<DataType, Params, ValueType>): JSX.Element {
  const key = useRef<number>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLocation = useCurrentLocation();

  const { pagination, search } = props;

  const newProps = {
    dateFormatter: 'string',
    ...props,
    key: key.current,
  } as ProTableProps<DataType, Params, ValueType>;

  newProps.options = {
    density: false,
    ...newProps.options,
  };

  newProps.form = search ? undefined : {
    syncToUrl: true,
    extraUrlParams: { search: searchParams.get('search') },
    ...newProps.form,
  };

  newProps.pagination = pagination ?? {
    pageSize: 10,
    size: 'default',
    ...newProps.pagination,
  };

  newProps.search = search ?? {
    optionRender: ({ form }) => ([
      <Button
        key="Clear"
        onClick={(e) => {
          e.preventDefault();
          setTimeout(() => {
            key.current = Date.now();
            navigate(currentLocation, { replace: true });
          }, 0);
        }}
      >
        Clear
      </Button>,
      <Button
        key="Query"
        type="primary"
        onClick={(e) => {
          e.preventDefault();
          form?.submit();
        }}
      >
        Apply
      </Button>,
    ]),
    ...newProps.search,
  };

  return <ProTable<DataType, Params, ValueType> {...newProps} />;
}
