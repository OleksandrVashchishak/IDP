import { Navigate, Routes } from 'react-router-dom';
import { Route as PublicRoute } from 'react-router';

import Auth from '../pages/auth';
import { routes } from '../components/Layout/Main/Sider/Menu';
import MainLayout from '../components/Layout/Main';
import { useAuth } from '../context/auth';
import { createChildrenRoutes } from './index';

const menuRoutes = createChildrenRoutes([
  ...routes,
]);

export default function Main(): JSX.Element {
  const { authorized, isRoleEnough, user } = useAuth();

  const filteredMenuRoutes = menuRoutes.filter((item) => isRoleEnough(item.roleNeeded || user.role || ''));

  return (
    <MainLayout>
      <Routes>
        {filteredMenuRoutes.map(({ privateRoute, bind: { element, ...bind } }) => (
          <PublicRoute
            key={`${bind.path}`}
            {...bind}
            element={(privateRoute && authorized) || !privateRoute ? element : <Auth />}
          />
        ))}
        <PublicRoute path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}
