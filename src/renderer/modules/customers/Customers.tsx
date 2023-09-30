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

import CustomerList from './CustomerList';
import MultiCustomerGrid from './MultiCustomerGrid';

function CustomerSearch(params: type) {
  return (
    <div>
      <Input placeholder="Search cutomer" iconRender={<SearchOutlined />} />
    </div>
  );
}

function Customers() {
  return (
    <Row gutter={[8, 8]}>
      <Col span={4}>
        <CustomerSearch />
        <CustomerList />
      </Col>
      <Col span={20}>
        <MultiCustomerGrid />
      </Col>
    </Row>
  );
}

export default Customers;
