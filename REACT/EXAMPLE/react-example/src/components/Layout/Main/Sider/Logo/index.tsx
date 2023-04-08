import React from 'react';
import { NavLink } from 'react-router-dom';

import { Logo as LogoCommon } from '../../../../Common/Icon';

import styles from './index.module.less';

function Logo() {
  return (
    <NavLink to="/records">
      <div className={styles.logo}>
        <LogoCommon width="152" height="32" />
      </div>
    </NavLink>
  );
}

export default Logo;
