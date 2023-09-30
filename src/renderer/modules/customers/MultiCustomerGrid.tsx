import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Input, Modal, Space, Tabs } from 'antd';
import { nanoid } from 'nanoid';
import React, { useRef, useState } from 'react';
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

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [credit, setCredit] = useState(0);
  const [balance, setBalance] = useState(0);

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    confirm({
      title: 'Add new Customer',
      icon: <ExclamationCircleFilled />,
      content: (
        <CustomerForm
          setName={setName}
          setAddress={setAddress}
          setCredit={setCredit}
          setBalance={setBalance}
        />
      ),
      onOk() {
        //
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

function CustomerForm({ setName, setAddress, setBalance, setCredit }) {
  return (
    <>
      <Input placeholder="Name" onChange={setName} />
      <Input placeholder="Address" onChange={setAddress} />
      <Input placeholder="Balance" onChange={setBalance} />
      <Input placeholder="Credit" onChange={setCredit} />
    </>
  );
}

export default MultiCustomerGrid;
