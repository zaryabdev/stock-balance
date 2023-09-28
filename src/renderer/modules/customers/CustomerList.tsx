import { Divider, List, Typography } from 'antd';

function CustomerList(params: type) {
  const data = [
    'Ali Muhtashim',
    'Hamza Khan',
    'Ibrar Mughal',
    'Murtaza Abbas',
    'Faizan Younas',
    'Haider Mughal',
    'Umair Raess',
    'Mubeen Raess',
  ];

  return (
    <List
      dataSource={data}
      renderItem={(item, i) => (
        <List.Item>
          <Typography.Text mark={i === 3}>{item} </Typography.Text>
        </List.Item>
      )}
    />
  );
}

export default CustomerList;
