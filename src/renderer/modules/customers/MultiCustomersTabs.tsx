import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Modal,
  Space,
  Tabs,
  Typography,
} from 'antd';

import { ExclamationCircleFilled } from '@ant-design/icons';

import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Balance from '../balance/Balance';
import Dashboard from '../dashboard/Dashboard';
import Stock from '../stock/Stock';
import CustomerEditGrid from './CustomerEditGrid';

// const CustomerEditGrid: FC = ({ customerId, type }) => {
//   return (
//     <div>
//       <center>
//         <h1>
//           {customerId} - {type}
//         </h1>
//       </center>
//     </div>
//   );
// };
const { confirm } = Modal;

function MultiCustomerTabs({
  customersList,
  selectedCutomersToLoad = [],
  getCurrentStock,
}) {
  const [activeTabKey, setActiveTabKey] = useState('DASHBOARD');
  const [tabs, setTabs] = useState([
    {
      label: 'Dashboard',
      children: <Dashboard activeTab={activeTabKey} />,
      key: 'DASHBOARD',
      closable: false,
    },
    {
      label: 'Stock',
      children: <Stock activeTab={activeTabKey} />,
      key: 'STOCK',
      closable: false,
    },
    {
      label: 'Balance',
      children: <Balance activeTab={activeTabKey} />,
      key: 'BALANCE',
      closable: false,
    },
  ]);

  useEffect(() => {
    if (selectedCutomersToLoad.length > 0) {
      const tabsToCreate = getTabs(selectedCutomersToLoad, tabs, customersList);
      const activeKeyToSet = getActiveKey(tabsToCreate, activeTabKey);

      setTabs(tabsToCreate);
      setActiveTabKey(activeKeyToSet);
    }
  }, [selectedCutomersToLoad, customersList]);

  function getTabs(keys: type, currentTabs, list) {
    let arr = [];

    if (currentTabs.length === 0) {
      keys.forEach((key) => {
        list.some((el) => {
          if (el.key === key)
            arr.push({
              label: el.name,
              children: (
                <CustomerEditGrid
                  customerId={el.id}
                  type={el.type}
                  getCurrentStock={getCurrentStock}
                />
              ),
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
                children: (
                  <CustomerEditGrid
                    customerId={el.id}
                    type={el.type}
                    getCurrentStock={getCurrentStock}
                  />
                ),
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
      confirm({
        title: 'Are you sure close this tab?',
        icon: <ExclamationCircleFilled />,
        content: 'All unsaved changes will be discarded.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          removeTab(targetKey);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
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
    <Tabs
      type="editable-card"
      hideAdd
      onChange={onChange}
      activeKey={activeTabKey}
      onEdit={onEdit}
      items={tabs}
    />
  );
}

export default MultiCustomerTabs;
