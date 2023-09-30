import {
  SettingOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import React, { FC, useState } from 'react';
import 'react-datasheet-grid/dist/style.css';
import { Link, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Customers from './modules/customers/Customers';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const SampleComponent: FC = ({ label }) => {
  return <div>{label}</div>;
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
];

export default function App() {
  const [collapsed, setCollapsed] = useState(true);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Router>
      <ConfigProvider
        theme={{
          algorithm: [theme.compactAlgorithm],
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
                <Route
                  path="/settings"
                  element={
                    <SampleComponent label="Settings from SampleComponent" />
                  }
                />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Router>
  );
}
