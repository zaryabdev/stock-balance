import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Col, Input, Row, Space, Table, Typography } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import context from '../../AppContext';
import { RECORD_TYPE, STATUS, TYPE } from '../../contants';

const { Text, Link } = Typography;

interface DataType {
  id: string;
  name: string;
  balance: number;
}

type DataIndex = keyof DataType;

const Balance: React.FC = ({ activeTab, customersList }) => {
  const appContext = useContext(context);
  console.log(appContext.customersList);
  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchCustoemrText, setCustomerSearchText] = useState('');
  const [searchedCustomerColumn, setSearchedCustomerColumn] = useState('');
  const [customerData, setCustomerData] = useState<DataType[]>([]);
  const searchCustomerInput = useRef<InputRef>(null);

  const [searchVendorText, setVendorSearchText] = useState('');
  const [searchedVendorColumn, setSearchedVendorColumn] = useState('');
  const [vendorData, setVendorData] = useState<DataType[]>([]);
  const searchVendorInput = useRef<InputRef>(null);

  useEffect(() => {
    getAllRecords();
  }, []);
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     console.log(`getAllRecords()`);
  //     getAllRecords();
  //   }, 10000);

  //   return () => {
  //     clearInterval(id);
  //   };
  // }, []);

  useEffect(() => {
    // const vendorStock = {};
    // const customerStock = {};

    // allInvoices.map((item) => {
    //   const { type, product } = item;
    //   if (type === TYPE.vendor) {
    //     if (
    //       product !== RECORD_TYPE.previous_balance &&
    //       product !== RECORD_TYPE.none
    //     ) {
    //       if (vendorStock[product]) {
    //         const currentStockItem = vendorStock[product];
    //         const newStockItem = { ...item };
    //         const newCarton = currentStockItem.carton + newStockItem.carton;
    //         const newTotalQty =
    //           currentStockItem.total_qty + newStockItem.total_qty;
    //         newStockItem.total_qty = newTotalQty;
    //         newStockItem.carton = newCarton;
    //         vendorStock[product] = { ...newStockItem };
    //       } else {
    //         vendorStock[product] = { ...item };
    //       }
    //     }
    //   }

    //   if (type === TYPE.customer) {
    //     if (
    //       product !== RECORD_TYPE.previous_balance &&
    //       product !== RECORD_TYPE.none
    //     ) {
    //       if (customerStock[product]) {
    //         const currentStockItem = customerStock[product];
    //         const newStockItem = { ...item };
    //         const newCarton = currentStockItem.carton + newStockItem.carton;
    //         const newTotalQty =
    //           currentStockItem.total_qty + newStockItem.total_qty;
    //         newStockItem.total_qty = newTotalQty;
    //         newStockItem.carton = newCarton;
    //         customerStock[product] = { ...newStockItem };
    //       } else {
    //         customerStock[product] = { ...item };
    //       }
    //     }
    //   }
    // });
    // console.log(vendorStock);
    // console.log(customerStock);
    // const newStock = [];

    // try {
    //   Object.keys(vendorStock).forEach(function (key, index) {
    //     if (customerStock[key]) {
    //       const itemInCurrentStock = vendorStock[key];
    //       const itemInNewStock = customerStock[key];

    //       const newCarton = itemInCurrentStock.carton - itemInNewStock.carton;
    //       const newTotalQty =
    //         itemInCurrentStock.total_qty - itemInNewStock.total_qty;
    //       itemInNewStock.carton = newCarton;
    //       itemInNewStock.total_qty = newTotalQty;

    //       newStock.push(itemInNewStock);
    //     } else {
    //       newStock.push(vendorStock[key]);
    //     }
    //   });
    // } catch (error) {
    //   console.error(error);
    // }
    // setCustomerData(newStock);
    const customerBalanceMap = {};
    const vendorBalanceMap = {};

    allInvoices.map((item, index) => {
      const customerId = item.customer_id;

      if (item.type === TYPE.customer) {
        if (customerBalanceMap[customerId]) {
          customerBalanceMap[customerId].push({ ...item });
        } else {
          customerBalanceMap[customerId] = [];
          customerBalanceMap[customerId].push({ ...item });
        }
      }
      if (item.type === TYPE.vendor) {
        if (vendorBalanceMap[customerId]) {
          vendorBalanceMap[customerId].push({ ...item });
        } else {
          vendorBalanceMap[customerId] = [];
          vendorBalanceMap[customerId].push({ ...item });
        }
      }

      return item;
    });

    console.log(customerBalanceMap);
    console.log(vendorBalanceMap);

    const customerBalanceArr = [];

    try {
      Object.keys(customerBalanceMap).forEach(function (key, index) {
        const _data = customerBalanceMap[key];
        let _balance = 0;
        let _name = '';
        _data.map((item, index) => {
          if (item.product === RECORD_TYPE.previous_balance) {
            item.balance = item.debit;
            _balance += item.balance;
          } else if (item.product === RECORD_TYPE.none) {
            item.balance = _balance - item.credit;
            _balance -= item.credit;
          } else {
            item.balance = _balance + item.debit;
            _balance += item.debit;
          }

          return item;
        });

        if (appContext.customersList) {
          appContext.customersList.map((customer) => {
            if (customer.id === key) {
              _name = customer.name;
            }
          });
        }

        customerBalanceArr.push({
          customerId: key,
          name: _name,
          balance: _balance,
        });
      });
    } catch (error) {
      console.error(error);
    }

    const vendorBalanceArr = [];

    try {
      Object.keys(vendorBalanceMap).forEach(function (key, index) {
        const _data = vendorBalanceMap[key];
        let _balance = 0;
        let _name = '';
        _data.map((item, index) => {
          if (item.product === RECORD_TYPE.previous_balance) {
            item.balance = item.debit;
            _balance += item.balance;
          } else if (item.product === RECORD_TYPE.none) {
            item.balance = _balance - item.credit;
            _balance -= item.credit;
          } else {
            item.balance = _balance + item.debit;
            _balance += item.debit;
          }

          return item;
        });

        if (appContext.customersList) {
          appContext.customersList.map((customer) => {
            if (customer.id === key) {
              _name = customer.name;
            }
          });
        }

        vendorBalanceArr.push({
          customerId: key,
          name: _name,
          balance: _balance,
        });
      });
    } catch (error) {
      console.error(error);
    }

    setCustomerData(customerBalanceArr);
    setVendorData(vendorBalanceArr);
    // appContext.success(`Balance sheet updated.`);
  }, [allInvoices, appContext.customersList]);

  const start = () => {
    getAllRecords();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  function getAllRecords() {
    window.electron.ipcRenderer.getAllCustomersInvoice({});
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setCustomerSearchText(selectedKeys[0]);
    setSearchedCustomerColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setCustomerSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchCustomerInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setCustomerSearchText((selectedKeys as string[])[0]);
              setSearchedCustomerColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchCustomerInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedCustomerColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchCustoemrText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      ...getColumnSearchProps('balance'),
      sorter: (a, b) => a.balance - b.balance,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  window.electron.ipcRenderer.on(
    'get:all:customer-invoices-response',
    (response) => {
      console.log('get:all:customer-invoices-response reponse came back');
      // console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of get:all:customer-invoices-response ');
        // console.log(response);
        setAllInvoices(response.data);
      }
    },
  );

  return (
    <div
      style={{
        margin: 10,
      }}
    >
      <Button type="primary" onClick={start} loading={loading}>
        Refresh Balance
      </Button>
      <Row>
        <Col span={12}>
          <Table columns={columns} dataSource={customerData} />
          <PriceInTotal data={customerData} />
        </Col>
        <Col span={12}>
          <Table columns={columns} dataSource={vendorData} />
          <PriceInTotal data={vendorData} />
        </Col>
      </Row>
    </div>
  );
};

function PriceInTotal({ data }) {
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (data) {
      debugger;
      let price = 0;

      data.forEach((element) => {
        price += element.balance;
      });

      setTotalPrice(price);
    }
  }, [data]);

  return (
    <Text>
      Total : <Text strong>{totalPrice}</Text>
    </Text>
  );
}

export default Balance;
