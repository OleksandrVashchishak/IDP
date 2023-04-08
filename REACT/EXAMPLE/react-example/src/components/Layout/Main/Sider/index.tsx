import React from 'react';
import Sider from 'antd/es/layout/Sider';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons/lib';

import Logo from './Logo';
import MenuCommon from './Menu';
import { useAuth } from '../../../../context/auth';

import styles from './index.module.less';

function SiderCommon(): JSX.Element {
  const { logout, user } = useAuth();

  return (
    <Sider width={200} style={{ background: 'none' }}>
      <div className={styles.sider}>
        <Logo />
        <MenuCommon />
        <div className={styles.logoutWrapper}>
          <Button className={styles.logout} onClick={logout}>
            <span className="clip">
              {`${user.firstName} ${user.lastName}`}
            </span>
            <LogoutOutlined />
          </Button>
        </div>
      </div>
    </Sider>
  );
}

export default SiderCommon;
