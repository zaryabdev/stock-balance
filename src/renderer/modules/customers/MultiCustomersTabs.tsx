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

import React, { useEffect, useRef, useState } from 'react';

const SampleComponent: FC = ({ label }) => {
  return (
    <div>
      <center>
        <h1>{label}</h1>
      </center>
    </div>
  );
};

const initialTabsState = [
  {
    label: 'Tab 1',
    children: <SampleComponent label="CustomerGridSample Tab 1 Content" />,
    key: 'sameple',
  },
];

function MultiCustomerTabs({ customersList, selectedRowKeys }) {
  const [activeTabKey, setActiveTabKey] = useState(initialTabsState[0].key);
  const [tabs, setTabs] = useState(initialTabsState);

  const onChange = (newActiveKey: string) => {
    setActiveTabKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'add') {
      // add new tab
    } else {
      removeTab(targetKey);
    }
  };

  const removeTab = (targetKey: TargetKey) => {
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

  return (
    <div>
      {customersList.length} {JSON.stringify(selectedRowKeys)}
      <hr />
      <Tabs
        type="editable-card"
        hideAdd
        onChange={onChange}
        activeKey={activeTabKey}
        onEdit={onEdit}
        items={initialTabsState}
      />
    </div>
  );
}

export default MultiCustomerTabs;
