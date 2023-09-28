import React, { useState, useEffect } from 'react';
import { Col, Row, Space, Table, Tag, Button, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { nanoid } from 'nanoid';

interface DataType {
  id: string;
  name: string;
}

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const PackingType: React.FC = () => {
  const [allRecords, setAllRecords] = useState<DataType[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataType>({
    id: '',
    name: '',
  });

  // antd table - start
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button type="primary" onClick={() => deleteProduct(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // antd table - end

  // antd form - start

  const [form] = Form.useForm();

  const onFinish = (item: any) => {
    console.log(item);
    console.log('%c Going to call createPackingType', 'color: tomato');
    console.log({ item });

    if (item.id === undefined || item.id === '') {
      item.id = nanoid();

      window.electron.ipcRenderer.createPackingType(item);

      window.electron.ipcRenderer.on('create:packing_type', (responseData) => {
        console.log('create:packing_type event response');
        console.log({ responseData });
        console.log('Going to call getAllPackingTypes from createPackingType');
      });
    } else {
      window.electron.ipcRenderer.updatePackingType(item);

      window.electron.ipcRenderer.on('update:packing_type', (responseData) => {
        console.log('update:packing_type event response');
        console.log({ responseData });
        console.log('Going to call updatePackingType from update:packing_type');
      });
    }

    getAllPackingTypes();
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      id: '',
      name: 'sample',
    });
  };

  const onEdit = (item: any) => {
    form.setFieldsValue({
      id: item.id,
      name: item.name,
    });
  };

  // antd form - end

  useEffect(() => {
    getAllPackingTypes();
  }, []);

  const handleSelectedItem = (item) => {
    console.log(item);
    setSelectedItem(item);
  };
  const handleInput = (event: Event) => {
    const name: String = event.target.name;
    const value: String = event.target.value;
    setSelectedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNew = () => {
    setSelectedItem({
      id: 0,
      name: '',
    });
  };

  const createPackingType = (item) => {
    console.log('Going to call createPackingType');
    console.log({ item });
    window.electron.ipcRenderer.createPackingType(item);

    window.electron.ipcRenderer.on('create:product_name', (responseData) => {
      console.log('create:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllPackingTypes from createPackingType');
      // getAllPackingTypes();
    });
  };

  const updatePackingType = (item) => {
    console.log('Going to call updatePackingType');
    console.log({ item });
    window.electron.ipcRenderer.updatePackingType(item);

    window.electron.ipcRenderer.on('update:product_name', (responseData) => {
      console.log('update:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllPackingTypes from updatePackingType');
      getAllPackingTypes();
    });
  };

  const deleteProduct = (id: any) => {
    console.log('Going to call deletePackingType');
    console.log(id);
    window.electron.ipcRenderer.deletePackingType(id);

    window.electron.ipcRenderer.on('delete:product_name', (responseData) => {
      console.log('delete:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllPackingTypes from deletePackingType');
    });
    getAllPackingTypes();
  };

  const getAllPackingTypes = () => {
    console.log('Going to call getAllPackingTypes');
    window.electron.ipcRenderer.getAllPackingTypes();

    window.electron.ipcRenderer.on('get:packing_types', (responseData) => {
      console.log('get:packing_types event response');
      console.log({ responseData });
      setAllRecords(responseData);
    });
  };

  return (
    <>
      <Row>
        <Col span={12}>
          <Table columns={columns} dataSource={allRecords} />
        </Col>
        <Col span={12}>
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <Form.Item name="id" label="ID" rules={[{ required: false }]}>
              <Input readOnly />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
              <Button type="link" htmlType="button" onClick={onFill}>
                Fill form
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>

    // <div className="container p-4">
    //   <div className="row">
    //     <div className="twelve columns">
    //       <h1>Product Name</h1>
    //     </div>
    //   </div>
    //   <div className="row">
    //     <div className="eight columns">
    //       <table className="u-full-width">
    //         <thead>
    //           <tr>
    //             <th>ID</th>
    //             <th>Name</th>
    //             <th>Edit</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {allRecords.map((record) => {
    //             return (
    //               <tr key={record.id}>
    //                 <td>{record.id}</td>
    //                 <td>{record.name}</td>
    //                 <td>
    //                   <button
    //                     className={`${
    //                       selectedItem.id === record.id ? 'button-primary' : ' '
    //                     }`}
    //                     onClick={() => handleSelectedItem(record)}
    //                   >
    //                     Edit
    //                   </button>
    //                 </td>
    //               </tr>
    //             );
    //           })}
    //         </tbody>
    //       </table>
    //     </div>
    //     <div className="four columns">
    //       <div className="row">
    //         <div className="twelve columns">
    //           <label htmlFor="date_created">ID</label>
    //           <input
    //             readOnly
    //             value={selectedItem.id}
    //             type="text"
    //             className="u-full-width is-disabled in-active"
    //             name="id"
    //           />
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="twelve columns">
    //           <label htmlFor="name">Name</label>
    //           <input
    //             type="text"
    //             className="u-full-width"
    //             name="name"
    //             value={selectedItem.name}
    //             onChange={(event) => {
    //               return handleInput(event);
    //             }}
    //           />
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="twelve columns">
    //           <label htmlFor="date_created">Date Created</label>
    //           <input
    //             readOnly
    //             value={selectedItem.date_created}
    //             type="text"
    //             className="u-full-width is-disabled in-active"
    //             name="date_created"
    //           />
    //         </div>
    //       </div>
    //       <div className="row">
    //         <div className="four columns">
    //           <button
    //             className="button-primary"
    //             onClick={() => addNew()}
    //             disabled={selectedItem.name === ''}
    //           >
    //             Create
    //           </button>
    //         </div>
    //       </div>
    //       {selectedItem.id !== '' && (
    //         <div className="row">
    //           <div className="four columns">
    //             <button
    //               className={`button-primary ${
    //                 selectedItem.name === '' ? 'is-disabled' : ''
    //               }`}
    //               onClick={() => updatePackingType(selectedItem)}
    //               disabled={selectedItem.name === '' ? true : false}
    //             >
    //               Update
    //             </button>
    //           </div>
    //         </div>
    //       )}
    //       {selectedItem.id === '' && (
    //         <div className="row">
    //           <div className="four columns">
    //             <button
    //               className={`button-primary ${
    //                 selectedItem.name === '' ? 'is-disabled' : ''
    //               }`}
    //               onClick={() => createPackingType(selectedItem)}
    //               disabled={selectedItem.name === '' ? true : false}
    //             >
    //               Save
    //             </button>
    //           </div>
    //         </div>
    //       )}

    //       <div className="row">
    //         <div className="four columns">
    //           <button
    //             className={`button-primary ${
    //               selectedItem.id === '' ? 'is-disabled' : ''
    //             }`}
    //             disabled={selectedItem.id === '' ? true : false}
    //             onClick={() => deletePackingType(selectedItem.id)}
    //           >
    //             Delete
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export { PackingType };
