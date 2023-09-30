import { HeartOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, Row } from 'antd';
import Fuse from 'fuse.js';
import { nanoid } from 'nanoid';
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
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';

function CustomerEditGrid({ label }) {
  const [data, setData] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ]);

  const columns = [
    {
      ...keyColumn('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn('lastName', textColumn),
      title: 'Last name',
    },
  ];

  return (
    <>
      {label}
      {/* <DataSheetGrid value={data} onChange={setData} columns={columns} /> */}
    </>
  );
}

export default CustomerEditGrid;
