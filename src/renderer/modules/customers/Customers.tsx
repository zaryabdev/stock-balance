import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, Input, Row, Space, Tabs } from 'antd';
import {
  default as React,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useRef,
  useState,
  useState,
} from 'react';

import List from './List';
import MultiCustomersTabs from './MultiCustomersTabs';

function SearchField(params: type) {
  return (
    <div>
      <Input placeholder="Search" iconrender={<SearchOutlined />} />
    </div>
  );
}

function Customers() {
  return (
    <Row gutter={[8, 8]}>
      <Col span={4}>
        {/* <SearchField /> */}
        <List />
      </Col>
      <Col span={20}>
        <MultiCustomersTabs />
      </Col>
    </Row>
  );
}

export default Customers;
