import Simple from '../Simple';
import { Logo } from '../../Common/Icon';

import styles from './index.module.less';

interface Simple {
  children: React.ReactNode;
}

export default function Auth({ children }: Simple): JSX.Element {
  return (
    <Simple>
      <div className={styles.wrp}>
        <Logo className={styles.logo} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </Simple>
  );
}
