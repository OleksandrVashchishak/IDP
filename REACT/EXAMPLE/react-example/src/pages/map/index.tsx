import { Layout, PageHeader } from 'antd';
import React from 'react';
import Content from '../../components/Pages/Map';
import { displayName } from '../../config';

export default function Map(): JSX.Element {
  document.title = `${displayName}: Map`;

  return (
    <Layout>
      <PageHeader title="Map" />
      <Content />
    </Layout>
  );
}
