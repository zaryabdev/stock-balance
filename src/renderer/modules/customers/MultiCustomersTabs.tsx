import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Tabs,
  Typography,
} from 'antd';
import { v4 as uuidv4 } from 'uuid';

import React, { useEffect, useRef, useState } from 'react';
import CustomerEditGrid from './CustomerEditGrid';

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
  {
    label: 'Tab 1',
    children: <CustomerEditGrid label="CustomerGridSample Tab 1 Content" />,
    key: uuidv4(),
  },
];

function MultiCustomerGrid(params: type) {
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const [form] = Form.useForm<{ name: string; address: number }>();

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    confirm({
      title: 'Add new Customer',
      icon: <ExclamationCircleFilled />,
      content: <CustomerForm form={form} />,
      onOk() {
        saveCustomerToDatabase();
        const newActiveKey = uuidv4();
        const newPanes = [...items];
        newPanes.push({
          label: 'New Tab',
          children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
          key: newActiveKey,
        });
        setItems(newPanes);
        setActiveKey(newActiveKey);
      },
      onCancel() {},
    });
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
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

    window.electron.ipcRenderer.once('create:customer-response', (arg) => {
      debugger;
      // eslint-disable-next-line no-console
      console.log(arg);
    });
  }

  return (
    <div>
      <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
      <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>;
    </div>
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

export default MultiCustomerGrid;
