import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table, Tag, Typography } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import context from '../../AppContext';
import { RECORD_TYPE, STATUS, TYPE } from '../../contants';

const { Text } = Typography;

interface DataType {
  id: string;
  key: string;
  product: string;
  carton: number;
  qty_ctn: number;
  total_qty: number;
  current_rate: number;
  current_worth: number;
}

type DataIndex = keyof DataType;

const Stock: React.FC = ({ activeTab }) => {
  const appContext = useContext(context);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [data, setData] = useState<DataType[]>([]);
  const [currentStockWorth, setCurrentStockWorth] = useState(0);
  const [allInvoices, setAllInvoices] = useState([]);
  const searchInput = useRef<InputRef>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCustomersInvoice();
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
    const vendorStock = {};
    const customerStock = {};
    allInvoices.map((item) => {
      const { type, product } = item;
      if (type === TYPE.vendor) {
        if (
          product !== RECORD_TYPE.previous_balance &&
          product !== RECORD_TYPE.none
        ) {
          if (vendorStock[product]) {
            const currentStockItem = vendorStock[product];
            const newStockItem = { ...item };
            const newCarton = currentStockItem.carton + newStockItem.carton;
            const newTotalQty =
              currentStockItem.total_qty + newStockItem.total_qty;
            newStockItem.total_qty = newTotalQty;
            newStockItem.carton = newCarton;
            vendorStock[product] = { ...newStockItem };
          } else {
            vendorStock[product] = { ...item };
          }
        }
      }

      if (type === TYPE.customer || type === TYPE.walkingCustomer) {
        if (
          product !== RECORD_TYPE.previous_balance &&
          product !== RECORD_TYPE.none
        ) {
          if (customerStock[product]) {
            const currentStockItem = customerStock[product];
            const newStockItem = { ...item };
            const newCarton = currentStockItem.carton + newStockItem.carton;
            const newTotalQty =
              currentStockItem.total_qty + newStockItem.total_qty;
            newStockItem.total_qty = newTotalQty;
            newStockItem.carton = newCarton;
            customerStock[product] = { ...newStockItem };
          } else {
            customerStock[product] = { ...item };
          }
        }
      }
    });

    // console.log(vendorStock);
    // console.log(customerStock);

    const newStock = [];

    try {
      Object.keys(vendorStock).forEach(function (key, index) {
        if (customerStock[key]) {
          const itemInCurrentStock = vendorStock[key];
          const itemInNewStock = customerStock[key];

          const newCarton = itemInCurrentStock.carton - itemInNewStock.carton;
          const newTotalQty =
            itemInCurrentStock.total_qty - itemInNewStock.total_qty;
          itemInNewStock.carton = newCarton;
          itemInNewStock.total_qty = newTotalQty;
          itemInNewStock.current_rate = itemInCurrentStock.rate_each;

          itemInNewStock.current_worth =
            itemInCurrentStock.rate_each * newTotalQty;

          newStock.push(itemInNewStock);
        } else {
          const itemInCurrentStock = vendorStock[key];
          itemInCurrentStock.current_rate = itemInCurrentStock.rate_each;
          itemInCurrentStock.current_worth =
            itemInCurrentStock.rate_each * itemInCurrentStock.total_qty;

          newStock.push(itemInCurrentStock);
        }
      });
    } catch (error) {
      console.error(error);
    }

    let _stockWorth = 0;

    newStock.map((_stock) => {
      _stockWorth += _stock.current_worth;
    });

    setCurrentStockWorth(_stockWorth);

    setData(newStock);
    appContext.success(`Stocks and Balance Sheet updated.`);
  }, [allInvoices]);

  const start = () => {
    getAllCustomersInvoice();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  async function getAllCustomersInvoice() {
    const response = await window.electron.ipcRenderer.getAllCustomersInvoice(
      {},
    );

    console.log('get:all:customer-invoices-response reponse came back');
    console.log(response);
    debugger;
    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of get:all:customer-invoices-response ');
      // console.log(response);
      setAllInvoices(response.data);
    }
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
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
          ref={searchInput}
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
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
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
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: '30%',
      ...getColumnSearchProps('product'),
      sorter: (a, b) => a.product.localeCompare(b.product),
      sortDirections: ['descend', 'ascend'],
      render: (_, { total_qty, product }) => (
        <Text type={`${total_qty > 0 ? '' : 'danger'}`} key={total_qty}>
          {product}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      sorter: (a, b) => a.total_qty - b.total_qty,
      sortDirections: ['descend', 'ascend'],
      render: (_, { total_qty }) => (
        <Tag color={`${total_qty > 0 ? 'green' : 'red'}`} key={total_qty}>
          {`${total_qty > 0 ? 'In Stock' : 'Out of Stock'}`}
        </Tag>
      ),
    },
    {
      title: 'Carton',
      align: 'right',
      dataIndex: 'carton',
      key: 'carton',
      render: (_, { total_qty, carton }) => (
        <Text type={`${total_qty > 0 ? '' : 'danger'}`} key={total_qty}>
          {carton}
        </Text>
      ),
      width: '8%',
      //   ...getColumnSearchProps('carton'),
    },
    {
      title: 'Quantity / Carton',
      align: 'right',
      dataIndex: 'qty_ctn',
      key: 'qty_ctn',
      render: (_, { total_qty, qty_ctn }) => (
        <Text type={`${total_qty > 0 ? '' : 'danger'}`} key={total_qty}>
          {qty_ctn}
        </Text>
      ),
      //   ...getColumnSearchProps('qty_ctn'),
    },
    {
      title: 'Total Quantity',
      align: 'right',
      dataIndex: 'total_qty',
      key: 'total_qty',
      // ...getColumnSearchProps('total_qty'),
      sorter: (a, b) => a.total_qty - b.total_qty,
      sortDirections: ['descend', 'ascend'],
      render: (_, { total_qty }) => (
        <Text type={`${total_qty > 0 ? '' : 'danger'}`} key={total_qty}>
          {total_qty}
        </Text>
      ),
    },
    {
      title: 'Current Rate',
      align: 'right',
      dataIndex: 'current_rate',
      key: 'current_rate',
      // ...getColumnSearchProps('current_rate'),
      sorter: (a, b) => a.current_rate - b.current_rate,
      sortDirections: ['descend', 'ascend'],
      render: (_, { total_qty, current_rate }) => (
        <Text type={`${total_qty > 0 ? '' : 'danger'}`} key={total_qty}>
          {/* {current_rate.toFixed(2)} */}
          {current_rate.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      ),
    },
    {
      title: 'Current Worth',
      align: 'right',
      dataIndex: 'current_worth',
      key: 'current_worth',
      // ...getColumnSearchProps('current_worth'),
      sorter: (a, b) => a.current_worth - b.current_worth,
      sortDirections: ['descend', 'ascend'],
      render: (_, { total_qty, current_worth }) => (
        <Text type={`${total_qty > 0 ? '' : 'danger'}`} key={total_qty}>
          {/* {current_worth} */}

          {current_worth.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      ),
    },
  ];

  return (
    <div
      style={{
        margin: 10,
      }}
    >
      <Space
        style={{
          margin: 5,
        }}
      >
        <Button type="default" onClick={start} loading={loading}>
          Refresh Stock
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ hideOnSinglePage: true, pageSize: 1000 }}
        scroll={{ y: 440 }}
        footer={() => <TotalWorth currentStockWorth={currentStockWorth} />}
      />
    </div>
  );
};

function TotalWorth({ currentStockWorth = 0 }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
        paddingRight: '20px',
      }}
    >
      <b>Total Worth : </b>&nbsp;
      {currentStockWorth.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

export default Stock;
