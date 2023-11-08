import { EditOutlined, SaveOutlined, UndoOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, FloatButton, Row } from 'antd';
import Fuse from 'fuse.js';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DataSheetGrid,
  checkboxColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';
import { v4 as uuidv4 } from 'uuid';
import { SOURCE, STATE, STATUS } from '../../contants';

const initialState = {
  id: '',
  customer_id: '',
  source: SOURCE.memory,
  state: STATE.none,
  date: '2023-10-13',
  product: '',
  payment: '',
  carton: 0,
  qty_ctn: 0,
  total_qty: 0,
  rate_each: 0,
  debit: 0,
  credit: 0,
  balance: 0,
};

const columns = [
  {
    ...keyColumn('date', isoDateColumn),
    title: 'Date',
  },
  {
    ...keyColumn('payment', textColumn),
    title: 'Payment',
    width: 200,
  },
  {
    ...keyColumn('product', textColumn),
    title: 'Product',
  },
  {
    ...keyColumn('carton', intColumn),
    title: 'Carton',
  },
  {
    ...keyColumn('qty_ctn', intColumn),
    title: 'Qty / Ctn',
  },
  {
    ...keyColumn('total_qty', intColumn),
    title: 'Total Qty',
  },
  {
    ...keyColumn('rate_each', floatColumn),
    title: 'Rate Each',
  },
  {
    ...keyColumn('debit', floatColumn),
    title: 'Debit',
  },
  {
    ...keyColumn('credit', floatColumn),
    title: 'Credit',
  },
  {
    ...keyColumn('balance', floatColumn),
    title: 'Balance',
  },

  {
    ...keyColumn('source', textColumn),
    title: 'Source',
  },
  {
    ...keyColumn('state', textColumn),
    title: 'State',
  },
  {
    ...keyColumn('id', textColumn),
    title: 'ID',
  },
];

function CustomerEditGrid({ customerId }) {
  const [data, setData] = useState([
    // { ...initialState, id: uuidv4(), customer_id: customerId },
    // { ...initialState, id: uuidv4(), customer_id: customerId },
    // { ...initialState, id: uuidv4(), customer_id: customerId },
    // { ...initialState, id: uuidv4(), customer_id: customerId },
  ]);
  const [prevData, setPrevData] = useState(data);

  const createdRowIds = useMemo(() => new Set(), []);
  const deletedRowIds = useMemo(() => new Set(), []);
  const updatedRowIds = useMemo(() => new Set(), []);

  // window.electron.ipcRenderer.

  const cancel = () => {
    setData(prevData);
    createdRowIds.clear();
    deletedRowIds.clear();
    updatedRowIds.clear();
  };

  const handleChange = (newValue: any, operations: any) => {
    {
      console.log(newValue);
      for (const operation of operations) {
        if (operation.type === 'CREATE') {
          const newArray = newValue.slice(
            operation.fromRowIndex,
            operation.toRowIndex,
          );

          newArray.forEach(({ id }) => {
            createdRowIds.add(id);
          });
        }

        if (operation.type === 'UPDATE') {
          console.log(data);
          console.log(updatedRowIds);

          debugger;

          const updatedArray = newValue.slice(
            operation.fromRowIndex,
            operation.toRowIndex,
          );

          updatedArray.forEach(({ id }) => {
            if (!createdRowIds.has(id) && !deletedRowIds.has(id)) {
              updatedRowIds.add(id);

              for (let index = 0; index < newValue.length; index++) {
                if (newValue[index].id === id) {
                  let element = newValue[index];
                  element.total_qty = element.carton * element.qty_ctn;
                  newValue[index] = element;
                }
              }
            }
          });
        }

        if (operation.type === 'DELETE') {
          let keptRows = 0;

          // Make sure to use `data` and not `newValue`
          data
            .slice(operation.fromRowIndex, operation.toRowIndex)
            .forEach(({ id }, i) => {
              // If the row was updated, dismiss the update
              // No need to update a row and immediately delete it
              updatedRowIds.delete(id);

              if (createdRowIds.has(id)) {
                // Row was freshly created, simply ignore it
                // No need to insert a row and immediately delete it
                createdRowIds.delete(id);
              } else {
                // Add the row to the deleted Set
                deletedRowIds.add(id);
                // Insert it back into newValue to display it in red to the user
                newValue.splice(
                  operation.fromRowIndex + keptRows++,
                  0,
                  data[operation.fromRowIndex + i],
                );
              }
            });
        }
      }

      setData(newValue);
    }
  };

  const commit = () => {
    /* Perform insert, update, and delete to the database here */

    const newData = data.filter(({ id }) => !deletedRowIds.has(id));
    setData(newData);
    setPrevData(newData);
    console.log(newData);
    debugger;

    console.log(createdRowIds);
    console.log(deletedRowIds);
    console.log(updatedRowIds);

    const withState = data.map((element) => {
      if (createdRowIds.has(element.id)) {
        element.state = STATE.created;
      }

      if (updatedRowIds.has(element.id)) {
        element.state = STATE.updated;
      }

      if (deletedRowIds.has(element.id)) {
        element.state = STATE.deleted;
      }

      return element;
    });
    console.log(withState);
    window.electron.ipcRenderer.updateCustomerInvoice(withState);

    // window.electron.ipcRenderer.createCustomerInvoice(toCreate);

    createdRowIds.clear();
    deletedRowIds.clear();
    updatedRowIds.clear();
  };

  // IPC Main listeners
  window.electron.ipcRenderer.on(
    'create:customer-invoice-response',
    (response) => {
      console.log('create:customer-invoice-response reponse came back');
      console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of create:customer-invoice-response ');
        console.log(response);
        // getAllCustomers({});
      }
    },
  );

  window.electron.ipcRenderer.on(
    'update:customer-customer-invoice',
    (response) => {
      console.log('update:customer-customer-invoice reponse came back');
      console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of update:customer-customer-invoice ');
        console.log(response);
        // getAllCustomers({});
      }
    },
  );

  window.electron.ipcRenderer.on(
    'get:all:customer-invoice-response',
    (response) => {
      console.log('get:all:customer-invoice-response reponse came back');
      console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of get:all:customer-invoice-response ');
        console.log(response);
        // setCustomersList(response.data);
      }
    },
  );

  window.electron.ipcRenderer.on(
    'delete:customer-invoice-response',
    (response) => {
      console.log('delete:customer-invoice-response reponse came back');
      console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        // setSelectedRowKeys([]);
        console.log('response of delete:customer-invoice-response ');
        console.log(response);

        if (response.status === STATUS.FAILED) {
          console.log(response.message);
        }

        if (response.status === STATUS.SUCCESS) {
          console.log('response of delete:customer-invoice-response  ');
          console.log(response);
          // window.electron.ipcRenderer.getAllCustomers({});
        }
      }
    },
  );

  return (
    <>
      Customer ID : {customerId}
      <DataSheetGrid
        value={data}
        columns={columns}
        createRow={() => ({
          ...initialState,
          id: uuidv4(),
          customer_id: customerId,
        })}
        duplicateRow={({ rowData }) => ({
          ...rowData,
          id: uuidv4(),
        })}
        onChange={(newValue, operations) => handleChange(newValue, operations)}
        rowClassName={({ rowData }) => {
          if (deletedRowIds.has(rowData.id)) {
            return 'row-deleted';
          }
          if (createdRowIds.has(rowData.id)) {
            return 'row-created';
          }
          if (updatedRowIds.has(rowData.id)) {
            return 'row-updated';
          }
        }}
      />
      <FloatButton.Group
        trigger="hover"
        type="primary"
        shape="circle"
        style={{ right: 24 }}
        icon={<EditOutlined />}
      >
        <FloatButton tooltip="Undo" onClick={cancel} icon={<UndoOutlined />} />
        <FloatButton
          tooltip={`Save ${customerId}`}
          onClick={commit}
          icon={<SaveOutlined />}
        />
      </FloatButton.Group>
    </>
  );
}

export default CustomerEditGrid;
