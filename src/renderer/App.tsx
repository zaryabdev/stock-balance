import {
  CustomerServiceOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleFilled,
  IssuesCloseOutlined,
  RestOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Button,
  ConfigProvider,
  FloatButton,
  Modal,
  Popconfirm,
  Table,
  Tabs,
  message,
  theme,
} from 'antd';

import type { TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';
import './App.css';
import Context from './AppContext';
import SampleList from './SampleList';
import { STATUS, TYPE } from './contants';
import Customers from './modules/customers/Customers';

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();

  const [toggleSideBar, setToggleSideBar] = useState(true);
  const [currentStock, setCurrentStock] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [filteredCustomersList, setFilteredCustomersList] = useState([]);
  const [validationsModal, setValidationsModal] = useState(false);
  const [invalidRows, setInvalidRows] = useState([]);
  const [selectedOption, setSelectedOption] = useState(TYPE.customer);

  const [duplicateRows, setDuplicateRows] = useState([]);

  useEffect(() => {
    getCurrentStock();
    getCurrentProducts();
    getAllCustomersInvoice();
  }, []);

  const getAllProducts = async () => {
    const response = window.electron.ipcRenderer.getAllProducts({});
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
  };
  const getAllCustomers = async () => {
    const response = window.electron.ipcRenderer.getAllCustomers({});
    console.log('get:all:customer-response reponse came back');
    console.log(response);
    debugger;
    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of get:all:customer-response ');
      console.log(response);
      const list = response.data;

      if (selectedOption !== TYPE.archived) {
        const nonArchived = list.filter(
          (item) => item.status !== TYPE.archived,
        );

        const filteredList = nonArchived.filter(
          (item) => item.type === selectedOption,
        );

        setCustomersList(list);
        setFilteredCustomersList(filteredList);
      } else {
        const archived = list.filter((item) => item.status === TYPE.archived);
        setCustomersList(list);
        setFilteredCustomersList(archived);
      }
    }
  };

  window.electron.ipcRenderer.on(
    'delete:duplicated-customer-invoice-response',
    (response) => {
      console.log(
        'delete:duplicated-customer-invoice-response reponse came back',
      );
      // console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        setDuplicateRows([]);
        console.log('response of delete:duplicated-customer-invoice-response ');
        // console.log(response);
      }
    },
  );

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onChange = (key: string) => {
    console.log(key);
  };

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

  const validateData = (data, customersList) => {
    const _invalidRows = [];
    const uniqueRows = {};
    const _duplicateRows = [];

    data.map((item, index) => {
      const {
        id,
        customer_id,
        date,
        product,
        carton,
        qty_ctn,
        total_qty,
        rate_each,
        debit,
        credit,
        balance,
        current_balance,
      } = item;

      if (uniqueRows[id]) {
        const customer = customersList.filter((c) => c.id === customer_id);
        const name = customer[0] && customer[0].name;

        _duplicateRows.push({
          rowId: index,
          message: 'Duplicate entry',
          record: item,
          customer: name,
        });
      } else {
        let msg = '';
        let valid = true;

        if (!date || date === 'null') {
          msg += 'Date, ';
          valid = false;
        }

        // if (!product || product === 'null') {
        //   ;
        //   msg += 'product, ';
        //   valid = false;
        // }

        if (!carton || carton === 'null') {
          if (carton !== 0) {
            msg += 'Carton, ';
            valid = false;
          }
        }

        if (!qty_ctn || qty_ctn === 'null') {
          if (qty_ctn !== 0) {
            msg += 'Qty / Ctn, ';
            valid = false;
          }
        }

        if (!total_qty || total_qty === 'null') {
          if (total_qty !== 0) {
            msg += 'Total Qty, ';
            valid = false;
          }
        }

        if (!rate_each || rate_each === 'null') {
          if (rate_each !== 0) {
            msg += 'Rate Each, ';
            valid = false;
          }
        }

        if (!debit) {
          if (debit !== 0 || debit === 'null') {
            msg += 'Debit, ';
            valid = false;
          }
        }

        if (!credit || credit === 'null') {
          if (credit !== 0) {
            msg += 'Credit, ';
            valid = false;
          }
        }

        if (!current_balance || current_balance === 'null') {
          if (current_balance !== 0) {
            msg += 'Balance, ';
            valid = false;
          }
        }

        if (!valid) {
          const customer = customersList.filter((c) => c.id === customer_id);
          const name = customer[0] && customer[0].name;
          _invalidRows.push({
            rowId: index,
            message: `${msg} of ${name} at id ${index}`,
            record: item,
            customer: name,
          });
        }

        uniqueRows[id] = { rowId: index, message: '', record: item };
      }
    });

    const validation = {
      isValid: true,
      message: '',
      invalidRows: [],
      duplicateRows: [],
    };

    if (_invalidRows.length > 0) {
      validation.isValid = false;
      validation.invalidRows = _invalidRows;
      validation.message = 'Invalid Data';
    }

    if (_duplicateRows.length > 0) {
      validation.isValid = false;
      validation.message = 'Invalid Data';
      validation.duplicateRows = _duplicateRows;
    }

    return validation;
  };

  function validateInvoices() {
    const validations = validateData(allInvoices, customersList);

    setInvalidRows(validations.invalidRows);
    setDuplicateRows(validations.duplicateRows);
    debugger;

    if (!validations.isValid) {
      setValidationsModal(true);
    } else {
      success('All records passed validations.');
    }
  }

  function getCurrentStock(params: type) {
    console.log('getCurrentStock()');
    // window.electron.ipcRenderer.getAllStock({});
  }
  function getCurrentProducts(params: type) {
    console.log('getCurrentProducts()');
    getAllProducts({});
  }

  function getCurrentCustomers(params: type) {
    console.log('getAllCustomers()');
    getAllCustomers({});
  }

  function getAllCustomersInvoice() {
    const response = window.electron.ipcRenderer.getAllCustomersInvoice({});
    console.log('get:all:customer-invoices-response reponse came back');

    console.log(response);
    debugger;
    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      setAllInvoices(response.data);
    }
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

  const deleteDuplicatedCustomerInvoice = (recordsToDelete) => {
    const response =
      window.electron.ipcRenderer.deleteDuplicatedCustomerInvoice(
        recordsToDelete,
      );

    console.log(response);
    debugger;
  };

  const confirm = (e: React.MouseEvent<HTMLElement>) => {
    const recordsToDelete = [];
    if (duplicateRows) {
      duplicateRows.map((item) => {
        recordsToDelete.push(item.record);
      });
    }

    deleteDuplicatedCustomerInvoice(recordsToDelete);
  };

  const cancel = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);

    message.warning('Duplicate data can cause uncertain calculations.');
  };

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
          algorithm: [theme.compactAlgorithm, theme.darkAlgorithm],
        }}
      >
        <Customers
          getCurrentStock={getCurrentStock}
          getCurrentProducts={getCurrentProducts}
          getCurrentCustomers={getCurrentCustomers}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
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
          // tooltip={`${toggleSideBar ? 'Hide sidebar' : 'Show sidebar'}`}
          style={{ right: 140, bottom: 15 }}
          type="default"
          shape="circle"
          icon={
            toggleSideBar ? <DoubleLeftOutlined /> : <DoubleRightOutlined />
          }
          onClick={() => hideSideBar()}
        />
        <FloatButton
          // tooltip="Hide sidebar"
          style={{ right: 100, bottom: 15 }}
          type="default"
          shape="circle"
          icon={<IssuesCloseOutlined />}
          onClick={() => validateInvoices()}
        />
        <Modal
          title="Validation Results"
          style={{ top: 40 }}
          width={800}
          open={validationsModal}
          onOk={() => setValidationsModal(false)}
          onCancel={() => setValidationsModal(false)}
          footer={[
            <Button onClick={getAllCustomersInvoice}>Refresh Data</Button>,
            <Button onClick={validateInvoices}>Check Validation</Button>,
            <Popconfirm
              title="Delete Duplicate Records"
              description="Are you sure to delete duplicate records?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Remove Duplicate Records</Button>
            </Popconfirm>,
          ]}
        >
          <Tabs
            defaultActiveKey="1"
            centered
            items={[
              {
                label: 'Invalid Records',
                key: '1',
                children: <DuplicateRowsTable data={invalidRows} />,
              },
              {
                label: 'Duplicate Records',
                key: '2',
                children: <DuplicateRowsTable data={duplicateRows} />,
              },
            ]}
            onChange={onChange}
          />
        </Modal>
      </ConfigProvider>
    </Context.Provider>
  );
}

function DuplicateRowsTable({ data = [] }) {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const _data = [];
    if (data) {
      data.map((item) => {
        _data.push({
          rowId: item.rowId,
          customer: item.customer,
          message: item.message,
          date: item.record.date,
          payment: item.record.payment,
          product: item.record.product,
        });
      });
      setDataSource(_data);
    }
  }, [data]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'rowId',
      key: 'rowId',
      width: '10%',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: '20%',
    },
    {
      title: 'Name',
      dataIndex: 'customer',
      key: 'customer',
      ellipsis: true,
      width: '30%',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
  ];

  return (
    <Table
      size="small"
      dataSource={dataSource}
      columns={columns}
      pagination={{ hideOnSinglePage: true, pageSize: 100 }}
      scroll={{ y: 400 }}
    />
  );
}
