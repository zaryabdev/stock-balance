import {
  CommentOutlined,
  CustomerServiceOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  HeartOutlined,
  RestOutlined,
  SaveOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  UndoOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
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

const initialState = {
  id: uuidv4(),
  date: '2023-10-13',
  products: '',
  carton: 0,
  qtyCtn: 0,
  totalQty: 0,
  rateEach: 0,
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
    ...keyColumn('products', textColumn),
    title: 'Products',
  },
  {
    ...keyColumn('carton', intColumn),
    title: 'Carton',
  },
  {
    ...keyColumn('qtyCtn', intColumn),
    title: 'Qty / Ctn',
  },
  {
    ...keyColumn('totalQty', intColumn),
    title: 'Total Qty',
  },
  {
    ...keyColumn('rateEach', floatColumn),
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
];

function CustomerEditGrid({ customerId }) {
  const [data, setData] = useState([{ ...initialState }]);
  const [prevData, setPrevData] = useState(data);

  const createdRowIds = useMemo(() => new Set(), []);
  const deletedRowIds = useMemo(() => new Set(), []);
  const updatedRowIds = useMemo(() => new Set(), []);

  const cancel = () => {
    setData(prevData);
    createdRowIds.clear();
    deletedRowIds.clear();
    updatedRowIds.clear();
  };

  const commit = () => {
    /* Perform insert, update, and delete to the database here */

    const newData = data.filter(({ id }) => !deletedRowIds.has(id));
    setData(newData);
    setPrevData(newData);

    createdRowIds.clear();
    deletedRowIds.clear();
    updatedRowIds.clear();
  };

  return (
    <>
      <DataSheetGrid
        value={data}
        columns={columns}
        createRow={() => ({ ...initialState })}
        duplicateRow={({ rowData }) => ({ ...rowData, id: uuidv4() })}
        onChange={(newValue, operations) => {
          for (const operation of operations) {
            if (operation.type === 'CREATE') {
              newValue
                .slice(operation.fromRowIndex, operation.toRowIndex)
                .forEach(({ id }) => createdRowIds.add(id));
            }

            if (operation.type === 'UPDATE') {
              newValue
                .slice(operation.fromRowIndex, operation.toRowIndex)
                .forEach(({ id }) => {
                  if (!createdRowIds.has(id) && !deletedRowIds.has(id)) {
                    updatedRowIds.add(id);
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
        }}
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
        <FloatButton tooltip="Save" onClick={commit} icon={<SaveOutlined />} />
      </FloatButton.Group>
    </>
  );
}

export default CustomerEditGrid;
