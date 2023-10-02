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
import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from 'react';
import CustomerEditGrid from './CustomerEditGrid';

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const initialItems = [
  {
    label: 'Tab 1',
    children: <CustomerEditGrid label="CustomerGridSample Tab 1 Content" />,
    key: nanoid(),
  },
];

function MultiCustomerGrid(params: type) {
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const [form] = Form.useForm<{ name: string; age: number }>();
  const nameValue = Form.useWatch('name', form);
  console.log(nameValue);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    confirm({
      title: 'Add new Customer',
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          <Form form={form} layout="vertical" autoComplete="off">
            <Form.Item name="name" label="Name (Watch to trigger rerender)">
              <Input />
            </Form.Item>
            <Form.Item name="age" label="Age (Not Watch)">
              <InputNumber />
            </Form.Item>
          </Form>

          <Typography>
            <pre>Name Value: {nameValue}</pre>
          </Typography>
        </>
      ),
      onOk() {
        debugger;
        console.log('yes OK');
        saveCustomerToDatabase();

        const newActiveKey = nanoid();
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
    console.log('%c Going to call createCustomer', 'color: tomato');

    debugger;

    // window.electron.ipcRenderer.createCustomer({
    //   id: nanoid(),
    //   userName,
    // });

    // window.electron.ipcRenderer.on('create:packing_type', (responseData) => {
    //   console.log('create:packing_type event response');
    //   console.log({ responseData });
    //   console.log('Going to call getAllPackingTypes from createPackingType');
    // });
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
    </div>
  );
}

function CustomerForm({ name, addrress }) {
  return (
    <>
      <Input onChange={(event) => (name = event.target.value)} />
      <Input onChange={(event) => (addrress = event.target.value)} />
    </>
  );
}

export default MultiCustomerGrid;
