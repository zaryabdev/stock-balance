import {
  SettingOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, theme } from 'antd';
import React, { FC, useState } from 'react';
import 'react-datasheet-grid/dist/style.css';
import { Link, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Customers from './modules/customers/Customers';

const { Content, Footer, Sider } = Layout;

const SampleComponent: FC = ({ label }) => {
  return <div>{label}</div>;
};

export default function App() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Router>
      <ConfigProvider
        theme={{
          algorithm: [],
        }}
      >
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="no-drag"
          >
            <div className="logo" />
            {/* <Menu
            theme="light"
            defaultSelectedKeys={['0']}
            mode="inline"
            items={items}
          /> */}
            <Menu theme="dark" defaultSelectedKeys={['customer']} mode="inline">
              <Menu.Item key="customer">
                <ShoppingCartOutlined />
                <span>Customer</span>
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="stock">
                <StockOutlined />
                <span>Stock</span>
                <Link to="/stock" />
              </Menu.Item>
              <Menu.Item key="vendor">
                <UserAddOutlined />
                <span>Vendor</span>
                <Link to="/vendor" />
              </Menu.Item>
              <Menu.Item key="settings">
                <SettingOutlined />
                <span>Settings</span>
                <Link to="/settings" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout no-drag">
            <Content style={{ margin: '0 16px' }}>
              <div
                className="site-layout-background"
                style={{ padding: 24, minHeight: 360 }}
              >
                <Routes>
                  <Route path="/" element={<Customers />} />
                  <Route
                    path="/stock"
                    element={<SampleComponent label="Stock" />}
                  />
                  <Route
                    path="/vendor"
                    element={<SampleComponent label="Vendor" />}
                  />
                  <Route
                    path="/settings"
                    element={<SampleComponent label="Settings" />}
                  />
                </Routes>
              </div>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </Router>
  );
}
