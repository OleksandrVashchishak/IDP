import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { SelectProps } from 'antd/lib/select';
import { Option } from '../../../types';
import { useAuth } from '../../../context/auth';
import { useUsersRolesGet } from '../../../hooks/users';
import { getMessageInError } from '../../../hooks/fetch';
import { capitalizeFirstLetter } from '../../../utils';

const SelectRole: React.FC<SelectProps<string, Option>> = ({ ...props }): JSX.Element => {
  const usersRoles = useUsersRolesGet();
  const { isRoleEnough } = useAuth();

  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (usersRoles.data?.length) {
      setOptions(
        usersRoles.data
          .filter((_, i) => isRoleEnough('admin')
            ? usersRoles.data?.length && i !== (usersRoles.data?.length || 0) - 1
            : usersRoles.data?.length && i === 0)
          .map((role): Option => ({ label: capitalizeFirstLetter(role), value: role })),
      );
    }
  }, [usersRoles.data]);

  useEffect(() => {
    if (usersRoles.error) {
      getMessageInError(usersRoles.error);
      usersRoles.clearError();
    }
  }, [usersRoles.error]);

  return (
    <Select options={options} loading={usersRoles.loading} placeholder="Role" {...props} />
  );
};

export default SelectRole;
