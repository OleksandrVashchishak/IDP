import React from 'react';
import styles from './index.module.less';
import { IconNotFoundContent } from '../Icon';

interface NotFoundContent {
  message?: string;
}

const NotFoundContent: React.FC<NotFoundContent> = ({ message }) => (
  <div className={styles.wrapper}>
    <div>
      <IconNotFoundContent />
    </div>
    <div className={styles.message}>
      {message}
    </div>
  </div>
);

NotFoundContent.defaultProps = {
  message: 'No Data.',
};

export default NotFoundContent;
