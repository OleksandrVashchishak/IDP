import React, { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route as PublicRoute, RouteProps, Routes } from 'react-router-dom';

import Main from './main';
import Auth from '../pages/auth';
import Home from '../pages/home';
import SignIn from '../pages/signIn';
import { useAuth } from '../context/auth';
import ForgotPassword from '../pages/forgotPassword';

export interface Route {
  bind: RouteProps;
  name?: string;
  icon?: ReactNode;
  parent?: Route;
  hidden?: boolean;
  onClick?: () => void;
  children?: Route[];
  roleNeeded?: 'user' | 'manager' | 'admin';
  privateRoute?: boolean;
}

export function createChildrenRoutes(initialRoutes: Route[]): Route[] {
  const list: Route[] = [
    ...initialRoutes,
  ];

  function addChildren(route: Route, parent?: Route): void {
    let newRoute = route;

    if (parent) {
      newRoute = {
        ...route,
        parent,
        bind: {
          ...route.bind,
          path: `${parent.bind.path}${route.bind.path}`,
        },
      };
      list.push(newRoute);
    }

    if (newRoute.children) {
      newRoute.children.forEach((child) => addChildren(child, newRoute));
    }
  }

  list.forEach((route) => addChildren(route, undefined));

  return list;
}

function Route(): JSX.Element {
  const { authorized } = useAuth();

  const routes: Route[] = createChildrenRoutes([
    {
      bind: {
        path: '/',
        element: <Home />,
      },
      name: 'Home',
    },
    {
      bind: {
        path: '/sign-in',
        element: <SignIn />,
      },
      name: 'Sign In',
    },
    {
      bind: {
        path: '/forgot-password',
        element: <ForgotPassword />,
      },
      name: 'Forgot Password',
    },
    {
      privateRoute: true,
      bind: {
        path: '/*',
        element: <Main />,
      },
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ privateRoute, bind: { element, ...bind } }) => (
          <PublicRoute
            key={`${bind.path}`}
            {...bind}
            element={(privateRoute && authorized) || !privateRoute ? element : <Auth />}
          />
        ))}
        <PublicRoute path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Route;
