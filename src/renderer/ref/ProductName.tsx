import { Button, Col, Form, Input, Row, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';

interface DataType {
  id: string;
  name: string;
  price: number;
  tags: string;
  desc: string;
}

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ProductName: React.FC = () => {
  const [allRecords, setAllRecords] = useState<DataType[]>([]);
  const [selectedItem, setSelectedItem] = useState<DataType>({
    id: '',
    name: '',
    price: 0,
    tags: '',
    desc: '',
  });
  const getAllProductNames = () => {
    console.log('Going to call getAllProductNames');
    window.electron.ipcRenderer.getAllProductNames();

    window.electron.ipcRenderer.on('get:product_names', (responseData) => {
      console.log('get:product_names event response');
      console.log({ responseData });
      setAllRecords(responseData);
    });
  };
  // antd table - start
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      // render: (_, { tags }) => (
      //   <>
      //     {tags.map((tag) => {
      //       let color = tag.length > 5 ? 'geekblue' : 'green';
      //       if (tag === 'loser') {
      //         color = 'volcano';
      //       }
      //       return (
      //         <Tag color={color} key={tag}>
      //           {tag.toUpperCase()}
      //         </Tag>
      //       );
      //     })}
      //   </>
      // ),
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
    console.log('%c Going to call createProductName', 'color: tomato');
    console.log({ item });

    if (item.id === undefined || item.id === '') {
      item.id = nanoid();
      if (item.desc === undefined) item.desc = '';
      if (item.tags === undefined) item.tags = '';

      window.electron.ipcRenderer.createProductName(item);

      window.electron.ipcRenderer.on('create:product_name', (responseData) => {
        console.log('create:product_name event response');
        console.log({ responseData });
        console.log('Going to call getAllProductNames from createProductName');
      });
    } else {
      if (item.desc === undefined) item.desc = '';
      if (item.tags === undefined) item.tags = '';
      window.electron.ipcRenderer.updateProductName(item);

      window.electron.ipcRenderer.on('update:product_name', (responseData) => {
        console.log('update:product_name event response');
        console.log({ responseData });
        console.log('Going to call updateProductName from update:product_name');
      });
    }

    getAllProductNames();
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({
      id: '',
      name: 'sample',
      price: 0,
      tags: 'sample',
      desc: 'sample desc',
    });
  };

  const onEdit = (item: any) => {
    form.setFieldsValue({
      id: item.id,
      name: item.name,
      price: item.price,
      tags: item.tags,
      desc: item.desc,
    });
  };

  // antd form - end

  useEffect(() => {
    getAllProductNames();
  }, []);

  const handleSelectedItem = (item) => {
    console.log(item);
    setSelectedItem(item);
  };
  const handleInput = (event: Event) => {
    const { name } = event.target;
    const { value } = event.target;
    setSelectedItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const addNew = () => {
    setSelectedItem({
      id: 0,
      name: '',
      price: 0,
      tags: [],
      desc: '',
    });
  };

  const createProductName = (item) => {
    console.log('Going to call createProductName');
    console.log({ item });
    window.electron.ipcRenderer.createProductName(item);

    window.electron.ipcRenderer.on('create:product_name', (responseData) => {
      console.log('create:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllProductNames from createProductName');
      // getAllProductNames();
    });
  };

  const updateProductName = (item) => {
    console.log('Going to call updateProductName');
    console.log({ item });
    window.electron.ipcRenderer.updateProductName(item);

    window.electron.ipcRenderer.on('update:product_name', (responseData) => {
      console.log('update:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllProductNames from updateProductName');
      getAllProductNames();
    });
  };

  const deleteProduct = (id: any) => {
    console.log('Going to call deleteProductName');
    console.log(id);
    window.electron.ipcRenderer.deleteProductName(id);

    window.electron.ipcRenderer.on('delete:product_name', (responseData) => {
      console.log('delete:product_name event response');
      console.log({ responseData });
      console.log('Going to call getAllProductNames from deleteProductName');
    });
    getAllProductNames();
  };

  return (
    <Row>
      <Col span={12}>
        <Table columns={columns} dataSource={allRecords} />
      </Col>
      <Col span={12}>
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item name="id" label="ID" rules={[{ required: false }]}>
            <Input readOnly />
          </Form.Item>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="desc"
            label="Description"
            rules={[{ required: false }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Tags" rules={[{ required: false }]}>
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
    //               onClick={() => updateProductName(selectedItem)}
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
    //               onClick={() => createProductName(selectedItem)}
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
    //             onClick={() => deleteProductName(selectedItem.id)}
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

export { ProductName };
