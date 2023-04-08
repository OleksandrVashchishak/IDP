import React from 'react';

import Layout from '../../components/Layout/Auth';
import Content from '../../components/Pages/SignIn';
import { displayName } from '../../config';

export default function Auth(): JSX.Element {
  document.title = `${displayName}: Authorization`;

  return (
    <Layout>
      <Content />
    </Layout>
  );
}
