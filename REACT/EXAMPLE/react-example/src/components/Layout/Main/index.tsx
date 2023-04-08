import React, { PropsWithChildren } from 'react';
import { Layout } from 'antd';

import SiderCommon from './Sider';

import styles from './index.module.less';

const Main: React.FC<PropsWithChildren> = ({ children }): JSX.Element => (
  <Layout className={styles.layout}>
    <SiderCommon />
    {children}
  </Layout>
);

export default Main;
