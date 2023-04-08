import React from 'react';
import { Layout } from 'antd';

import Content from '../../components/Pages/Settings';
import { displayName } from '../../config';
import SettingsProvider from '../../context/settings';

function Settings(): JSX.Element {
  document.title = `${displayName}: Settings`;

  return (
    <Layout>
      <SettingsProvider>
        <Content />
      </SettingsProvider>
    </Layout>
  );
}

export default Settings;
