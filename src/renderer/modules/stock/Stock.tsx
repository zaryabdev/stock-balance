import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import appContext from '../../AppContext';

interface DataType {
  id: string;
  key: string;
  product: string;
  carton: number;
  qty_ctn: number;
  total_qty: number;
}

type DataIndex = keyof DataType;

const Stock: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [stock, setStock] = useState<DataType[]>([]);
  const searchInput = useRef<InputRef>(null);

  const context = useContext(appContext);

  useEffect(() => {
    if (context.currentStock) {
      setStock(context.currentStock);
    }
  }, [context.currentStock]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: '30%',
      ...getColumnSearchProps('product'),
    },
    {
      title: 'Carton',
      dataIndex: 'carton',
      key: 'carton',
      width: '20%',
      //   ...getColumnSearchProps('carton'),
    },
    {
      title: 'Quantity / Carton',
      dataIndex: 'qty_ctn',
      key: 'qty_ctn',
      //   ...getColumnSearchProps('qty_ctn'),
    },
    {
      title: 'Total Quantity',
      dataIndex: 'total_qty',
      key: 'total_qty',
      ...getColumnSearchProps('total_qty'),
      sorter: (a, b) => a.total_qty - b.total_qty,
      sortDirections: ['descend', 'ascend'],
    },
  ];

  return <Table columns={columns} dataSource={stock} />;
};

export default Stock;
