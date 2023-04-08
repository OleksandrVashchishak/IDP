import React from 'react';
import { SelectProps } from 'antd/lib/select';
import { Badge, Select } from 'antd';

import { Option } from '../../../types';

const SelectStatus: React.FC<SelectProps<boolean, Option>> = ({ ...props }): JSX.Element => <Select {...props} />;

SelectStatus.defaultProps = {
  options: [
    { label: <Badge status="success" text="Active" />, value: true },
    { label: <Badge status="default" text="Archived" />, value: false },
  ],
};

export default SelectStatus;
