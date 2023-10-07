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

const initialTabsState = [
  {
    label: 'Tab 1',
    children: (
      <SampleComponent id="Sample" label="CustomerGridSample Tab 1 Content" />
    ),
    key: 'sameple',
  },
];

function MultiCustomerTabs({ customersList, selectedCutomersToLoad }) {
  const [activeTabKey, setActiveTabKey] = useState(initialTabsState[0].key);
  const [tabs, setTabs] = useState(initialTabsState);

  useEffect(() => {
    const tabsToCreate = getTabs(selectedCutomersToLoad, tabs, customersList);
    const activeKeyToSet = getActiveKey(tabsToCreate, activeTabKey);

    setTabs(tabsToCreate);
    setActiveTabKey(activeKeyToSet);
  }, [selectedCutomersToLoad]);

  function getTabs(keys: type, currentTabs, list) {
    let arr = [];

    if (currentTabs.length === 0) {
      keys.forEach((key) => {
        list.some((el) => {
          if (el.key === key)
            arr.push({
              label: el.name,
              children: (
                <SampleComponent key={key} id={el.id} label={el.name} />
              ),
              key: key,
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
                children: (
                  <SampleComponent key={key} id={el.id} label={el.name} />
                ),
                key: key,
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
      activeTabKey : {activeTabKey}
      {/* {customersList.length} {JSON.stringify(selectedCutomersToLoad)} */}
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
