import {
  CustomerServiceOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleFilled,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  FloatButton,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tabs,
} from 'antd';
import {
  default as React,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import context from '../../AppContext';

const { confirm } = Modal;

function Settings() {
  const appContext = useContext(context);
  return (
    <Row gutter={[8, 8]}>
      <Col
        className={`${
          appContext.toggleSideBar ? 'display-block' : 'visually-hidden'
        }`}
        span={6}
      >
        Hello
      </Col>
      <Col span={appContext.toggleSideBar ? 18 : 24}>Hello</Col>
    </Row>
  );
}

export default Settings;
