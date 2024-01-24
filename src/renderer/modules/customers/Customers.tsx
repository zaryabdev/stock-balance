import {
  CustomerServiceOutlined,
  DeleteOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  ExclamationCircleFilled,
  InboxOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import {
  Avatar,
  Badge,
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

import { useRenderCount } from '@uidotdev/usehooks';
import context from '../../AppContext';
import { STATE, STATUS, TYPE, TYPE_COLOR_PALLETE } from '../../contants';
import CustomersList from './CustomersList';
// import MultiCustomersTabs from './MultiCustomersTabs';

const { confirm } = Modal;
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

// { label: 'Walking', value: TYPE.walkingCustomer },
// { label: 'Customers & Vendors', value: TYPE.both },

const options = [
  {
    label: (
      <Space>
        <Badge color={`${TYPE_COLOR_PALLETE[TYPE.customer]}`} />
        Regular
      </Space>
    ),
    value: TYPE.customer,
  },
  {
    label: (
      <Space>
        <Badge color={`${TYPE_COLOR_PALLETE[TYPE.walkingCustomer]}`} />
        Walking
      </Space>
    ),
    value: TYPE.walkingCustomer,
  },
  {
    label: (
      <Space>
        <Badge color={`${TYPE_COLOR_PALLETE[TYPE.vendor]}`} />
        Vendor
      </Space>
    ),
    value: TYPE.vendor,
  },
  {
    label: <Space>All</Space>,
    value: TYPE.both,
  },
  {
    label: (
      <Space>
        <Badge color={`${TYPE_COLOR_PALLETE[TYPE.archived]}`} />
        <InboxOutlined />
      </Space>
    ),
    value: TYPE.archived,
  },
  {
    label: (
      <Space>
        <Badge color={`${TYPE_COLOR_PALLETE[TYPE.deleted]}`} />
        <DeleteOutlined />
      </Space>
    ),
    value: TYPE.deleted,
  },
];

const initialCustomerState = {
  id: '',
  key: '',
  name: '',
  phone: '',
  address: '',
  type: TYPE.customer,
  status: TYPE.unarchived,
};

// Editable Table
interface Item {
  key: string;
  id: string;
  customer_id: string;
  value: string;
  label: string;
  qty_ctn: number;
}

const initialProducts: Item[] = [];

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

function Customers({
  getCurrentStock,
  getCurrentProducts,
  getCurrentCustomers,
  setSelectedOption,
  selectedOption,
}) {
  const appContext = useContext(context);

  const [selectedCutomer, setSelectedCutomer] = useState(initialCustomerState);
  const [selectedCutomersToLoad, setSelectedCutomersToLoad] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [productsForm] = Form.useForm();
  const [products, setProducts] = useState(initialProducts);
  const [listProducts, setListProducts] = useState(initialProducts);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.key === editingKey;

  const [customerUUID, setCustomerUUID] = useState('NEW');

  const renderCount = useRenderCount();

  useEffect(() => {
    getAllCustomers();
    getAllProducts();
  }, []);

  const handleShowCreateModal = () => {
    setCustomerUUID(uuidv4());
    setOpenCreateModal(true);
  };

  const createProduct = (products) => {
    const response = window.electron.ipcRenderer.createProduct(products);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of create:product-response ');
      console.log(response);
      getCurrentProducts({});
    }
  };

  const getAllProducts = async () => {
    const response = await window.electron.ipcRenderer.getAllProducts([]);
    debugger;
    console.log('get:all:product-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of get:all:product-response ');
      console.log(response);
      setListProducts(response.data);
    }
  };

  const createCustomer = async (customerData) => {
    const response = window.electron.ipcRenderer.createCustomer(customerData);
    debugger;
    console.log('create:customer-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of create:customer-response ');
      console.log(response);
      getAllCustomers({});
    }
  };

  const updateCustomer = async (customerData) => {
    const response = window.electron.ipcRenderer.updateCustomer(customerData);
    debugger;
    console.log('update:customer-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:customer-response ');
      console.log(response);
      getAllCustomers({});
    }
  };

  const updateProduct = async (productsToUpdate) => {
    const response =
      window.electron.ipcRenderer.updateProduct(productsToUpdate);
    debugger;
    console.log('update:product-response reponse came back');
    console.log(response);

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of update:product-response ');
      console.log(response);
      getCurrentProducts({});
    }
  };

  const getAllCustomers = async () => {
    const response = await window.electron.ipcRenderer.getAllCustomers({});
    debugger;
    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of get:all:customer-response');
      console.log(response);

      const list = response.data;

      if (selectedOption !== TYPE.archived) {
        const nonArchived = list.filter(
          (item) => item.status !== TYPE.archived,
        );

        const filteredList = nonArchived.filter(
          (item) => item.type === selectedOption,
        );

        appContext.setCustomersList(list);
        appContext.setFilteredCustomersList(filteredList);
      } else {
        const archived = list.filter((item) => item.status === TYPE.archived);
        appContext.setCustomersList(list);
        appContext.setFilteredCustomersList(archived);
      }
    }
  };

  const deleteCustomers = (data) => {
    const response = window.electron.ipcRenderer.deleteCustomers(data);
    console.log('delete:customer-response reponse came back');
    console.log(response);

    debugger;

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      setSelectedRowKeys([]);
      console.log('response of delete:customer-response ');
      console.log(response);
      if (response.status === STATUS.FAILED) {
        console.log(response.message);
      }

      if (response.status === STATUS.SUCCESS) {
        console.log('response of delete:customer-response  ');
        console.log(response);
      }
    }
  };

  const archiveCustomers = (data) => {
    const response = window.electron.ipcRenderer.archiveCustomers(data);

    console.log('archive:customer-response reponse came back');
    console.log(response);
    debugger;
    appContext.success('Archived Successfully.');

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of archive:customer-response ');
      console.log(response);
      getCurrentCustomers({});
    }
  };

  const unarchiveCustomers = (data) => {
    const response = window.electron.ipcRenderer.unarchiveCustomers(data);

    console.log('unarchive:customer-response reponse came back');
    console.log(response);
    debugger;
    appContext.success('Unarchived Successfully.');

    if (response.status === STATUS.FAILED) {
      console.log(response.message);
    }

    if (response.status === STATUS.SUCCESS) {
      console.log('response of unarchive:customer-response ');
      console.log(response);
      getCurrentCustomers({});
    }
  };

  const createUpdateCustomerProduct = () => {};

  const handleCreateModalOk = async () => {
    const customerId = customerUUID;
    const name = form.getFieldValue('name');
    const address = form.getFieldValue('address');
    const phone = form.getFieldValue('phone');

    const customerData = {
      id: customerId,
      key: customerId,
      name,
      address,
      phone,
      type: selectedOption,
    };

    if (customerData.name === '') {
      appContext.warning('Name cannot be empty!');
      return;
    }

    if (selectedOption === TYPE.vendor && products.length > 0) {
      let isValid = true;

      products.map((item) => {
        if (item.label === 'Sample product' || item.id === 'NEW') {
          isValid = false;
        }
      });

      if (!isValid) {
        appContext.warning(
          `Please edit product name. Cannot have 'Sample Product' as name.`,
        );
        return false;
      }
    }

    createCustomer(customerData);

    form.resetFields();
    setProducts(initialProducts);
    setOpenCreateModal(false);
    setSelectedRowKeys([]);
  };

  const handleCreateModalCancel = () => {
    form.resetFields();
    setProducts(initialProducts);
    setOpenCreateModal(false);
    // setSelectedRowKeys([]);
  };

  const handleShowEditModal = () => {
    setCustomerUUID(selectedCutomer.id);
    const _products = [];
    if (appContext.currentProducts) {
      appContext.currentProducts.map((product) => {
        if (product.customer_id === selectedCutomer.id) {
          product.key = product.id;
          _products.push(product);
        }
      });
    }

    setProducts(_products);
    setOpenEditModal(true);
  };

  const handleEditModalOk = () => {
    const { id } = selectedCutomer;
    const { key } = selectedCutomer;

    const name = form.getFieldValue('name');
    const address = form.getFieldValue('address');
    const phone = form.getFieldValue('phone');

    const customerData = {
      id,
      key,
      name,
      address,
      phone,
      type: selectedOption,
    };

    if (customerData.name === '') {
      appContext.warning('Name cannot be empty!');
      return;
    }

    if (selectedOption === TYPE.vendor && products.length > 0) {
      let isValid = true;

      products.map((item) => {
        if (item.label === 'Sample product' || item.id === 'NEW') {
          isValid = false;
        }
      });

      if (!isValid) {
        appContext.warning(
          `Please edit product name. Cannot have 'Sample Product' as name.`,
        );
        return false;
      }
    }

    appContext.success('Saved Successfully.');

    const productsToCreate = [];
    const productsToUpdate = [];

    products.map((product) => {
      const hasItem = appContext.currentProducts.filter(
        (p) => product.id === p.id,
      );
      if (hasItem.length > 0) {
        productsToUpdate.push(product);
      } else {
        productsToCreate.push(product);
      }
    });

    // createUpdateCustomerProduct(customerData,productsToCreate, productsToUpdate)

    updateCustomer(customerData);
    updateProduct(productsToUpdate);
    createProduct(productsToCreate);

    form.resetFields();
    setProducts(initialProducts);
    setOpenEditModal(false);
    setSelectedRowKeys([]);
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
    let filteredList = [];

    if (selectedOption === TYPE.both) {
      const nonArchivedOrDeleted = appContext.customersList.filter((item) => {
        let bool = true;

        if (
          item.status &&
          item.status !== TYPE.deleted &&
          item.status !== TYPE.unarchived
        ) {
          bool = false;
        }

        return bool;
      });

      filteredList = [...nonArchivedOrDeleted];
    }

    if (
      selectedOption === TYPE.customer ||
      selectedOption === TYPE.walkingCustomer ||
      selectedOption === TYPE.vendor
    ) {
      const nonArchivedOrDeleted = appContext.customersList.filter((item) => {
        let bool = true;

        if (
          item.status &&
          item.status !== TYPE.deleted &&
          item.status !== TYPE.unarchived
        ) {
          bool = false;
        }

        return bool;
      });

      const _filteredList = nonArchivedOrDeleted.filter(
        (item) => item.type === selectedOption,
      );

      filteredList = [..._filteredList];
    }

    if (selectedOption === TYPE.archived) {
      const nonDeletedOrUnArchived = appContext.customersList.filter((item) => {
        let bool = true;

        if (
          item.status &&
          item.status !== TYPE.deleted &&
          item.status !== TYPE.unarchived &&
          item.status === TYPE.archived
        ) {
          bool = true;
        } else {
          bool = false;
        }

        return bool;
      });

      filteredList = [...nonDeletedOrUnArchived];
    }

    appContext.setFilteredCustomersList(filteredList);
  }, [selectedOption]);

  const handleSelectionChange = ({ target: { value } }: RadioChangeEvent) => {
    setSelectedOption(value);
    setSelectedRowKeys([]);
  };

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    productsForm.setFieldsValue({
      customer_id: customerUUID,
      ...record,
    });
    setEditingKey(record.key);
  };

  const deleteProduct = (record: Partial<Item> & { key: React.Key }) => {
    // const updatedProducts = products.filter(
    //   (product) => product.key !== record.key,
    // );
    const updatedProducts = products.map((product) => {
      product.status = STATE.deleted;
      return product;
    });

    setProducts(updatedProducts);
    setEditingKey('');

    productsForm.setFieldsValue({
      label: '',
      qty_ctn: '',
      id: '',
      key: '',
      value: '',
      status: STATE.created,
    });
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await productsForm.validateFields()) as Item;

      let isProductNameUnique = true;
      let isProductNameSame = true;

      if (products.length > 0) {
        products.map((product) => {
          if (key === product.key) {
            if (product.label === 'Sample product') {
              isProductNameSame = true;
            } else if (row.label === product.label) {
              isProductNameSame = true;
            } else {
              isProductNameSame = false;
            }
          } else if (row.label === product.label) {
            isProductNameUnique = false;
          }
        });
      }
      if (
        isProductNameUnique &&
        appContext.currentProducts &&
        appContext.currentProducts.length > 0
      ) {
        appContext.currentProducts.map((product) => {
          if (key === product.key) {
            if (product.label === 'Sample product') {
              isProductNameSame = true;
            } else if (row.label === product.label) {
              isProductNameSame = true;
            } else {
              isProductNameSame = false;
            }
          } else if (row.label === product.label) {
            isProductNameUnique = false;
          }
        });
      }

      if (isProductNameUnique && isProductNameSame) {
        const newData = [...products];

        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
            value: row.label,
          });
          setProducts(newData);
          setEditingKey('');
        } else {
          newData.push({ ...row, value: row.label });
          setProducts(newData);
          setEditingKey('');
        }
      } else {
        if (!isProductNameUnique) {
          appContext.warning(
            `${row.label} already exists. Cannot have duplicate products.`,
          );
        }
        if (!isProductNameSame) {
          appContext.warning(`Product name cannot be changed.`);
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'label',
      width: '25%',
      editable: true,
    },
    {
      title: 'Quantity Per Carton',
      dataIndex: 'qty_ctn',
      width: '40%',
      editable: true,
    },
    {
      title: '',
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
            {/* <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => deleteProduct(record)}
            >
              Delete
            </Typography.Link> */}
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
        inputType: col.dataIndex === 'qty_ctn' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const addNewProduct = () => {
    const id = uuidv4();
    const row = [
      {
        key: id,
        id,
        customer_id: customerUUID,
        label: 'Sample product',
        value: 'Sample product',
        qty_ctn: 0,
        status: STATE.created,
      },
    ];

    setProducts((prev) => {
      return [...prev, ...row];
    });
  };

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
          {appContext.customersList.map((customer) => {
            if (selectedRowKeys.includes(customer.id)) {
              return <span>{customer.name} | </span>;
            }
            return null;
          })}
        </span>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const data = [...selectedRowKeys];
        deleteCustomers(data);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const showArchiveConfirm = () => {
    confirm({
      title: `Are you sure archive ${
        selectedOption === TYPE.customer ? 'Customer' : 'Vendor'
      }`,
      icon: <ExclamationCircleFilled />,
      content: (
        <span>
          {appContext.customersList.map((customer) => {
            if (selectedRowKeys.includes(customer.id)) {
              return <span>{customer.name} | </span>;
            }
            return null;
          })}
        </span>
      ),
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const data = [...selectedRowKeys];
        archiveCustomers(data);
        setSelectedRowKeys([]);
        // window.electron.ipcRenderer.deleteCustomers(data);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const showUnarchiveConfirm = () => {
    confirm({
      title: `Are you sure to unarchive ${
        selectedOption === TYPE.customer ? '' : ''
      }`,
      icon: <ExclamationCircleFilled />,
      content: (
        <span>
          {appContext.customersList.map((customer, index) => {
            if (selectedRowKeys.includes(customer.id)) {
              return (
                <span>
                  {`${customer.name}${selectedRowKeys.length > 1 ? ',' : '.'}`}{' '}
                </span>
              );
            }
            return null;
          })}
        </span>
      ),
      okText: 'Yes',
      okType: 'default',
      cancelText: 'No',
      onOk() {
        const data = [...selectedRowKeys];
        unarchiveCustomers(data);
        setSelectedRowKeys([]);
        // window.electron.ipcRenderer.deleteCustomers(data);
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
      const foundItem = appContext.customersList.find((c) => c.key === keys[0]);
      setSelectedCutomer(foundItem);
    } else {
      setSelectedCutomer(initialCustomerState);
    }

    setSelectedRowKeys(keys);
  };

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
              size="middle"
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
                  selectedRowKeys.length === 0 ||
                  selectedRowKeys.length > 1 ||
                  selectedOption === TYPE.both
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
                disabled={selectedRowKeys.length < 1}
              >
                Load
              </Button>

              {/* <Button
                type="default"
                size="middle"
                style={{ margin: 2 }}
                onClick={showDeleteConfirm}
                // loading={loading}
                // disabled={
                //   selectedRowKeys.length < 1 || selectedOption === TYPE.both
                // }
                disabled
              >
                Delete
              </Button> */}
              {selectedOption === TYPE.archived && (
                <Button
                  type="default"
                  size="middle"
                  style={{ margin: 2 }}
                  onClick={showUnarchiveConfirm}
                  // loading={loading}
                  disabled={
                    selectedRowKeys.length < 1 || selectedOption === TYPE.both
                  }
                >
                  Unarchive
                </Button>
              )}
              {selectedOption === TYPE.customer && (
                <Button
                  type="default"
                  size="middle"
                  style={{ margin: 2 }}
                  onClick={showArchiveConfirm}
                  // loading={loading}
                  disabled={
                    selectedRowKeys.length < 1 || selectedOption === TYPE.both
                  }
                  // disabled
                >
                  Archive
                </Button>
              )}
              {selectedOption === TYPE.vendor && (
                <Button
                  type="default"
                  size="middle"
                  style={{ margin: 2 }}
                  onClick={showArchiveConfirm}
                  // loading={loading}
                  disabled={
                    selectedRowKeys.length < 1 || selectedOption === TYPE.both
                  }
                  // disabled
                >
                  Archive
                </Button>
              )}

              <Button
                type="default"
                size="middle"
                style={{ margin: 2 }}
                onClick={() => appContext.setToggleSideBar((prev) => !prev)}
                // loading={loading}
                // disabled={}
              >
                Hide List
              </Button>
            </div>
            <CustomersList
              data={appContext.filteredCustomersList}
              option={selectedOption}
              selectedRowKeys={selectedRowKeys}
              handleSelectedRowKeys={handleSelectedRowKeys}
            />
          </>
        </Col>
        <Col span={appContext.toggleSideBar ? 18 : 24}>
          {/* <MultiCustomersTabs
            customersList={appContext.customersList}
            getCurrentStock={getCurrentStock}
            selectedCutomersToLoad={selectedCutomersToLoad}
          /> */}
          MultiCustomersTabs
        </Col>
      </Row>
      <Modal
        open={openCreateModal}
        title={`${
          selectedOption === TYPE.customer ||
          selectedOption === TYPE.walkingCustomer
            ? 'Create Customer'
            : 'Create Vendor'
        }`}
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
          {selectedOption === TYPE.walkingCustomer && (
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
              <VendorForm
                form={form}
                initialValues={{
                  name: `${
                    form.getFieldValue('name') ? form.getFieldValue('name') : ''
                  }`,
                  address: `${
                    form.getFieldValue('address')
                      ? form.getFieldValue('address')
                      : ''
                  }`,
                  phone: `${
                    form.getFieldValue('phone')
                      ? form.getFieldValue('phone')
                      : ''
                  }`,
                  type: selectedOption,
                }}
              />
              <Products
                productsForm={productsForm}
                addNewProduct={addNewProduct}
                products={products}
                mergedColumns={mergedColumns}
                cancel={cancel}
              />
              {/* <Tabs
                defaultActiveKey="DETAILS"
                centered
                items={[
                  {
                    label: 'Details',
                    children: (
                      <VendorForm
                        form={form}
                        initialValues={{
                          name: `${
                            form.getFieldValue('name')
                              ? form.getFieldValue('name')
                              : ''
                          }`,
                          address: `${
                            form.getFieldValue('address')
                              ? form.getFieldValue('address')
                              : ''
                          }`,
                          phone: `${
                            form.getFieldValue('phone')
                              ? form.getFieldValue('phone')
                              : ''
                          }`,
                          type: selectedOption,
                        }}
                      />
                    ),
                    key: 'DETAILS',
                    closable: false,
                  },
                  {
                    label: 'Products',
                    children: (
                      <Products
                        productsForm={productsForm}
                        addNewProduct={addNewProduct}
                        products={products}
                        mergedColumns={mergedColumns}
                        cancel={cancel}
                      />
                    ),
                    key: 'PRODUCTS',
                    closable: false,
                  },
                ]}
              /> */}
            </div>
          )}
        </div>
      </Modal>
      <Modal
        open={openEditModal}
        title={`${
          selectedOption === TYPE.customer ||
          selectedOption === TYPE.walkingCustomer
            ? 'Edit Customer'
            : 'Edit Vendor'
        }`}
        width={selectedOption === TYPE.vendor ? 1000 : 500}
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
        {selectedOption === TYPE.customer && (
          <CustomerForm
            form={form}
            initialValues={{
              name: selectedCutomer.name,
              address: selectedCutomer.address,
              phone: selectedCutomer.phone,
              type: selectedOption,
            }}
          />
        )}
        {selectedOption === TYPE.walkingCustomer && (
          <CustomerForm
            form={form}
            initialValues={{
              name: selectedCutomer.name,
              address: selectedCutomer.address,
              phone: selectedCutomer.phone,
              type: selectedOption,
            }}
          />
        )}
        {/* : (
          <VendorForm
            form={form}
            initialValues={{
              name: selectedCutomer.name,
              address: selectedCutomer.address,
              phone: selectedCutomer.phone,
              type: selectedOption,
            }}
          />
        )} */}

        {selectedOption === TYPE.vendor && (
          <div>
            <VendorForm
              form={form}
              initialValues={{
                name: selectedCutomer.name,
                address: selectedCutomer.address,
                phone: selectedCutomer.phone,
                type: selectedOption,
              }}
            />
            <Products
              productsForm={productsForm}
              addNewProduct={addNewProduct}
              products={products}
              mergedColumns={mergedColumns}
              cancel={cancel}
            />
            {/* <Tabs
              defaultActiveKey="DETAILS"
              centered
              items={[
                {
                  label: 'Details',
                  children: (
                    <VendorForm
                      form={form}
                      initialValues={{
                        name: selectedCutomer.name,
                        address: selectedCutomer.address,
                        phone: selectedCutomer.phone,
                        type: selectedOption,
                      }}
                    />
                  ),
                  key: 'DETAILS',
                  closable: false,
                },
                {
                  label: 'Products',
                  children: (
                    <Products
                      productsForm={productsForm}
                      addRow={addNewProduct}
                      products={products}
                      mergedColumns={mergedColumns}
                      cancel={cancel}
                    />
                  ),
                  key: 'PRODUCTS',
                  closable: false,
                },
              ]}
            /> */}
          </div>
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

function Products({
  productsForm,
  addNewProduct,
  products,
  mergedColumns,
  cancel,
}) {
  return (
    <Form form={productsForm} component={false}>
      <div style={{ padding: 5, display: 'flex', justifyContent: 'end' }}>
        <Button
          type="default"
          size="middle"
          style={{ marginBottom: 10 }}
          onClick={addNewProduct}
        >
          Add New Product
        </Button>
      </div>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={products}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
          defaultPageSize: 6,
        }}
      />
    </Form>
  );
}

export default Customers;
