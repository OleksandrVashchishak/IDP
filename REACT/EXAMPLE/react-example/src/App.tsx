import enUS from 'antd/lib/locale/en_US';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { store } from './store';

import Routes from './routes';
import Auth, { AuthContext } from './context/auth';

import './App.less';

function App(): JSX.Element {
  const [, refreshAuth] = useState({});

  useEffect(() => {
    Auth.change = (): void => refreshAuth({});
  }, []);

  return (
    <Provider store={store}>
      <AuthContext.Provider value={Auth}>
        <ConfigProvider locale={enUS}>
          <Routes />
        </ConfigProvider>
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;
