import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons/lib';
import { HeatMapOutlined } from '@ant-design/icons';
import Users from '../../../../../pages/users';
import Settings from '../../../../../pages/settings';
import { Route } from '../../../../../routes';
import { useAuth } from '../../../../../context/auth';
import Map from '../../../../../pages/map';

const { SubMenu } = Menu;

export const routes: Route[] = [
  // {
  //   bind: {
  //     path: '/reports',
  //   },
  //   name: 'Reports',
  //   icon: <ExperimentOutlined />,
  //   children: [
  //     {
  //       bind: {
  //         element: <Component />,
  //         path: '/qc',
  //       },
  //       name: 'QC Reports',
  //       children: [
  //         {
  //           bind: {
  //             element: <Component />,
  //             path: '/create',
  //           },
  //           name: 'QC Report Create',
  //           hidden: true,
  //           children: [
  //             {
  //               bind: {
  //                 element: <Component />,
  //                 path: '/:id',
  //               },
  //               name: 'QC Report Create Template',
  //               hidden: true,
  //             },
  //           ],
  //         },
  //         {
  //           bind: {
  //             element: <Component />,
  //             path: '/:id/create',
  //           },
  //           name: 'QC Report Create',
  //           hidden: true,
  //         },
  //         {
  //           bind: {
  //             element: <Component />,
  //             path: '/:id',
  //           },
  //           name: 'QC Report Details',
  //           hidden: true,
  //         },
  //         {
  //           bind: {
  //             element: <Component />,
  //             path: '/:id/template/:templateId',
  //           },
  //           name: 'QC Report Template Details',
  //           hidden: true,
  //         },
  //         {
  //           bind: {
  //             element: <Component />,
  //             path: '/update/:id/template/:templateId',
  //           },
  //           name: 'QC Report Edit Template',
  //           hidden: true,
  //         },
  //         {
  //           bind: {
  //             element: <Component />,
  //             path: '/generate/:id',
  //           },
  //           name: 'QC Report Generate',
  //           hidden: true,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    bind: {
      element: <Users />,
      path: '/users',
    },
    name: 'Users',
    icon: <TeamOutlined />,
    roleNeeded: 'manager',
  },
  {
    bind: {
      element: <Settings />,
      path: '/settings',
    },
    name: 'Settings',
    icon: <SettingOutlined />,
    roleNeeded: 'admin',
  },
  {
    bind: {
      element: <Map />,
      path: '/map',
    },
    name: 'Map',
    icon: <HeatMapOutlined />,
  },
];

function MenuCommon(): JSX.Element | null {
  const { pathname } = useLocation();
  const { isRoleEnough } = useAuth();

  const [key, setKey] = useState('');

  useEffect(() => {
    setKey(pathname.split('/').find((item) => !!item) || '');
  }, [pathname]);

  const shownRoutes = routes.filter((item) => isRoleEnough(item.roleNeeded || 'user'));

  if (!key) {
    return null;
  }

  return (
    <Menu
      mode="inline"
      style={{ overflow: 'hidden auto' }}
      selectedKeys={[pathname, `/${key}`]}
      defaultOpenKeys={[`/${key}`]}
      defaultSelectedKeys={[pathname, `/${key}`]}
    >
      {shownRoutes.map((route) => {
        const children = route.children?.filter(({ hidden }) => !hidden);

        return children?.length ? (
          <SubMenu icon={route.icon} title={route.name} key={route.bind.path}>
            {children.map((subRoute) => (
              <Menu.Item key={`${route.bind.path}${subRoute.bind.path}`} icon={subRoute.icon}>
                <Link to={`${route.bind.path}${subRoute.bind.path}`}>
                  {subRoute.name}
                </Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item icon={route.icon} key={route.bind.path}>
            <Link to={route.bind.path || '/'}>
              {route.name}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

export default MenuCommon;
