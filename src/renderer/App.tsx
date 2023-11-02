import {
  CustomerServiceOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleFilled,
  RestOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ConfigProvider, FloatButton, Layout, Menu, theme } from 'antd';
import React, { FC, useState } from 'react';
import 'react-datasheet-grid/dist/style.css';
import { Link, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Context from './AppContext';
import Customers from './modules/customers/Customers';
import Settings from './modules/setting/Settings';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const SampleComponent: FC = ({ label }) => {
  return (
    <div>
      <center>
        <h1>{label}</h1>
      </center>
    </div>
  );
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    'Customers',
    '/',
    <Link to="/">
      <ShoppingCartOutlined />
    </Link>,
  ),
  getItem(
    'Stock',
    '/stock',
    <Link to="/stock">
      <StockOutlined />
    </Link>,
  ),
  getItem(
    'Vendor',
    '/vendor',
    <Link to="/vendor">
      <UserAddOutlined />
    </Link>,
  ),
  getItem(
    'Settings',
    '/settings',
    <Link to="/settings">
      <SettingOutlined />
    </Link>,
  ),
  getItem(
    'Trash',
    '/trash',
    <Link to="/trash">
      <RestOutlined />
    </Link>,
  ),
];

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [toggleSideBar, setToggleSideBar] = useState(true);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const hideSideBar = () => {
    setToggleSideBar((prev) => !prev);
  };

  return (
    <Context.Provider
      value={{
        toggleSideBar,
        setToggleSideBar,
      }}
    >
      <Router>
        <ConfigProvider
          theme={{
            algorithm: [theme.defaultAlgorithm],
          }}
        >
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              theme="dark"
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <Menu
                theme="dark"
                defaultSelectedKeys={['/']}
                mode="inline"
                items={items}
              />
            </Sider>
            <Layout>
              <Content>
                <Routes>
                  <Route path="/" element={<Customers />} />
                  <Route
                    path="/stock"
                    element={
                      <SampleComponent label="Stock from SampleComponent" />
                    }
                  />
                  <Route
                    path="/vendor"
                    element={
                      <SampleComponent label="Vendor from SampleComponent " />
                    }
                  />
                  <Route path="/settings" element={<Settings />} />
                  <Route
                    path="/trash"
                    element={
                      <SampleComponent label="Trash from SampleComponent" />
                    }
                  />
                </Routes>
              </Content>
            </Layout>
          </Layout>
          <FloatButton
            tooltip={`${toggleSideBar ? 'Hide sidebar' : 'Show sidebar'}`}
            style={{ right: 94 }}
            type="default"
            shape="circle"
            icon={
              toggleSideBar ? <DoubleLeftOutlined /> : <DoubleRightOutlined />
            }
            onClick={() => hideSideBar()}
          />
        </ConfigProvider>
      </Router>
    </Context.Provider>
  );
}
