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
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  id: uuidv4(),
  date: '2023-10-13',
  products: '',
  carton: 0,
  qtyCtn: 0,
  totalQty: 0,
  rateEach: 0,
  debit: 0,
  credit: 0,
  balance: 0,
};

function CustomerEditGrid({ id }) {
  const [data, setData] = useState([{ ...initialState }]);

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

  return (
    <>
      <DataSheetGrid
        value={data}
        columns={columns}
        onChange={(newValue) => setData(newValue)}
        createRow={() => ({ ...initialState })}
        duplicateRow={({ rowData }) => ({ ...rowData, id: uuidv4() })}
      />

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
