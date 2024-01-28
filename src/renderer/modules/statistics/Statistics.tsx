import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Statistic,
  Table,
  Typography,
} from 'antd';
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

const Statistics: React.FC = ({}) => {
  const appContext = useContext(context);

  const [allInvoices, setAllInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchCustoemrText, setCustomerSearchText] = useState('');
  const [searchedCustomerColumn, setSearchedCustomerColumn] = useState('');
  const [customerData, setCustomerData] = useState<DataType[]>([]);
  const [balanceSheetData, setBalanceSheetData] = useState({
    vendor: 0,
    customer: 0,
    current_worth: 0,
    stock_worth: 0,
  });
  const searchCustomerInput = useRef<InputRef>(null);

  const [searchVendorText, setVendorSearchText] = useState('');
  const [searchedVendorColumn, setSearchedVendorColumn] = useState('');
  const [vendorData, setVendorData] = useState<DataType[]>([]);
  const searchVendorInput = useRef<InputRef>(null);

  useEffect(() => {
    getAllCustomersInvoice();
  }, []);

  useEffect(() => {
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

    let customerBalance = 0;

    customerBalanceArr.forEach((element) => {
      customerBalance += element.balance;
    });

    let vendorBalance = 0;

    vendorBalanceArr.forEach((element) => {
      vendorBalance += element.balance;
    });

    const worth = customerBalance - vendorBalance;

    // For Stock

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

      if (type === TYPE.customer) {
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

    console.log(newStock);
    let _stockWorth = 0;

    newStock.map((_stock) => {
      _stockWorth += _stock.current_worth;
    });

    setBalanceSheetData({
      vendor: vendorBalance,
      customer: customerBalance,
      current_worth: worth,
      stock_worth: _stockWorth,
    });

    // appContext.success(`Balance sheet updated.`);
  }, [allInvoices, appContext.customersList]);

  const start = () => {
    getAllCustomersInvoice();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  function getAllCustomersInvoice() {
    const response = window.electron.ipcRenderer.getAllCustomersInvoice({});

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

  return (
    <div
      style={{
        margin: 10,
      }}
    >
      <Button type="default" onClick={start} loading={loading}>
        Refresh Statistics
      </Button>

      <Row gutter={16}>
        <Col span={6}>
          <Card bordered>
            <Statistic
              title="Customer's Balance"
              value={balanceSheetData.customer}
              precision={2}
              valueStyle={{
                color: `${
                  balanceSheetData.customer > 0 ? '#3f8600' : '#cf1322'
                }`,
              }}
              prefix={
                balanceSheetData.customer > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix={
                <span
                  style={{
                    fontSize: 'small',
                  }}
                >
                  PKR
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered>
            <Statistic
              title="Vendor's Balance"
              value={balanceSheetData.vendor}
              precision={2}
              valueStyle={{
                color: `${balanceSheetData.vendor > 0 ? '#3f8600' : '#cf1322'}`,
              }}
              prefix={
                balanceSheetData.vendor > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix={
                <span
                  style={{
                    fontSize: 'small',
                  }}
                >
                  PKR
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered>
            <Statistic
              title="Current Worth"
              value={balanceSheetData.current_worth}
              precision={2}
              valueStyle={{
                color: `${
                  balanceSheetData.current_worth > 0 ? '#3f8600' : '#cf1322'
                }`,
              }}
              prefix={
                balanceSheetData.current_worth > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix={
                <span
                  style={{
                    fontSize: 'small',
                  }}
                >
                  PKR
                </span>
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered>
            <Statistic
              title="Stock Worth"
              value={balanceSheetData.stock_worth}
              precision={2}
              valueStyle={{
                color: `${
                  balanceSheetData.stock_worth > 0 ? '#3f8600' : '#cf1322'
                }`,
              }}
              prefix={
                balanceSheetData.stock_worth > 0 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix={
                <span
                  style={{
                    fontSize: 'small',
                  }}
                >
                  PKR
                </span>
              }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
