import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import Table from './Components/Table';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get('https://swapi.dev/api/people')
      .then(response => {
        setData(response.data.results);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="App">
      <Header />
      <Table data={data} />
    </div>
  );
}

export default App;