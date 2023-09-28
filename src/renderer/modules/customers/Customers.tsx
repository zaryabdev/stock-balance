import { SearchOutlined } from '@ant-design/icons';
import { Avatar, Col, Descriptions, Input, Row, Space } from 'antd';
import Fuse from 'fuse.js';
import { nanoid } from 'nanoid';
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
  createTextColumn,
  intColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';
import CustomerList from './CustomerList';

const PACKINTYPES = [];
const PRODUCTNAMES = [];

//  <DataSheetGrid
//         disableExpandSelection
//         value={data}
//         height={500}
//         onChange={(newValue, operations) =>
//           onColumnChange(newValue, operations)
//         }
//         columns={columns}
//       />

function Customers() {
  const [data, setData] = useState([{}, {}, {}]);

  const getAllPackingTypes = () => {
    console.log('Going to call getAllPackingTypes');
    window.electron.ipcRenderer.getAllPackingTypes();

    window.electron.ipcRenderer.on('get:packing_types', (responseData) => {
      console.log('get:packing_types event response');
      console.log('Indide Grid');
      console.log({ responseData });
      for (let i = 0; i < responseData.length; i++) {
        PACKINTYPES.push(responseData[i].name);
      }
    });
  };

  // const getAllProductNames = () => {
  //   console.log('Going to call getAllProductNames');
  //   window.electron.ipcRenderer.getAllProductNames();

  //   window.electron.ipcRenderer.on('get:product_names', (responseData) => {
  //     console.log('get:product_names event response');
  //     console.log('Indide Grid');
  //     console.log({ responseData });
  //     for (let i = 0; i < responseData.length; i++) {
  //       PRODUCTNAMES.push(responseData[i].name);
  //     }
  //   });
  // };

  function genId() {
    console.log(nanoid());
    // return genId();
  }

  useEffect(() => {
    getAllPackingTypes();
    // getAllProductNames();
  }, []);

  useEffect(() => {
    // console.log(`final data`);
    // console.log(data);
  }, [data]);
  function onColumnChange(newValue, operations) {
    for (const operation of operations) {
      // console.log(`operations`);
      // console.log(operation);
    }
    setData(newValue);
  }

  const columns = [
    {
      ...keyColumn('quantity', intColumn),
      title: 'Quantity',
    },
    {
      component: PackingAutoFill,
      keepFocus: true,
      title: 'Packing Type',
      onColumnChange,
    },
    {
      component: NameAutoFill,
      keepFocus: true,
      title: 'Product Name',
      onColumnChange,
    },
    {
      ...keyColumn('price', intColumn),
      title: 'Price',
    },
    {
      ...keyColumn('total', intColumn),
      disabled: true,
      title: 'Total Ammount',
    },
  ];

  return (
    <Row gutter={[8, 8]}>
      <Col span={4}>
        <CustomerSearch />
        <CustomerList />
      </Col>
      <Col span={20} />
    </Row>
  );
}

function CustomerSearch(params: type) {
  return (
    <div>
      <Input placeholder="Search cutomer" iconRender={<SearchOutlined />} />
    </div>
  );
}

function PackingAutoFill({
  focus,
  active,
  stopEditing,
  rowData,
  setRowData,
  onColumnChange,
}) {
  const [showInput, setShowinput] = useState(true);
  const [text, setText] = useState('');

  const ref = useRef();

  useEffect(() => {
    if (active) {
      setShowinput(true);
      ref.current.focus();
    } else {
      setShowinput(false);
    }
    // if (focus) setShowinput(true);
  }, [focus, active]);

  function handleInput(e) {
    // const TYPE = ['DOZEN', 'PACKET', 'CARD', 'DABA', 'GURS', 'PIECE'];
    const TYPE = PACKINTYPES;

    const options = {
      includeScore: true,
    };

    const { value } = e.target;

    const fuse = new Fuse(TYPE, options);

    const result = fuse.search(value);
    console.log(`result`);
    console.log(result);

    if (result.length > 0) {
      // console.log(`From Auto Fil`);
      // console.log(rowData);
      // console.log(onColumnChange);
      rowData.package_type = result[0].item;
      console.log(result[0].item);
      setText(result[0].item);
    }
  }

  return (
    <>
      <input
        style={{
          display: showInput ? 'block' : 'none',
          borderColor: 'white',
        }}
        ref={ref}
        type="text"
        onChange={(e) => handleInput(e)}
      />
      <div style={{ display: !showInput ? 'block' : 'none' }}>{text}</div>
    </>
  );
}
function NameAutoFill({
  focus,
  active,
  stopEditing,
  rowData,
  setRowData,
  onColumnChange,
}) {
  const [showInput, setShowinput] = useState(true);
  const [text, setText] = useState('');

  const ref = useRef();

  useEffect(() => {
    if (active) {
      setShowinput(true);
      ref.current.focus();
    } else {
      setShowinput(false);
    }
    // if (focus) setShowinput(true);
  }, [focus, active]);

  function handleInput(e) {
    // const ITEMS = [
    //   'CHORI',
    //   'METAL CHUTKI',
    //   'SET',
    //   'HAIR BAND',
    //   'PONI',
    //   'PIN',
    //   'GALA PATI',
    //   'MALA',
    //   'TOPAS',
    //   'RING',
    //   'KANTA',
    //   'KARA',
    //   'BINDIA',
    //   'CHAIN',
    //   'CLIP',
    //   'BALI',
    //   'BRACLET',
    //   'LOKIT CHAIN',
    //   'DORI',
    //   'MATHA PATI',
    //   'HAIR BAND',
    //   'TAWAL PONI',
    //   'PONI GIFT',
    //   'PIN',
    // ];

    const ITEMS = PRODUCTNAMES;

    const options = {
      includeScore: true,
      minMatchCharLength: 1,
      threshold: 0.5,
    };

    const { value } = e.target;

    const fuse = new Fuse(ITEMS, options);

    const result = fuse.search(value);
    console.log(`result`);
    console.table(result);

    if (result.length > 0) {
      // console.log(`From Auto Fil`);
      // console.log(rowData);
      // console.log(onColumnChange);
      rowData.name = result[0].item;
      // console.log(result[0].item);
      setText(result[0].item);
    }
  }

  return (
    <>
      <input
        style={{
          display: showInput ? 'block' : 'none',
          borderColor: 'white',
        }}
        ref={ref}
        type="text"
        onChange={(e) => handleInput(e)}
      />
      <div style={{ display: !showInput ? 'block' : 'none' }}>{text}</div>
    </>
  );
}
export default Customers;
