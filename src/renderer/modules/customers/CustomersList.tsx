import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Badge, Button, Input, Select, Space, Table } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { STATUS, TYPE, TYPE_COLOR_PALLETE } from '../../contants';

interface DataType {
  id: string;
  name: string;
}

type DataIndex = keyof DataType;

const CustomersList: React.FC = ({
  data,
  selectedRowKeys,
  handleSelectedRowKeys,
  option,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

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

  const onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: DataType[],
  ) => {
    console.log(`onSelectChange()`);
    console.log(selectedRowKeys);
    console.log(selectedRows);

    handleSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="middle"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="middle"
            style={{ width: 90 }}
          >
            Search
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
        <>{text}</>
      ),
  });

  const getTitle = (option) => {
    switch (option) {
      case TYPE.customer:
        return 'Customers';
      case TYPE.walkinCustomer:
        return 'Walking Customers';
      case TYPE.both:
        return 'Customers | Vendors';
      case TYPE.vendor:
        return 'Vendors';
      case TYPE.deleted:
        return 'Deleted Customers | Vendors ';
      case TYPE.archived:
        return 'Archived';

      default:
        break;
    }
  };

  const columns: ColumnsType<DataType> = [
    {
      title: ``,
      dataIndex: 'type',
      key: 'type',
      width: '5%',
      render: (type) => <Badge color={`${TYPE_COLOR_PALLETE[type]}`} />,
    },
    {
      title: `${getTitle(option)}`,
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      showSorterTooltip: false,
      // defaultSortOrder: 'ascend',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
      width: '95%',
      ...getColumnSearchProps('name'),
    },
  ];

  const handleRowSelection = (record, rowIndex, event) => {
    // console.log(record, rowIndex, event);

    const { key } = record;
    const currentSelection = [...selectedRowKeys];

    if (currentSelection.includes(key)) {
      const filteredSelection = currentSelection.filter((el) => el !== key);

      handleSelectedRowKeys(filteredSelection);
    } else {
      currentSelection.push(key);

      handleSelectedRowKeys(currentSelection);
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          hideSelectAll: false,
          ...rowSelection,
        }}
        scroll={{ y: 500 }}
        pagination={{ hideOnSinglePage: true, pageSize: 1000 }}
        dataSource={data}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // console.log(record, rowIndex, event);
              handleRowSelection(record, rowIndex, event);
            },
            onDoubleClick: (event) => {
              // console.log(record, rowIndex, event);
            },
            // onContextMenu: (event) => {
            //   console.log(record, rowIndex, event);
            // },
          };
        }}
      />
    </div>
  );
};

export default CustomersList;
