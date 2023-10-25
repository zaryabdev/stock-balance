import {
  CommentOutlined,
  CustomerServiceOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  HeartOutlined,
  RestOutlined,
  SaveOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UndoOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Descriptions, FloatButton, Row } from 'antd';
import Fuse from 'fuse.js';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DataSheetGrid,
  checkboxColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';

function CustomerEditGrid({ id }) {
  const [data, setData] = useState([
    {
      date: '',
      products: '',
      carton: 0,
      qtyCtn: 0,
      totalQty: 0,
      rateEach: 0,
      debit: 0,
      credit: 0,
      balance: 0,
    },
  ]);

  const columns = [
    {
      ...keyColumn('date', isoDateColumn),
      title: 'Date',
    },
    {
      ...keyColumn('products', textColumn),
      title: 'Products',
    },
    {
      ...keyColumn('carton', intColumn),
      title: 'Carton',
    },
    {
      ...keyColumn('qtyCtn', intColumn),
      title: 'Qty / Ctn',
    },
    {
      ...keyColumn('totalQty', intColumn),
      title: 'Total Qty',
    },
    {
      ...keyColumn('rateEach', floatColumn),
      title: 'Rate Each',
    },
    {
      ...keyColumn('debit', floatColumn),
      title: 'Debit',
    },
    {
      ...keyColumn('credit', floatColumn),
      title: 'Credit',
    },
    {
      ...keyColumn('balance', floatColumn),
      title: 'Balance',
    },
  ];

  const handleChange = (event) => {
    console.log(event);
    setData(event);
  };

  return (
    <>
      <DataSheetGrid value={data} onChange={handleChange} columns={columns} />
      <FloatButton.Group
        trigger="hover"
        type="primary"
        shape="circle"
        style={{ right: 24 }}
        icon={<EditOutlined />}
      >
        <FloatButton tooltip="Undo" icon={<UndoOutlined />} />
        <FloatButton tooltip="Save" icon={<SaveOutlined />} />
      </FloatButton.Group>
    </>
  );
}

export default CustomerEditGrid;
