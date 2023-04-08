import React from 'react';
import { Layout, PageHeader } from 'antd';

import Content from '../../components/Pages/Users';
import UsersProvider from '../../context/users';
import { displayName } from '../../config';

function Users(): JSX.Element {
  document.title = `${displayName}: Users`;

  return (
    <Layout>
      <PageHeader title="Users" />
      <UsersProvider>
        <Content />
      </UsersProvider>
    </Layout>
  );
}

export default Users;
