import {
  EditOutlined,
  FilePdfOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Descriptions, FloatButton, Row } from 'antd';
import { format } from 'date-fns';
import Fuse from 'fuse.js';
import jsPDF from 'jspdf';

import 'jspdf-autotable';
import React, {
  useCallback,
  useContext,
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
import appContext from '../../AppContext';
import { SOURCE, STATE, STATUS, TYPE } from '../../contants';

type Choice = {
  label: string;
  value: string;
};

type Row = {
  id: string | null;
  customer_id: string | null;
  source: string | null;
  state: string | null;
  date: string | null;
  product: string | null;
  payment: string | null;
  carton: number | null;
  qty_ctn: number | null;
  total_qty: number | null;
  rate_each: number | null;
  debit: number | null;
  credit: number | null;
  balance: number | null;
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

function CustomerEditGrid({ customerId, type, getCurrentStock }) {
  const context = useContext(appContext);

  const initialState = {
    id: '',
    customer_id: '',
    source: SOURCE.memory,
    state: STATE.created,
    date: format(new Date(), 'yyyy-MM-dd'),
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

  if (!context.currentProducts) {
    return null;
  }

  let productsToShow = [];
  let currentVendorProducts = {};

  if (type === TYPE.customer) {
    productsToShow = [...context.currentProducts];
    if (productsToShow.length > 0) {
      productsToShow.map((product) => {
        let name = product.label;

        currentVendorProducts[name] = product;
      });
    }
  } else if (type === TYPE.vendor) {
    productsToShow = context.currentProducts.filter(
      (product) => product.customer_id === customerId,
    );

    if (productsToShow.length > 0) {
      productsToShow.map((product) => {
        let name = product.label;

        currentVendorProducts[name] = product;
      });
    }
  }

  const columns: Column<Row>[] = [
    {
      ...keyColumn('date', isoDateColumn),
      title: 'Date',
      width: 100,
    },
    {
      ...keyColumn('payment', textColumn),
      title: 'Payment',
      width: 200,
    },
    {
      ...keyColumn(
        'product',
        selectColumn({
          choices: productsToShow,
        }),
      ),
      title: 'Product',
      width: 200,
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

  const [data, setData] = useState<Row[]>([
    //   // { ...initialState, id: uuidv4(), customer_id: customerId },
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
                const element = newValue[index];
                const { product } = element;
                console.log(currentVendorProducts);
                if (currentVendorProducts) {
                  const currentProduct = currentVendorProducts[product];

                  element.qty_ctn = currentProduct.qty_ctn;
                  element.total_qty = element.carton * currentProduct.qty_ctn;
                  element.debit = element.rate_each * element.total_qty;
                  // debugger;
                  // element.balance =
                  //   element.balance + element.debit - element.credit;

                  element.state = STATE.updated;
                  newValue[index] = element;
                }
              }
            }
          });
        }

        if (operation.type === 'DELETE') {
          let keptRows = 0;

          // Make sure to use `data` and not `newValue`
          const slicedData = data.slice(
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
              const ele = data[operation.fromRowIndex + i];
              ele.state = STATE.deleted;
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
    // console.log(createdRowIds);
    // console.log(deletedRowIds);
    // console.log(updatedRowIds);

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

    setData(withState);
    setPrevData(withState);
    if (type === TYPE.customer) {
      const newStock = {};
      withState.map((record) => {
        if (newStock[record.product]) {
          const currentStock = newStock[record.product];

          if (record.state === STATE.deleted) {
            // let carton = record.carton ? record.carton : 0;
            // currentStock.carton = currentStock.carton - carton;
            // let qty_ctn = record.qty_ctn ? record.qty_ctn : 0;
            // currentStock.qty_ctn = currentStock.qty_ctn - qty_ctn;
          } else {
            currentStock.carton += record.carton;
            currentStock.total_qty += record.total_qty;
          }
          newStock[record.product] = currentStock;
        } else if (record.state === STATE.deleted) {
          // let carton = record.carton ? record.carton : 0;
          // let qty_ctn = record.qty_ctn ? record.qty_ctn : 0;
          // let total_qty = record.total_qty ? record.total_qty : 0;

          const currentStock = {
            id: 'NEW',
            product: record.product,
            carton: 0,
            qty_ctn: 0,
            total_qty: 0,
          };

          newStock[record.product] = currentStock;
        } else {
          const currentStock = {
            id: 'NEW',
            product: record.product,
            carton: record.carton,
            qty_ctn: record.qty_ctn,
            total_qty: record.total_qty,
          };

          newStock[record.product] = currentStock;
        }
      });

      const currentCotextStock = {};

      if (context && context.currentStock) {
        context.currentStock.map((item) => {
          const { product } = item;
          currentCotextStock[product] = item;
        });
      }

      console.log(currentCotextStock);
      console.log(newStock);
      try {
        Object.keys(currentCotextStock).forEach(function (key, index) {
          if (newStock[key]) {
            const itemInCurrentStock = { ...currentCotextStock[key] };
            const itemInNewStock = { ...newStock[key] };
            const newCarton = itemInCurrentStock.carton - itemInNewStock.carton;
            const newTotalQty =
              itemInCurrentStock.total_qty - itemInNewStock.total_qty;
            itemInNewStock.carton = newCarton;
            itemInNewStock.total_qty = newTotalQty;
            itemInNewStock.id = itemInCurrentStock.id;

            newStock[key] = itemInNewStock;
          }
        });
      } catch (error) {
        console.error(error);
      }

      console.log(currentCotextStock);
      console.log(newStock);
      const updatedStock = [];

      Object.keys(newStock).forEach(function (key, index) {
        updatedStock.push(newStock[key]);
      });

      console.log(withState);
      console.log(newStock);

      console.log(updatedStock);

      window.electron.ipcRenderer.updateCustomerInvoice(withState);
      // window.electron.ipcRenderer.updateStock(updatedStock);

      createdRowIds.clear();
      deletedRowIds.clear();
      updatedRowIds.clear();
    }

    if (type === TYPE.vendor) {
      const newStock = {};

      withState.map((record) => {
        if (newStock[record.product]) {
          const currentStock = { ...newStock[record.product] };

          if (record.state === STATE.deleted) {
            // let carton = record.carton ? record.carton : 0;
            // currentStock.carton = currentStock.carton - carton;
            // let qty_ctn = record.qty_ctn ? record.qty_ctn : 0;
            // currentStock.qty_ctn = currentStock.qty_ctn - qty_ctn;
          } else {
            currentStock.carton += record.carton;
            currentStock.total_qty += record.total_qty;
          }
          newStock[record.product] = currentStock;
        } else if (record.state === STATE.deleted) {
          // let carton = record.carton ? record.carton : 0;
          // let qty_ctn = record.qty_ctn ? record.qty_ctn : 0;
          // let total_qty = record.total_qty ? record.total_qty : 0;

          const currentStock = {
            id: 'NEW',
            product: record.product,
            carton: 0,
            qty_ctn: 0,
            total_qty: 0,
          };

          newStock[record.product] = currentStock;
        } else {
          const currentStock = {
            id: 'NEW',
            product: record.product,
            carton: record.carton,
            qty_ctn: record.qty_ctn,
            total_qty: record.total_qty,
          };

          newStock[record.product] = currentStock;
        }
      });

      const currentCotextStock = {};

      if (context && context.currentStock) {
        context.currentStock.map((item) => {
          const { product } = item;
          currentCotextStock[product] = item;
        });
      }

      console.log(currentCotextStock);
      console.log(newStock);
      Object.keys(currentCotextStock).forEach(function (key, index) {
        if (newStock[key]) {
          newStock[key].id = currentCotextStock[key].id;
        }
      });

      console.log(currentCotextStock);
      console.log(newStock);
      const updatedStock = [];

      Object.keys(newStock).forEach(function (key, index) {
        updatedStock.push(newStock[key]);
      });

      console.log(withState);
      console.log(newStock);

      console.log(updatedStock);

      window.electron.ipcRenderer.updateCustomerInvoice(withState);
      // window.electron.ipcRenderer.updateStock(updatedStock);

      createdRowIds.clear();
      deletedRowIds.clear();
      updatedRowIds.clear();
    }

    //  const isInCurrentStock = currentStock.filter(stock=> stock.product === record.product);
    //  const isInNewStock = newStock.filter(stock=> stock.product === record.product);

    //   if(isInCurrentStock.length > 0 && isInNewStock.length === 0){
    //     const _stock = isInCurrentStock[0]

    //     let updatedStock = {
    //       id : _stock.id,
    //       product : _stock.product,
    //       carton : _stock.carton + record.carton,
    //       qty_ctn : _stock.qty_ctn,
    //       total_qty : _stock.total_qty + record.total_qty,
    //     }

    //     newStock.push(updatedStock)

    //   } else if(isInCurrentStock.length > 0 && isInNewStock.length > 0) {

    //     const _stock = isInNewStock[0]

    //     let updatedStock = {
    //       id : _stock.id,
    //       product : _stock.product,
    //       carton : _stock.carton + record.carton,
    //       qty_ctn : _stock.qty_ctn,
    //       total_qty : _stock.total_qty + record.total_qty,
    //     }

    //     newStock.push(updatedStock)
    //   }
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

  // IPC Main listeners Customer Invoice
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

  window.electron.ipcRenderer.on('update:customer-invoice', (response) => {
    console.log('update:customer-invoice reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:customer-invoice ');
      console.log(response);

      getAllRecordsById(customerId);
    }
  });

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
        // ;
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

  // IPC Main listeners Stock
  window.electron.ipcRenderer.on('update:stock-response', (response) => {
    console.log('update:stock-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:stock-response ');
      console.log(response);
      getCurrentStock();
      // setTimeout(() =>
      // , 500);
    }
  });

  return (
    <div className="">
      <DataSheetGrid
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
