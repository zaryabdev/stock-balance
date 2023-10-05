import { UserAddOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
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
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useRef,
  useState,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import CustomerEditGrid from './CustomerEditGrid';
const { confirm } = Modal;

import List from './List';
import MultiCustomersTabs from './MultiCustomersTabs';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
  },
  {
    key: '2',
    name: 'Joe Black',
  },
  {
    key: '3',
    name: 'Jim Green',
  },
  {
    key: '4',
    name: 'Jim Red',
  },
  {
    key: '5',
    name: 'Lala Red',
  },
  {
    key: '6',
    name: 'Pom Blue',
  },
  {
    key: '7',
    name: 'Tina Green',
  },
  {
    key: '8',
    name: 'Joe Yellow',
  },
  {
    key: '9',
    name: 'Tha Pink',
  },
  {
    key: '10',
    name: 'Thoi Pink',
  },
];

const initialItems = [
  {
    label: 'Tab 1',
    children: <CustomerEditGrid label="CustomerGridSample Tab 1 Content" />,
    key: uuidv4(),
  },
  {
    label: 'Tab 2',
    children: <CustomerEditGrid label="CustomerGridSample Tab 2 Content" />,
    key: uuidv4(),
  },
];

function Customers() {
  const [form] = Form.useForm<{ name: string; address: number }>();

  const [tabs, setTabs] = useState(initialItems);
  const [activeTabKey, setActiveTabKey] = useState(initialItems[0].key);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([
    '1',
    '3',
    '5',
  ]);

  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      // setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const hasSelected = selectedRowKeys.length > 0;

  const createNewCustomer = () => {
    confirm({
      title: 'Add new Customer',
      icon: <UserAddOutlined />,
      content: <CustomerForm form={form} />,
      onOk() {
        saveCustomerToDatabase();
        const newActiveKey = uuidv4();
        const newPanes = [...tabs];
        newPanes.push({
          label: 'New Tab',
          children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
          key: newActiveKey,
        });
        setTabs(newPanes);
        setActiveTabKey(newActiveKey);
      },
      onCancel() {},
    });
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeTabKey;
    let lastIndex = -1;
    tabs.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabs.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabs(newPanes);
    setActiveTabKey(newActiveKey);
  };

  function saveCustomerToDatabase(params: type) {
    let name = form.getFieldValue('name');
    let address = form.getFieldValue('address');

    let data = {
      id: uuidv4(),
      name,
      address,
    };

    debugger;

    window.electron.ipcRenderer.createCustomer(data);

    // window.electron.ipcRenderer.on('create:packing_type', (responseData) => {
    //   console.log(responseData);
    //   console.log('window.electron.ipcRenderer.on');
    //   debugger;
    // });

    window.electron.ipcRenderer.on('create:customer-response', (response) => {
      debugger;
      console.log('create:customer-response reponse came back');

      console.log(response);
    });
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={5}>
        <div style={{ margin: 4 }}>
          <Button
            type="default"
            size="middle"
            onClick={createNewCustomer}
            loading={loading}
            // disabled={!hasSelected}
          >
            Add
          </Button>
          <Button
            type="default"
            size="middle"
            onClick={start}
            loading={loading}
            disabled={!hasSelected}
          >
            Load
          </Button>
          <Button
            type="default"
            size="middle"
            onClick={start}
            loading={loading}
            disabled={!hasSelected}
          >
            Delete
          </Button>
        </div>
        <List
          data={data}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </Col>
      <Col span={19}>
        <MultiCustomersTabs />
      </Col>
    </Row>
  );
}

function CustomerForm({ form }) {
  return (
    <Form form={form} layout="vertical" autoComplete="off">
      <Form.Item name="name" label="Name">
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>
    </Form>
  );
}

export default Customers;
