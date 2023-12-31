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
import { ConfigProvider, FloatButton, message, theme } from 'antd';

import React, { useEffect, useState } from 'react';
import './App.css';
import Context from './AppContext';
import SampleList from './SampleList';
import { STATUS } from './contants';
import Customers from './modules/customers/Customers';

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const [toggleSideBar, setToggleSideBar] = useState(true);
  const [currentStock, setCurrentStock] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [filteredCustomersList, setFilteredCustomersList] = useState([]);

  useEffect(() => {
    getCurrentStock();
    getCurrentProducts();
  }, []);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const success = (content) => {
    messageApi.open({
      type: 'success',
      content: `${content}`,
    });
  };

  const error = (content) => {
    messageApi.open({
      type: 'error',
      content: `${content}`,
      duration: 10,
    });
  };

  const warning = (content) => {
    messageApi.open({
      type: 'warning',
      content: `${content}`,
    });
  };

  const hideSideBar = () => {
    setToggleSideBar((prev) => !prev);
  };

  function getCurrentStock(params: type) {
    console.log('getCurrentStock()');
    // window.electron.ipcRenderer.getAllStock({});
  }
  function getCurrentProducts(params: type) {
    console.log('getCurrentProducts()');
    window.electron.ipcRenderer.getAllProduct({});
  }
  function getCurrentCustomers(params: type) {
    console.log('getCurrentCustomers()');
    window.electron.ipcRenderer.getAllCustomers({});
  }

  // window.electron.ipcRenderer.on('get:all:stock-response', (response) => {
  //   console.log('get:all:stock-response reponse came back');
  //   console.log(response);
  //   if (response.status === STATUS.FAILED) {
  //     console.log(response.message);
  //   }

  //   if (response.status === STATUS.SUCCESS) {
  //     console.log('response of get:all:stock-response ');
  //     console.log(response);
  //     const list = response.data;

  //     setCurrentStock(list);
  //   }
  // });

  window.electron.ipcRenderer.on('get:all:product-response', (response) => {
    console.log('get:all:product-response reponse came back');
    console.log(response);
    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of get:all:product-response ');
      console.log(response);
      const list = response.data;

      setCurrentProducts(list);
    }
  });

  return (
    <Context.Provider
      value={{
        toggleSideBar,
        currentStock,
        currentProducts,
        customersList,
        filteredCustomersList,
        setFilteredCustomersList,
        setCustomersList,
        setToggleSideBar,
        success,
        error,
        warning,
      }}
    >
      {contextHolder}
      <ConfigProvider
        theme={{
          algorithm: [theme.compactAlgorithm],
        }}
      >
        <Customers
          getCurrentStock={getCurrentStock}
          getCurrentProducts={getCurrentProducts}
          getCurrentCustomers={getCurrentCustomers}
        />
        {/* {toggleSideBar ? (
          <FloatButton
            tooltip="Hide sidebar"
            style={{ right: 95, bottom: 15 }}
            type="default"
            shape="circle"
            icon={<DoubleLeftOutlined />}
            onClick={() => hideSideBar()}
          />
        ) : (
          <FloatButton
            tooltip="Show sidebar"
            style={{ right: 15, bottom: 15 }}
            type="primary"
            shape="circle"
            icon={<DoubleRightOutlined />}
            onClick={() => hideSideBar()}
          />
        )} */}

        <FloatButton
          tooltip={`${toggleSideBar ? 'Hide sidebar' : 'Show sidebar'}`}
          style={{ right: 95, bottom: 15 }}
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
