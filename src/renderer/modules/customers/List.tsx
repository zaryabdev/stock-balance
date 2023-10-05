import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Select, Space, Table } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import React, { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

interface DataType {
  key: string;
  name: string;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
  },
  {
    key: '2',
    name: 'Joe Black',
  },
  {
    key: '3',
    name: 'Jim Green',
  },
  {
    key: '4',
    name: 'Jim Red',
  },
  {
    key: '5',
    name: 'Lala Red',
  },
  {
    key: '6',
    name: 'Pom Blue',
  },
  {
    key: '7',
    name: 'Tina Green',
  },
  {
    key: '8',
    name: 'Joe Yellow',
  },
  {
    key: '9',
    name: 'Tha Pink',
  },
  {
    key: '10',
    name: 'Thoi Pink',
  },
];

const List: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([
    '1',
    '3',
    '5',
  ]);
  const [loading, setLoading] = useState(false);

  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>(
    'checkbox',
  );

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      // setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

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
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
    );
    debugger;
    setSelectedRowKeys(selectedRowKeys);
  };

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

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
            size="small"
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
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>

          {/* <Button
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
          </Button> */}
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
      title: 'Customers',
      dataIndex: 'name',
      key: 'name',
      width: '100%',
      ...getColumnSearchProps('name'),
    },
  ];

  const handleRowSelection = (record, rowIndex, event) => {
    console.log(record, rowIndex, event);
    debugger;
    let { key } = record;
    let currentSelection = [...selectedRowKeys];

    if (currentSelection.includes(key)) {
      let filteredSelection = currentSelection.filter((el) => el !== key);

      setSelectedRowKeys(filteredSelection);
    } else {
      currentSelection.push(key);

      setSelectedRowKeys(currentSelection);
    }

    debugger;
  };

  return (
    <div>
      <div style={{ margin: 4 }}>
        <Button
          type="default"
          size="small"
          onClick={start}
          loading={loading}
          disabled={!hasSelected}
        >
          Load
        </Button>
        <Button
          type="default"
          size="small"
          onClick={start}
          loading={loading}
          // disabled={!hasSelected}
        >
          Add
        </Button>
        <Button
          type="default"
          size="small"
          onClick={start}
          loading={loading}
          // disabled={!hasSelected}
        >
          Delete
        </Button>
      </div>
      <Table
        columns={columns}
        rowSelection={{
          type: selectionType,
          hideSelectAll: true,
          ...rowSelection,
        }}
        dataSource={data}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              console.log(record, rowIndex, event);
              handleRowSelection(record, rowIndex, event);
            },
            onDoubleClick: (event) => {
              console.log(record, rowIndex, event);
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

export default List;
