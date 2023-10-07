import { ExclamationCircleFilled, UserAddOutlined } from '@ant-design/icons';
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

import { STATUS } from '../../contants';
import List from './List';
import MultiCustomersTabs from './MultiCustomersTabs';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

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

const initialCustomerState = {
  id: '',
  key: '',
  name: '',
  phone: '',
  address: '',
};

function Customers() {
  const [customersList, setCustomersList] = useState([]);
  const [selectedCutomer, setSelectedCutomer] = useState(initialCustomerState);
  const [form] = Form.useForm<{
    name: string;
    address: string;
    phone: string;
  }>();
  const [tabs, setTabs] = useState(initialItems);
  const [activeTabKey, setActiveTabKey] = useState(initialItems[0].key);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.getAllCustomers({});
  }, []);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      // setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const createNewCustomer = () => {
    confirm({
      title: 'Add new Customer',
      icon: <UserAddOutlined />,
      content: (
        <CustomerForm
          form={form}
          initialValues={{
            name: '',
            address: '',
            phone: '',
          }}
        />
      ),
      onOk() {
        let id = uuidv4();
        let name = form.getFieldValue('name');
        let address = form.getFieldValue('address');
        let phone = form.getFieldValue('phone');

        let data = {
          id,
          key: id,
          name,
          address,
          phone,
        };

        window.electron.ipcRenderer.createCustomer(data);
        form.resetFields();
      },
      onCancel() {
        form.resetFields();
      },
    });
  };

  const editSelectedCustomer = () => {
    confirm({
      title: 'Edit Customer',
      icon: <UserAddOutlined />,
      content: (
        <CustomerForm
          form={form}
          initialValues={{
            name: selectedCutomer.name,
            address: selectedCutomer.address,
            phone: selectedCutomer.phone,
          }}
        />
      ),
      onOk() {
        debugger;
        let id = selectedCutomer.id;
        let key = selectedCutomer.key;

        let name = form.getFieldValue('name');
        let address = form.getFieldValue('address');
        let phone = form.getFieldValue('phone');

        let data = {
          id,
          key,
          name,
          address,
          phone,
        };

        window.electron.ipcRenderer.updateCustomer(data);
        form.resetFields();
      },
      onCancel() {
        form.resetFields();
      },
    });
  };

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure delete this task?',
      icon: <ExclamationCircleFilled />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        let data = [...selectedRowKeys];
        window.electron.ipcRenderer.deleteCustomers(data);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSelectedRowKeys = (keys: any) => {
    console.log('Selected row keys');
    console.log(keys);

    if (keys.length === 0) {
      setSelectedCutomer(initialCustomerState);
    } else if (keys.length === 1) {
      const foundItem = customersList.find((c) => c.key === keys[0]);

      setSelectedCutomer(foundItem);
    } else {
      setSelectedCutomer(initialCustomerState);
    }

    setSelectedRowKeys(keys);
  };

  const removeTab = (targetKey: TargetKey) => {
    // let newActiveKey = activeTabKey;
    // let lastIndex = -1;
    // tabs.forEach((item, i) => {
    //   if (item.key === targetKey) {
    //     lastIndex = i - 1;
    //   }
    // });
    // const newPanes = tabs.filter((item) => item.key !== targetKey);
    // if (newPanes.length && newActiveKey === targetKey) {
    //   if (lastIndex >= 0) {
    //     newActiveKey = newPanes[lastIndex].key;
    //   } else {
    //     newActiveKey = newPanes[0].key;
    //   }
    // }
    // setTabs(newPanes);
    // setActiveTabKey(newActiveKey);
  };

  window.electron.ipcRenderer.on('create:customer-response', (response) => {
    console.log('create:customer-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of create:customer-response ');
      console.log(response);
      window.electron.ipcRenderer.getAllCustomers({});

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });
  window.electron.ipcRenderer.on('update:customer-response', (response) => {
    console.log('update:customer-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:customer-response ');
      console.log(response);
      window.electron.ipcRenderer.getAllCustomers({});

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });

  window.electron.ipcRenderer.on('get:all:customers-response', (response) => {
    console.log('get:all:customers-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of get:all:customers-response ');
      console.log(response);
      setCustomersList(response.data);

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });

  window.electron.ipcRenderer.on('delete:customers-response', (response) => {
    console.log('delete:customers-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      setSelectedRowKeys([]);
      console.log('response of delete:customers-response ');
      console.log(response);
      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of delete:customers-response  ');
        console.log(response);
        window.electron.ipcRenderer.getAllCustomers({});
      }

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });

  return (
    <Row gutter={[8, 8]}>
      <Col span={6}>
        <div style={{ margin: 4 }}>
          <Button
            type="default"
            size="middle"
            onClick={createNewCustomer}
            // loading={loading}
            disabled={selectedRowKeys.length > 0}
          >
            Add
          </Button>
          <Button
            type="default"
            size="middle"
            onClick={editSelectedCustomer}
            // loading={loading}
            disabled={
              selectedRowKeys.length === 0 || selectedRowKeys.length > 1
            }
          >
            Edit
          </Button>
          <Button
            type="default"
            size="middle"
            onClick={start}
            // loading={loading}
            // disabled={selectedRowKeys.length < 1}
            disabled
          >
            Load
          </Button>
          <Button
            type="default"
            size="middle"
            onClick={showDeleteConfirm}
            // loading={loading}
            disabled={selectedRowKeys.length < 1}
          >
            Delete
          </Button>
        </div>
        <List
          data={customersList}
          selectedRowKeys={selectedRowKeys}
          handleSelectedRowKeys={handleSelectedRowKeys}
        />
      </Col>
      <Col span={18}>
        {JSON.stringify(selectedCutomer)}
        <MultiCustomersTabs />
      </Col>
    </Row>
  );
}

function CustomerForm({ form, initialValues }) {
  form.setFieldValue('name', initialValues.name);
  form.setFieldValue('address', initialValues.address);
  form.setFieldValue('phone', initialValues.phone);

  const nameField = useRef(null);

  useEffect(() => {
    if (nameField && nameField.current) {
      nameField.current.focus();
    }
  }, [nameField]);

  return (
    <Form form={form} layout="vertical" autoComplete="on">
      <Form.Item name="name" label="Name">
        <Input type="text" ref={nameField} />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>
    </Form>
  );
}

export default Customers;
