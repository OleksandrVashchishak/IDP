import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Logo } from '../../Common/Icon';
import { useAuth } from '../../../context/auth';

import styles from './index.module.less';

function Home(): JSX.Element | null {
  const navigate = useNavigate();
  const { authorized } = useAuth();

  const [time] = useState(Date.now() + 2000);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      setActive(true);
    }

    const id = setTimeout(() => {
      if (authorized) {
        navigate('/users', { replace: true });
      } else {
        navigate('/sign-in', { replace: true });
      }
    }, Math.max(time - Date.now(), 0));

    return () => clearTimeout(id);
  }, [authorized]);

  return <Logo className={clsx(styles.svg, { [styles.active]: active })} />;
}

export default Home;
