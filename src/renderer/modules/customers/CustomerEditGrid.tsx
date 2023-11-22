import {
  EditOutlined,
  FilePdfOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Descriptions, FloatButton, Row } from 'antd';
import Fuse from 'fuse.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  CellProps,
  Column,
  DataSheetGrid,
  checkboxColumn,
  floatColumn,
  intColumn,
  isoDateColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';
import Select, { GroupBase, SelectInstance } from 'react-select';

import { v4 as uuidv4 } from 'uuid';
import { SOURCE, STATE, STATUS } from '../../contants';

type Choice = {
  label: string;
  value: string;
};

type Row = {
  flavor: string | null;
  quantity: number | null;
};

type SelectOptions = {
  choices: Choice[];
  disabled?: boolean;
};

const SelectComponent = React.memo(
  ({
    active,
    rowData,
    setRowData,
    focus,
    stopEditing,
    columnData,
  }: CellProps<string | null, SelectOptions>) => {
    const ref = useRef<SelectInstance<Choice, false, GroupBase<Choice>>>(null);

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.focus();
      } else {
        ref.current?.blur();
      }
    }, [focus]);
    console.log('Inside SelectComponent');
    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            flex: 1,
            alignSelf: 'stretch',
            pointerEvents: focus ? undefined : 'none',
          }),
          control: (provided) => ({
            ...provided,
            height: '100%',
            border: 'none',
            boxShadow: 'none',
            background: 'none',
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            opacity: 0,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
        }}
        isDisabled={columnData.disabled}
        value={
          columnData.choices.find(({ value }) => value === rowData) ?? null
        }
        menuPortalTarget={document.body}
        menuIsOpen={focus}
        onChange={(choice) => {
          if (choice === null) return;

          setRowData(choice.value);
          setTimeout(stopEditing, 0);
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        options={columnData.choices}
      />
    );
  },
);

const selectColumn = (
  options: SelectOptions,
): Column<string | null, SelectOptions> => ({
  component: SelectComponent,
  columnData: options,
  disableKeys: true,
  keepFocus: true,
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) =>
    options.choices.find((choice) => choice.value === rowData)?.label ?? null,
  pasteValue: ({ value }) =>
    options.choices.find((choice) => choice.label === value)?.value ?? null,
});

function CustomerEditGrid() {
  console.log('Inside CustomerEditGrid');
  // const [data, setData] = useState<Array<string | null>>([
  //   'chocolate',
  //   'strawberry',
  //   null,
  // ]);

  const [data, setData] = useState<Row[]>([
    // { flavor: 'chocolate', quantity: 3 },
    // { flavor: 'strawberry', quantity: 5 },
    // { flavor: null, quantity: null },
  ]);

  const columns: Column<Row>[] = [
    {
      ...keyColumn(
        'flavor',
        selectColumn({
          choices: [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' },
          ],
        }),
      ),
      title: 'Flavor',
    },
    {
      ...keyColumn('quantity', intColumn),
      title: 'Quantity',
    },
  ];

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        value={data}
        onChange={setData}
        columns={columns}
        // columns={[
        //   {
        //     ...selectColumn({
        //       choices: [
        //         { value: 'chocolate', label: 'Chocolate' },
        //         { value: 'strawberry', label: 'Strawberry' },
        //         { value: 'vanilla', label: 'Vanilla' },
        //       ],
        //     }),
        //     title: 'Flavor',
        //   },
        // ]}
      />
    </div>
  );
}

function CustomerEditGrid2({ customerId, type }) {
  const initialState = {
    id: '',
    customer_id: '',
    source: SOURCE.memory,
    state: STATE.created,
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
      width: 200,
      // component: ProductAutoFill,
      // keepFocus: true,
      // onColumnChange: handleChange,
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

    // {
    //   ...keyColumn('source', textColumn),
    //   title: 'Source',
    // },
    // {
    //   ...keyColumn('state', textColumn),
    //   title: 'State',
    // },
    // {
    //   ...keyColumn('id', textColumn),
    //   title: 'ID',
    // },
  ];

  const [data, setData] = useState([
    // { ...initialState, id: uuidv4(), customer_id: customerId },
  ]);
  const [prevData, setPrevData] = useState(data);

  const createdRowIds = useMemo(() => new Set(), []);
  const deletedRowIds = useMemo(() => new Set(), []);
  const updatedRowIds = useMemo(() => new Set(), []);

  useEffect(() => {
    getAllRecordsById(customerId);
  }, [customerId]);

  function getAllRecordsById(customerId) {
    window.electron.ipcRenderer.getAllCustomerInvoicesById({
      id: customerId,
    });
  }

  const cancel = () => {
    setData(prevData);
    createdRowIds.clear();
    deletedRowIds.clear();
    updatedRowIds.clear();
  };

  function handleChange(newValue: any, operations: any) {
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
            console.log(!createdRowIds.has(id) && !deletedRowIds.has(id));
            if (!createdRowIds.has(id) && !deletedRowIds.has(id)) {
              updatedRowIds.add(id);
            }
            for (let index = 0; index < newValue.length; index++) {
              if (newValue[index].id === id) {
                let element = newValue[index];
                element.total_qty = element.carton * element.qty_ctn;
                element.state = STATE.updated;
                newValue[index] = element;
              }
            }
          });
        }

        if (operation.type === 'DELETE') {
          debugger;
          let keptRows = 0;

          // Make sure to use `data` and not `newValue`
          let slicedData = data.slice(
            operation.fromRowIndex,
            operation.toRowIndex,
          );

          slicedData.forEach(({ id }, i) => {
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
              let ele = data[operation.fromRowIndex + i];
              ele.state = STATE.deleted;
              debugger;
              console.log(ele);
              newValue.splice(operation.fromRowIndex + keptRows++, 0, ele);
            }
          });
        }
      }

      setData(newValue);
    }
  }

  const commit = () => {
    /* Perform insert, update, and delete to the database here */

    // const newData = data.filter(({ id }) => !deletedRowIds.has(id));

    // console.log(newData);
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

    setData(withState);
    setPrevData(withState);

    debugger;
    window.electron.ipcRenderer.updateCustomerInvoice(withState);
    // window.electron.ipcRenderer.createCustomerInvoice(toCreate);

    createdRowIds.clear();
    deletedRowIds.clear();
    updatedRowIds.clear();
  };

  const print = () => {
    const doc = new jsPDF();

    // define the columns we want and their titles
    const tableColumn = [
      'Date',
      'Payment',
      'Product',
      'Carton',
      'Qty / Ctn',
      'Total Qty',
      'Rate Each',
      'Debit',
      'Credit',
      'Balance',
    ];
    // define an empty array of rows
    const tableRows = [];

    // for each ticket pass all its data into an array
    data.forEach((record) => {
      const inArr = [
        record.date,
        record.payment,
        record.product,
        record.carton,
        record.qty_ctn,
        record.total_qty,
        record.rate_each,
        record.debit,
        record.credit,
        record.balance,
      ];
      // push each tickcet's info into a row
      tableRows.push(inArr);
    });

    debugger;

    // startY is basically margin-top
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(' ');
    // we use a date string to generate our filename.
    // const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    // ticket title. and margin-top + margin-left
    // doc.text(`Customer ID : ${customerId}`, 14, 15);
    // we define the name of our PDF file.
    doc.save(`report_${customerId}.pdf`);
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
        getAllRecordsById(customerId);
      }
    },
  );

  window.electron.ipcRenderer.on(
    'get:all:customer-invoices:id-response',
    (response) => {
      console.log('get:all:customer-invoices:id-response reponse came back');
      console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of get:all:customer-invoices:id-response ');
        console.log(response);
        // debugger;
        if (response.meta.id === customerId) {
          setData(response.data);
        }
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
  const [data2, setData2] = useState(['chocolate', 'strawberry', null]);

  return (
    <div className="">
      {/* <DataSheetGrid
        className=""
        style={{ height: '400px' }}
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
      /> */}
      <DataSheetGrid
        value={data2}
        onChange={setData2}
        columns={[
          {
            component: Select,
            title: 'Flavor',
          },
        ]}
      />
      <center>
        Customer ID : {customerId} | Type : {type}
      </center>
      <FloatButton.Group
        trigger="hover"
        type="primary"
        shape="circle"
        style={{ right: 30, bottom: 15 }}
        icon={<EditOutlined />}
      >
        <FloatButton tooltip="Undo" onClick={cancel} icon={<UndoOutlined />} />
        <FloatButton
          tooltip="Print"
          onClick={print}
          icon={<FilePdfOutlined />}
        />
        <FloatButton
          tooltip={`Save ${customerId}`}
          onClick={commit}
          icon={<SaveOutlined />}
        />
      </FloatButton.Group>
    </div>
  );
}

export default CustomerEditGrid;
