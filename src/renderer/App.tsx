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
import { ConfigProvider, FloatButton, theme } from 'antd';

import React, { useState } from 'react';
import './App.css';
import Context from './AppContext';
import SampleList from './SampleList';
import Customers from './modules/customers/Customers';

export default function App() {
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
      <ConfigProvider
        theme={{
          algorithm: [theme.compactAlgorithm],
        }}
      >
        <Customers />
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
    </Context.Provider>
  );
}
