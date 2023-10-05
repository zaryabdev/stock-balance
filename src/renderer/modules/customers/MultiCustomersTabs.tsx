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

function MultiCustomerTabs({ items, activeKey, setActiveKey, removeTab }) {
  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
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

  return (
    <div>
      <Tabs
        type="editable-card"
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        items={items}
      />
    </div>
  );
}

export default MultiCustomerTabs;
