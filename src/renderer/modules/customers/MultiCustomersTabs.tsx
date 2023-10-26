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
import { v4 as uuidv4 } from 'uuid';
import CustomerEditGrid from './CustomerEditGrid';

const SampleComponent: FC = ({ id, label }) => {
  return (
    <div>
      <center>
        <h1>
          {id} - {label}
        </h1>
      </center>
    </div>
  );
};

const tempId = uuidv4();

const initialTabsState = [
  {
    label: 'Tab 1',
    children: <CustomerEditGrid customerId={tempId} />,
    key: tempId,
  },
];

function MultiCustomerTabs({ customersList, selectedCutomersToLoad = [] }) {
  const [activeTabKey, setActiveTabKey] = useState('');
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    if (selectedCutomersToLoad.length > 0) {
      const tabsToCreate = getTabs(selectedCutomersToLoad, tabs, customersList);
      const activeKeyToSet = getActiveKey(tabsToCreate, activeTabKey);

      setTabs(tabsToCreate);
      setActiveTabKey(activeKeyToSet);
    }
  }, [selectedCutomersToLoad]);

  function getTabs(keys: type, currentTabs, list) {
    let arr = [];

    if (currentTabs.length === 0) {
      keys.forEach((key) => {
        list.some((el) => {
          if (el.key === key)
            arr.push({
              label: el.name,
              children: <CustomerEditGrid customerId={el.id} />,
              key,
            });
        });
      });
    } else {
      arr = [...currentTabs];

      keys.forEach((key) => {
        const keyAlreadyExists = currentTabs.find((tab) => tab.key === key);

        if (keyAlreadyExists === undefined) {
          list.some((el) => {
            if (el.key === key)
              arr.push({
                label: el.name,
                children: <CustomerEditGrid customerId={el.id} />,
                key,
              });
          });
        }
      });
    }

    return arr;
  }

  function getActiveKey(tabs, currentActiveKey) {
    let newKey = '';

    if (currentActiveKey === '' && tabs.length > 0) {
      newKey = tabs[0].key;
    } else {
      const keyAlreadyExists = tabs.find((tab) => tab.key === currentActiveKey);

      if (keyAlreadyExists === undefined) {
        newKey = tabs[0].key;
      } else {
        newKey = currentActiveKey;
      }
    }

    return newKey;
  }

  const onChange = (newActiveKey: string) => {
    setActiveTabKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove') {
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
    const newTabs = tabs.filter((item) => item.key !== targetKey);

    if (newTabs.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newTabs[lastIndex].key;
      } else {
        newActiveKey = newTabs[0].key;
      }
    } else {
      const keyAlreadyExists = tabs.find((tab) => tab.key === activeTabKey);

      if (keyAlreadyExists && newTabs.length > 0) {
        newActiveKey = activeTabKey;
      } else {
        newActiveKey = '';
      }
    }

    setTabs(newTabs);
    setActiveTabKey(newActiveKey);
  };

  return (
    <div>
      <Tabs
        type="editable-card"
        hideAdd
        onChange={onChange}
        activeKey={activeTabKey}
        onEdit={onEdit}
        items={tabs}
      />
    </div>
  );
}

export default MultiCustomerTabs;
