import clsx from 'clsx';
import React from 'react';
import { Spin } from 'antd';
import { SpinSize } from 'antd/lib/spin';

import styles from './index.module.less';

interface Loading {
  size?: SpinSize;
  absolute?: boolean;
  visible: boolean;
}

function Loading({ size, absolute, visible }: Loading): JSX.Element | null {
  return visible ? (
    <div className={clsx(styles.loading, absolute ? styles.absolute : '')}>
      <Spin size={size} />
    </div>
  ) : null;
}

Loading.defaultProps = {
  size: 'large',
  absolute: false,
};

export default Loading;
