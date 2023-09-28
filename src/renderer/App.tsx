import {
  FormOutlined,
  OrderedListOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { FC, useState } from 'react';
import { Link, Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Grid from './grid/GridSample';
import { PackingType } from './setup/PackingType';
// import { ProductName } from './setup/ProductName';

const { Content, Footer, Sider } = Layout;

const ComponentOne: FC = () => {
  return <div>ComponentOne</div>;
};

const ComponentTwo: FC = () => {
  return <div>ComponentTwo</div>;
};
const ComponentThree: FC = () => {
  return <div>ComponentThree</div>;
};

export default function App() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Router>
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
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="grid">
              <FormOutlined />
              <span>Grid</span>
              <Link to="/" />
            </Menu.Item>
            <Menu.Item key="packing_type">
              <SettingOutlined />
              <span>Packing Type</span>
              <Link to="/packing_type" />
            </Menu.Item>
            <Menu.Item key="product_name">
              <OrderedListOutlined />
              <span>Product Name</span>
              <Link to="/product_name" />
            </Menu.Item>
            {/* <Menu.SubMenu
              title={
                <React.Fragment>
                  <SettingOutlined />
                  <span>Setup</span>
                </React.Fragment>
              }
            >
              <Menu.Item key="packing_type">
                <OrderedListOutlined />
                <span>Packing Type</span>
                <Link to="/packing_type" />
              </Menu.Item>
              <Menu.Item key="product_name">
                <OrderedListOutlined />
                <span>Product Name</span>
                <Link to="/product_name" />
              </Menu.Item>
            </Menu.SubMenu> */}
          </Menu>
        </Sider>
        <Layout className="site-layout no-drag">
          <Content style={{ margin: '0 16px' }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Routes>
                <Route path="/" element={<Grid />} />
                <Route path="/packing_type" element={<PackingType />} />
                {/* <Route path="/product_name" element={<ProductName />} /> */}
              </Routes>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Imprimer ©2022 Created by Z Labz [ 0.1 ]
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}
