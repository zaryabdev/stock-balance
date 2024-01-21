import {
  EditOutlined,
  FilePdfOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import {
  Avatar,
  Col,
  DatePicker,
  Descriptions,
  FloatButton,
  Modal,
  Row,
} from 'antd';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Fuse from 'fuse.js';
import jsPDF from 'jspdf';

// import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
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
  DataSheetGridRef,
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
import { RECORD_TYPE, SOURCE, STATE, STATUS, TYPE } from '../../contants';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;

type Choice = {
  label: string;
  value: string;
};

type Row = {
  id: string;
  customer_id: string;
  source: string;
  state: string;
  date: string;
  product: string;
  payment: string;
  carton: number;
  qty_ctn: number;
  total_qty: number;
  rate_each: number;
  debit: number;
  credit: number;
  balance: number;
  current_balance: number;
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
        menuPlacement="top"
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

const dateFormat = 'YYYY-MM-DD';

function CustomerEditGrid({ customerId, type, getCurrentStock }) {
  const context = useContext(appContext);
  const formatedDate = format(new Date(), 'yyyy-MM-dd');
  const currentDate = dayjs(formatedDate, 'YYYY-MM-DD');
  const [currentBalance, setCurrentBalance] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printDate, setPrintDate] = useState([currentDate, currentDate]);
  const datasheetGridRef = useRef<DataSheetGridRef>(null);

  const [data, setData] = useState<Row[]>([
    //   // { ...initialState, id: uuidv4(), customer_id: customerId },
  ]);

  const [minMaxRecordDates, setMinMaxRecordDates] = useState({
    minDate: '',
    maxDate: '',
  });
  const [prevData, setPrevData] = useState(data);

  const initialState = {
    id: '',
    customer_id: '',
    source: SOURCE.memory,
    state: STATE.created,
    date: formatedDate,
    product: '',
    payment: '',
    carton: 0,
    qty_ctn: 0,
    total_qty: 0,
    rate_each: 0,
    debit: 0,
    credit: 0,
    balance: 0,
    current_balance: 0,
  };

  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!hasScrolled.current) {
      const container = document.querySelector('.dsg-container');

      if (data.length > 0 && container) {
        const scrollPixels = data.length * 50;

        container.scrollTo({ behavior: 'smooth', top: scrollPixels });
        hasScrolled.current = true;
      }
    }
  }, [data]);

  useEffect(() => {
    getAllRecordsById(customerId);
  }, [customerId]);

  if (!context.currentProducts) {
    return null;
  }

  const showPrintModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    print();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setPrintDate(date);
  };

  const disabledDate = (current) => {
    if (current) {
      const between = current.isBetween(
        minMaxRecordDates.minDate,
        minMaxRecordDates.maxDate,
        'day',
        '[]',
      );

      return !between;
    }

    return false;
  };

  let productsToShow = [
    {
      customer_id: '',
      id: '',
      label: 'Payment',
      qty_ctn: 0,
      status: 'NONE',
      value: RECORD_TYPE.none,
    },
  ];

  if (type === TYPE.customer || type === TYPE.vendor) {
    productsToShow.push({
      customer_id: '',
      id: '',
      label: 'Previous Balance',
      qty_ctn: 0,
      status: 'NONE',
      value: RECORD_TYPE.previous_balance,
    });
  } else {
  }

  const currentVendorProducts = {};

  if (type === TYPE.customer || type === TYPE.walkingCustomer) {
    productsToShow = [...productsToShow, ...context.currentProducts];
    if (productsToShow.length > 0) {
      productsToShow.map((product) => {
        const { value } = product;
        if (
          value !== RECORD_TYPE.previous_balance &&
          value !== RECORD_TYPE.none
        ) {
          currentVendorProducts[value] = product;
        }
      });
    }
  } else if (type === TYPE.vendor) {
    const _productsToShow = context.currentProducts.filter(
      (product) => product.customer_id === customerId,
    );

    productsToShow = [...productsToShow, ..._productsToShow];

    if (productsToShow.length > 0) {
      productsToShow.map((product) => {
        const { value } = product;

        if (
          value !== RECORD_TYPE.previous_balance &&
          value !== RECORD_TYPE.none
        ) {
          currentVendorProducts[value] = product;
        }
      });
    }
  }

  const balanceSheetColumn: Column<Row>[] = [
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
    //   ...keyColumn('current_balance', floatColumn),
    //   title: 'Current Balance',
    // },
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

  const invoiceColumn: Column<Row>[] = [
    {
      ...keyColumn(
        'product',
        selectColumn({
          choices: productsToShow,
        }),
      ),
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
    // {
    //   ...keyColumn('current_balance', floatColumn),
    //   title: 'Current Balance',
    // },
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

  const createdRowIds = useMemo(() => new Set(), []);
  const deletedRowIds = useMemo(() => new Set(), []);
  const updatedRowIds = useMemo(() => new Set(), []);

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
            newValue.length,
          );

          updatedArray.forEach(({ id }) => {
            console.log(!createdRowIds.has(id) && !deletedRowIds.has(id));
            if (!createdRowIds.has(id) && !deletedRowIds.has(id)) {
              updatedRowIds.add(id);
            }

            for (let index = 0; index < newValue.length; index++) {
              if (newValue[index].id === id) {
                const currentRecord = newValue[index];
                const { product } = currentRecord;
                console.log(currentVendorProducts);
                if (currentVendorProducts) {
                  const currentProduct = currentVendorProducts[product];
                  if (currentProduct) {
                    if (product === RECORD_TYPE.previous_balance) {
                      currentRecord.payment = RECORD_TYPE.previous_balance;
                      currentRecord.qty_ctn = 0;
                      currentRecord.carton = 0;
                      currentRecord.total_qty = 0;
                      currentRecord.rate_each = 0;
                      currentRecord.credit = 0;
                      currentRecord.balance = currentRecord.debit;
                      currentRecord.state = STATE.updated;
                    } else if (product === RECORD_TYPE.none) {
                      // currentRecord.payment = RECORD_TYPE;
                      currentRecord.qty_ctn = 0;
                      currentRecord.carton = 0;
                      currentRecord.total_qty = 0;
                      currentRecord.rate_each = 0;
                      currentRecord.debit = 0;
                      currentRecord.balance = currentRecord.credit;
                      currentRecord.state = STATE.updated;
                    } else {
                      currentRecord.payment = RECORD_TYPE.none;
                      currentRecord.qty_ctn = currentProduct.qty_ctn;
                      currentRecord.total_qty =
                        currentRecord.carton * currentProduct.qty_ctn;
                      currentRecord.debit =
                        currentRecord.rate_each * currentRecord.total_qty;

                      currentRecord.balance = currentRecord.debit;
                      //   element.balance + element.debit - element.credit;

                      currentRecord.state = STATE.updated;
                    }
                    newValue[index] = currentRecord;
                  } else {
                    // currentRecord.payment = RECORD_TYPE.none;
                    // currentRecord.qty_ctn = 0;
                    // currentRecord.carton = 0;
                    // currentRecord.total_qty = 0;
                    // currentRecord.rate_each = 0;
                    // currentRecord.credit = 0;
                    // currentRecord.balance = currentRecord.debit;
                    // currentRecord.state = STATE.updated;
                    // newValue[index] = currentRecord;
                    // test use cases for deleted records
                  }
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

      let _balance = 0;

      const withBalance = newValue.map((item, index) => {
        if (item.product === RECORD_TYPE.previous_balance) {
          item.balance = item.debit;
          _balance += item.balance;
        } else if (item.product === RECORD_TYPE.none) {
          item.balance = _balance - item.credit;
          _balance -= item.credit;
        } else {
          item.balance = _balance + item.debit;
          _balance += item.debit;
        }

        return item;
      });

      setCurrentBalance(_balance);
      setData(withBalance);
    }
  }

  const validateData = (data) => {
    const invalidRows = [];

    data.map((item, index) => {
      const {
        date,
        product,
        carton,
        qty_ctn,
        total_qty,
        rate_each,
        debit,
        credit,
        balance,
        current_balance,
      } = item;

      let msg = '';
      let valid = true;

      if (!date || date === 'null') {
        msg += 'Date, ';
        valid = false;
      }

      // if (!product || product === 'null') {
      //   ;
      //   msg += 'product, ';
      //   valid = false;
      // }

      if (!carton || carton === 'null') {
        if (carton !== 0) {
          msg += 'Carton, ';
          valid = false;
        }
      }

      if (!qty_ctn || qty_ctn === 'null') {
        if (qty_ctn !== 0) {
          msg += 'Qty / Ctn, ';
          valid = false;
        }
      }

      if (!total_qty || total_qty === 'null') {
        if (total_qty !== 0) {
          msg += 'Total Qty, ';
          valid = false;
        }
      }

      if (!rate_each || rate_each === 'null') {
        if (rate_each !== 0) {
          msg += 'Rate Each, ';
          valid = false;
        }
      }

      if (!debit) {
        if (debit !== 0 || debit === 'null') {
          msg += 'Debit, ';
          valid = false;
        }
      }

      if (!credit || credit === 'null') {
        if (credit !== 0) {
          msg += 'Credit, ';
          valid = false;
        }
      }

      if (!current_balance || current_balance === 'null') {
        if (current_balance !== 0) {
          msg += 'Balance, ';
          valid = false;
        }
      }

      if (!valid) {
        invalidRows.push({
          rowId: index,
          message: msg,
          record: item,
        });
      }
    });

    const validation = {
      isValid: true,
      message: '',
      invalidRows: [],
    };

    if (invalidRows.length > 0) {
      validation.isValid = false;
      validation.invalidRows = invalidRows;
      validation.message = 'Invalid Data';
    }

    return validation;
  };

  const commit = () => {
    /* Perform insert, update, and delete to the database here */

    // const newData = data.filter(({ id }) => !deletedRowIds.has(id));

    // console.log(newData);
    // console.log(createdRowIds);
    // console.log(deletedRowIds);
    // console.log(updatedRowIds);

    const validation = validateData(data);
    if (validation.isValid) {
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

      if (type === TYPE.customer || type === TYPE.walkingCustomer) {
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
              const newCarton =
                itemInCurrentStock.carton - itemInNewStock.carton;
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

        const withFinalBalance = withState.map((item, index) => {
          item.current_balance = currentBalance;

          return item;
        });
        window.electron.ipcRenderer.updateCustomerInvoice(withFinalBalance);
        // window.electron.ipcRenderer.updateStock(updatedStock);
        // window.electron.ipcRenderer.createBalance({
        //   id : uuidv4(),
        //   customer_id : customerId,
        //   balance : currentBalance
        // });

        createdRowIds.clear();
        deletedRowIds.clear();
        updatedRowIds.clear();
        context.success('Invoice Saved Successfully.');
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

        const withFinalBalance = withState.map((item, index) => {
          item.current_balance = currentBalance;

          return item;
        });
        window.electron.ipcRenderer.updateCustomerInvoice(withFinalBalance);
        // window.electron.ipcRenderer.updateStock(updatedStock);

        createdRowIds.clear();
        deletedRowIds.clear();
        updatedRowIds.clear();
        context.success('Invoice Saved Successfully.');
      }
    } else {
      console.log(validation);

      let name = '';

      if (context.customersList) {
        context.customersList.map((c) => {
          if (c.id === customerId) {
            name = c.name;
          }
        });
      }

      validation.invalidRows.map((row) => {
        context.error(
          `Invalid fields ${row.message} of ${name} at Id ${row.rowId + 1}.`,
        );
      });
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
    const doc = new jsPDF({
      format: 'a4',
      orientation: 'landscape',
      unit: 'mm',
    });

    let name = '';

    if (context.customersList) {
      context.customersList.map((c) => {
        if (c.id === customerId) {
          name = c.name;
        }
      });
    }

    // Header
    autoTable(doc, {
      body: [
        [
          {
            content: 'Al Faisal Packages',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff',
            },
          },
          {
            content: 'Balance Sheet',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#ffffff',
            },
          },
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#393E46',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: `Billed to:\n${name}\n`,
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              `\nDate : ${formatedDate}\nTelephone : 042-7112172\nCell Phone : 0300-9409063\n0328-3700010` +
              `Address : G#29 , 7 Star Plaza Abkari Road, New Anarkali, Lahore.`,

            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

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
    const startDate = dayjs(printDate[0]).format('YYYY-MM-DD');
    const endDate = dayjs(printDate[1]).format('YYYY-MM-DD');

    const filteredData = data.filter((item) => {
      // dayjs('2010-10-20').isBetween('2010-10-19', dayjs('2010-10-25'), 'year');

      const _date = item.date;
      if (dayjs(_date).isBetween(startDate, endDate, 'day', '[]')) {
        return true;
      }
    });

    // let filteredData = data;

    filteredData.forEach((record) => {
      const rate_each = record.rate_each.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const debit = record.debit.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const credit = record.credit.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const balance = record.balance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      const inArr = [
        record.date,
        record.payment,
        record.product,
        record.carton,
        record.qty_ctn,
        record.total_qty,
        rate_each,
        debit,
        credit,
        balance,
      ];
      // push each tickcet's info into a row
      tableRows.push(inArr);
    });

    // doc.text(`Customer's Name : ${name}`, 20, 20);

    // doc.autoTable(tableColumn, tableRows, { startY: 30 });
    autoTable(doc, {
      head: [[...tableColumn]],
      showHead: 'everyPage',
      body: tableRows,
      theme: 'striped',
      styles: { overflow: 'linebreak', cellWidth: 'wrap', halign: 'right' },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'left' },
        2: { halign: 'left' },
      },

      headStyles: {
        fillColor: '#606470',
        halign: 'left',
      },
    });

    // autoTable(doc, {
    //   body: [
    //     [
    //       {
    //         content: 'Subtotal:',
    //         styles: {
    //           halign: 'right',
    //         },
    //       },
    //       {
    //         content: '$3600',
    //         styles: {
    //           halign: 'right',
    //         },
    //       },
    //     ],
    //     [
    //       {
    //         content: 'Total tax:',
    //         styles: {
    //           halign: 'right',
    //         },
    //       },
    //       {
    //         content: '$400',
    //         styles: {
    //           halign: 'right',
    //         },
    //       },
    //     ],
    //     [
    //       {
    //         content: 'Total amount:',
    //         styles: {
    //           halign: 'right',
    //         },
    //       },
    //       {
    //         content: '$4000',
    //         styles: {
    //           halign: 'right',
    //         },
    //       },
    //     ],
    //   ],
    //   theme: 'plain',
    // });

    // const uuid = uuidv4();

    const docTitle =
      startDate === endDate
        ? `${startDate}-${name}.pdf`
        : `${startDate}-${endDate}-${name}.pdf`;

    doc.save(docTitle);
    // doc.save(`${uuid} invoice`);
  };

  // IPC Main listeners Customer Invoice
  window.electron.ipcRenderer.on(
    'create:customer-invoice-response',
    (response) => {
      console.log('create:customer-invoice-response reponse came back');
      // console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of create:customer-invoice-response ');
        // console.log(response);
        // getAllCustomers({});
      }
    },
  );

  window.electron.ipcRenderer.on('update:customer-invoice', (response) => {
    console.log('update:customer-invoice reponse came back');
    // console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:customer-invoice ');
      // console.log(response);

      getAllRecordsById(customerId);
    }
  });

  window.electron.ipcRenderer.on(
    'get:all:customer-invoices:id-response',
    (response) => {
      console.log('get:all:customer-invoices:id-response reponse came back');
      // console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of get:all:customer-invoices:id-response ');
        // console.log(response);
        // ;
        if (response.meta.id === customerId) {
          const _data = response.data;
          let maxDate = '1947-08-14';
          let minDate = '3000-01-01';

          _data.map((item) => {
            if (dayjs(item.date).isSameOrBefore(maxDate)) {
              console.log('isSameOrBefore');
            } else {
              maxDate = item.date;
            }

            if (dayjs(item.date).isSameOrAfter(minDate)) {
              console.log('isSameOrAfter');
            } else {
              minDate = item.date;
            }
          });

          if (_data.length > 0) {
            setMinMaxRecordDates({ minDate, maxDate });

            // const formatedDate = format(maxDate, 'yyyy-MM-dd');

            const dateToSelectByDefault = dayjs(maxDate, 'YYYY-MM-DD');

            console.log([dateToSelectByDefault, dateToSelectByDefault]);
            setPrintDate([dateToSelectByDefault, dateToSelectByDefault]);
            setData(_data);
          }
        }
      }
    },
  );

  window.electron.ipcRenderer.on(
    'delete:customer-invoice-response',
    (response) => {
      console.log('delete:customer-invoice-response reponse came back');
      // console.log(response);

      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        // setSelectedRowKeys([]);
        console.log('response of delete:customer-invoice-response ');
        // console.log(response);

        if (response.status === STATUS.FAILED) {
          console.log(response.message);
        }

        if (response.status === STATUS.SUCCESS) {
          console.log('response of delete:customer-invoice-response  ');
          // console.log(response);
          // window.electron.ipcRenderer.getAllCustomers({});
        }
      }
    },
  );

  // IPC Main listeners Stock
  window.electron.ipcRenderer.on('update:stock-response', (response) => {
    console.log('update:stock-response reponse came back');
    // console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:stock-response ');
      // console.log(response);
      getCurrentStock();
      // setTimeout(() =>
      // , 500);
    }
  });

  return (
    <div className="">
      {/* <center>
        <code>{JSON.stringify(minMaxRecordDates)}</code>
      </center> */}
      <DataSheetGrid
        className=""
        ref={datasheetGridRef}
        // style={{ height: '400px' }}
        value={data}
        columns={
          type === TYPE.customer || type === TYPE.vendor
            ? balanceSheetColumn
            : invoiceColumn
        }
        createRow={() => ({
          ...initialState,
          id: uuidv4(),
          customer_id: customerId,
          current_balance: currentBalance,
        })}
        // duplicateRow={({ rowData }) => ({
        //   ...rowData,
        //   id: uuidv4(),
        // })}
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

      {/* <FloatButton tooltip="Undo" onClick={cancel} icon={<UndoOutlined />} /> */}

      <FloatButton
        // tooltip="Print"
        style={{ right: 55, bottom: 15 }}
        onClick={showPrintModal}
        icon={<FilePdfOutlined />}
      />
      <FloatButton
        // tooltip={`Save ${customerId}`}
        style={{ right: 15, bottom: 15 }}
        onClick={commit}
        type="primary"
        icon={<SaveOutlined />}
      />

      <Modal
        title="Print Reports"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <RangePicker
          defaultValue={printDate}
          format={dateFormat}
          onChange={onDateChange}
          disabledDate={disabledDate}
        />
      </Modal>
    </div>
  );
}

export default CustomerEditGrid;
