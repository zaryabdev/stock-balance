import {
  CustomerServiceOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleFilled,
  UserAddOutlined,
} from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Space,
  Table,
  Tabs,
  Typography,
} from 'antd';
import {
  default as React,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

import context from '../../AppContext';
import { STATUS, TYPE } from '../../contants';
import List from './List';
import MultiCustomersTabs from './MultiCustomersTabs';

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const options = [
  { label: 'Customers', value: TYPE.customer },
  { label: 'Venders', value: TYPE.vendor },
  { label: 'Customers & Vendors', value: TYPE.both },
];

const initialCustomerState = {
  id: '',
  key: '',
  name: '',
  phone: '',
  address: '',
  type: TYPE.customer,
};

function Customers({ getCurrentStock }) {
  const appContext = useContext(context);

  const [customersList, setCustomersList] = useState([]);
  const [filteredCustomersList, setFilteredCustomersList] = useState([]);
  const [selectedCutomer, setSelectedCutomer] = useState(initialCustomerState);
  const [selectedCutomersToLoad, setSelectedCutomersToLoad] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedOption, setSelectedOption] = useState(TYPE.customer);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [customerUUID, setCustomerUUID] = useState('NEW');

  const handleShowCreateModal = () => {
    setCustomerUUID(uuidv4());
    setOpenCreateModal(true);
  };

  const handleCreateModalOk = () => {
    let id = customerUUID;
    let name = form.getFieldValue('name');
    let address = form.getFieldValue('address');
    let phone = form.getFieldValue('phone');

    let data = {
      id,
      key: id,
      name,
      address,
      phone,
      type: selectedOption,
    };

    window.electron.ipcRenderer.createCustomer(data);

    form.resetFields();
    setOpenCreateModal(false);
  };

  const handleCreateModalCancel = () => {
    setOpenCreateModal(false);
    form.resetFields();
  };

  const handleShowEditModal = () => {
    setOpenEditModal(true);
  };
  const handleEditModalOk = () => {
    let id = selectedCutomer.id;
    let key = selectedCutomer.key;

    let name = form.getFieldValue('name');
    let address = form.getFieldValue('address');
    let phone = form.getFieldValue('phone');

    let data = {
      id,
      key,
      name,
      address,
      phone,
      typw: selectedOption,
    };

    window.electron.ipcRenderer.updateCustomer(data);

    form.resetFields();
    setOpenEditModal(false);
  };

  const handleEditModalCancel = () => {
    setOpenEditModal(false);
    form.resetFields();
  };

  const [form] = Form.useForm<{
    name: string;
    address: string;
    phone: string;
  }>();

  useEffect(() => {
    getAllCustomers({});
  }, []);

  useEffect(() => {
    if (selectedOption === TYPE.both) {
      setFilteredCustomersList(customersList);
    } else {
      const filteredList = customersList.filter(
        (item) => item.type === selectedOption,
      );
      setFilteredCustomersList(filteredList);
    }
  }, [selectedOption]);

  const handleSelectionChange = ({ target: { value } }: RadioChangeEvent) => {
    setSelectedOption(value);
  };

  // const createNewCustomer = () => {
  //   confirm({
  //     title: `Add New ${
  //       selectedOption === TYPE.customer ? 'Customer' : 'Vendor'
  //     }`,
  //     width: selectedOption === TYPE.vendor ? 1000 : 500,
  //     icon: <UserAddOutlined />,
  //     content: (
  //       <>
  //         {selectedOption === TYPE.customer ? (
  //           <CustomerForm
  //             form={form}
  //             initialValues={{
  //               name: '',
  //               address: '',
  //               phone: '',
  //               type: selectedOption,
  //             }}
  //           />
  //         ) : (
  //           <VendorForm
  //             form={form}
  //             initialValues={{
  //               name: '',
  //               address: '',
  //               phone: '',
  //               type: selectedOption,
  //             }}
  //           />
  //         )}
  //       </>
  //     ),
  //     onOk() {
  //       let id = uuidv4();
  //       let name = form.getFieldValue('name');
  //       let address = form.getFieldValue('address');
  //       let phone = form.getFieldValue('phone');

  //       let data = {
  //         id,
  //         key: id,
  //         name,
  //         address,
  //         phone,
  //         type: selectedOption,
  //       };

  //       window.electron.ipcRenderer.createCustomer(data);
  //       form.resetFields();
  //     },
  //     onCancel() {
  //       form.resetFields();
  //     },
  //   });
  // };

  // const editSelectedCustomer = () => {
  //   confirm({
  //     title: `Edit ${selectedOption === TYPE.customer ? 'Customer' : 'Vendor'}`,
  //     width: selectedOption === TYPE.vendor ? 1000 : 500,
  //     icon: <UserAddOutlined />,
  //     content: (
  //       <>
  //         {selectedOption === TYPE.customer ? (
  //           <CustomerForm
  //             form={form}
  //             initialValues={{
  //               name: selectedCutomer.name,
  //               address: selectedCutomer.address,
  //               phone: selectedCutomer.phone,
  //               type: selectedOption,
  //             }}
  //           />
  //         ) : (
  //           <VendorForm
  //             form={form}
  //             initialValues={{
  //               name: selectedCutomer.name,
  //               address: selectedCutomer.address,
  //               phone: selectedCutomer.phone,
  //               type: selectedOption,
  //             }}
  //           />
  //         )}
  //       </>
  //     ),
  //     onOk() {
  //       let id = selectedCutomer.id;
  //       let key = selectedCutomer.key;

  //       let name = form.getFieldValue('name');
  //       let address = form.getFieldValue('address');
  //       let phone = form.getFieldValue('phone');

  //       let data = {
  //         id,
  //         key,
  //         name,
  //         address,
  //         phone,
  //         typw: selectedOption,
  //       };

  //       window.electron.ipcRenderer.updateCustomer(data);
  //       form.resetFields();
  //     },
  //     onCancel() {
  //       form.resetFields();
  //     },
  //   });
  // };

  const loadSelectedCustomers = () => {
    setSelectedCutomersToLoad([...selectedRowKeys]);
  };

  const showDeleteConfirm = () => {
    confirm({
      title: `Are you sure delete ${
        selectedOption === TYPE.customer ? 'Customer' : 'Vendor'
      }`,
      icon: <ExclamationCircleFilled />,
      content: (
        <span>
          <code>{JSON.stringify(selectedRowKeys)}</code>
        </span>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        let data = [...selectedRowKeys];
        window.electron.ipcRenderer.deleteCustomers(data);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleSelectedRowKeys = (keys: any) => {
    console.log('Selected row keys');
    console.log(keys);

    if (keys.length === 0) {
      setSelectedCutomer(initialCustomerState);
    } else if (keys.length === 1) {
      const foundItem = customersList.find((c) => c.key === keys[0]);

      setSelectedCutomer(foundItem);
    } else {
      setSelectedCutomer(initialCustomerState);
    }

    setSelectedRowKeys(keys);
  };

  function getAllCustomers(params: type) {
    window.electron.ipcRenderer.getAllCustomers({});
  }

  window.electron.ipcRenderer.on('create:customer-response', (response) => {
    console.log('create:customer-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of create:customer-response ');
      console.log(response);
      getAllCustomers({});

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });
  window.electron.ipcRenderer.on('update:customer-response', (response) => {
    console.log('update:customer-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:customer-response ');
      console.log(response);
      getAllCustomers({});

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });

  window.electron.ipcRenderer.on('get:all:customers-response', (response) => {
    console.log('get:all:customers-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of get:all:customers-response ');
      console.log(response);

      const list = response.data;
      const filteredList = list.filter((item) => item.type === selectedOption);

      setCustomersList(list);
      setFilteredCustomersList(filteredList);

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });

  window.electron.ipcRenderer.on('delete:customers-response', (response) => {
    console.log('delete:customers-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      setSelectedRowKeys([]);
      console.log('response of delete:customers-response ');
      console.log(response);
      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of delete:customers-response  ');
        console.log(response);
        window.electron.ipcRenderer.getAllCustomers({});
      }

      // const newActiveKey = uuidv4();
      // const newPanes = [...tabs];
      // newPanes.push({
      //   label: 'New Tab',
      //   children: <CustomerEditGrid label={`Tab ID =  ${newActiveKey}`} />,
      //   key: newActiveKey,
      // });
      // setTabs(newPanes);
      // setActiveTabKey(newActiveKey);
    }
  });

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col
          className={`${
            appContext.toggleSideBar ? 'display-block' : 'visually-hidden'
          }`}
          span={6}
        >
          <div style={{ margin: 4 }}>
            <Radio.Group
              options={options}
              onChange={handleSelectionChange}
              value={selectedOption}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
          <>
            <div style={{ margin: 4 }}>
              <Button
                type="default"
                size="middle"
                style={{ margin: 2 }}
                // onClick={createNewCustomer}
                onClick={handleShowCreateModal}
                // loading={loading}
                disabled={
                  selectedRowKeys.length > 0 || selectedOption === TYPE.both
                }
              >
                Add
              </Button>
              <Button
                type="default"
                size="middle"
                style={{ margin: 2 }}
                // onClick={editSelectedCustomer}
                onClick={handleShowEditModal}
                // loading={loading}
                disabled={
                  selectedRowKeys.length === 0 || selectedRowKeys.length > 1
                }
              >
                Edit
              </Button>
              <Button
                type="default"
                size="middle"
                style={{ margin: 2 }}
                onClick={loadSelectedCustomers}
                // loading={loading}
                disabled={
                  selectedRowKeys.length < 1 || selectedOption === 'STOCK'
                }
              >
                Load
              </Button>
              <Button
                type="default"
                size="middle"
                style={{ margin: 2 }}
                onClick={showDeleteConfirm}
                // loading={loading}
                disabled={
                  selectedRowKeys.length < 1 || selectedOption === TYPE.both
                }
              >
                Delete
              </Button>
              <Button
                type="default"
                size="middle"
                style={{ margin: 2 }}
                onClick={() => appContext.setToggleSideBar((prev) => !prev)}
                // loading={loading}
                // disabled={}
              >
                Hide
              </Button>
            </div>
            <List
              data={filteredCustomersList}
              option={selectedOption}
              selectedRowKeys={selectedRowKeys}
              handleSelectedRowKeys={handleSelectedRowKeys}
            />
          </>
        </Col>
        <Col span={appContext.toggleSideBar ? 18 : 24}>
          <MultiCustomersTabs
            customersList={customersList}
            getCurrentStock={getCurrentStock}
            selectedCutomersToLoad={selectedCutomersToLoad}
          />
        </Col>
      </Row>
      <Modal
        open={openCreateModal}
        title={`${
          selectedOption === TYPE.customer ? 'Create Customer' : 'Create Vendor'
        } - ${customerUUID}`}
        width={selectedOption === TYPE.vendor ? 1000 : 500}
        onOk={handleCreateModalOk}
        onCancel={handleCreateModalCancel}
        // footer={(_, { OkBtn, CancelBtn }) => (
        //   <>
        //     <Button>Custom Button</Button>
        //     <CancelBtn />
        //     <OkBtn />
        //   </>
        // )}
      >
        <div>
          {selectedOption === TYPE.customer && (
            <CustomerForm
              form={form}
              initialValues={{
                name: '',
                address: '',
                phone: '',
                type: selectedOption,
              }}
            />
          )}
          {selectedOption === TYPE.vendor && (
            <div>
              <Tabs
                defaultActiveKey="DETAILS"
                centered
                items={[
                  {
                    label: 'Details',
                    children: (
                      <VendorForm
                        form={form}
                        initialValues={{
                          name: '',
                          address: '',
                          phone: '',
                          type: selectedOption,
                        }}
                      />
                    ),
                    key: 'DETAILS',
                    closable: false,
                  },
                  {
                    label: 'Products',
                    children: <Products />,
                    key: 'PRODUCTS',
                    closable: false,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </Modal>
      <Modal
        open={openEditModal}
        title="Edit"
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
        // footer={(_, { OkBtn, CancelBtn }) => (
        //   <>
        //     <Button>Custom Button</Button>
        //     <CancelBtn />
        //     <OkBtn />
        //   </>
        // )}
      >
        {selectedOption === TYPE.customer ? (
          <CustomerForm
            form={form}
            initialValues={{
              name: selectedCutomer.name,
              address: selectedCutomer.address,
              phone: selectedCutomer.phone,
              type: selectedOption,
            }}
          />
        ) : (
          <VendorForm
            form={form}
            initialValues={{
              name: selectedCutomer.name,
              address: selectedCutomer.address,
              phone: selectedCutomer.phone,
              type: selectedOption,
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function CustomerForm({ form, initialValues }) {
  form.setFieldValue('name', initialValues.name);
  form.setFieldValue('address', initialValues.address);
  form.setFieldValue('phone', initialValues.phone);

  const nameField = useRef(null);

  useEffect(() => {
    if (nameField && nameField.current) {
      nameField.current.focus();
    }
  }, [nameField]);

  return (
    <Form
      form={form}
      autoComplete="on"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      style={{ maxWidth: 800 }}
    >
      <Form.Item name="name" label="Name">
        <Input type="text" ref={nameField} />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>
    </Form>
  );
}

function VendorForm({ form, initialValues }) {
  form.setFieldValue('name', initialValues.name);
  form.setFieldValue('address', initialValues.address);
  form.setFieldValue('phone', initialValues.phone);

  const nameField = useRef(null);

  useEffect(() => {
    if (nameField && nameField.current) {
      nameField.current.focus();
    }
  }, [nameField]);

  return (
    <Form form={form} layout="inline" autoComplete="on">
      <Form.Item name="name" label="Name">
        <Input type="text" ref={nameField} />
      </Form.Item>
      <Form.Item name="address" label="Address">
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>
    </Form>
  );
}

// Editable Table
interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

const originData: Item[] = [];

for (let i = 0; i < 1; i++) {
  originData.push({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function Products(params: type) {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const remove = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });

    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>{' '}
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => remove(record)}
            >
              Delete
            </Typography.Link>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const addRow = () => {
    const id = uuidv4();
    let row = [
      {
        key: id,
        name: `product ${id}`,
        age: 32,
        address: `London Park no. ${id}`,
      },
    ];

    setData((prev) => {
      return [...prev, ...row];
    });
  };

  return (
    <Form form={form} component={false}>
      <Button
        type="default"
        size="middle"
        style={{ margin: 2 }}
        onClick={addRow}
      >
        Add Row
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
          defaultPageSize: 5,
        }}
      />
    </Form>
  );
}

export default Customers;
