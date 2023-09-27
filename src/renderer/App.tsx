import { useState } from 'react';
import {
  DataSheetGrid,
  checkboxColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
// import icon from '../../assets/icon.svg';
import './App.css';

function Hello() {
  const [data, setData] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ]);

  const columns = [
    {
      ...keyColumn('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn('lastName', textColumn),
      title: 'Last name',
    },
  ];

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          window.electron.store.set('foo', 'bar');
          console.log(window.electron.store.get('foo'));
        }}
      >
        Click Me!
      </button>

      {/* <DataSheetGrid value={data} onChange={setData} columns={columns} /> */}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
