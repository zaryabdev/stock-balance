import { HeartOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, Row } from 'antd';
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
      title: 'qtyCtn',
    },
    {
      ...keyColumn('totalQty', intColumn),
      title: 'totalQty',
    },
    {
      ...keyColumn('rateEach', floatColumn),
      title: 'rateEach',
    },
    {
      ...keyColumn('debit', floatColumn),
      title: 'debit',
    },
    {
      ...keyColumn('credit', floatColumn),
      title: 'credit',
    },
    {
      ...keyColumn('balance', floatColumn),
      title: 'balance',
    },
  ];

  const handleChange = (event) => {
    console.log(event);
    setData(event);
  };

  return (
    <>
      {id}
      <DataSheetGrid value={data} onChange={handleChange} columns={columns} />
    </>
  );
}

export default CustomerEditGrid;
