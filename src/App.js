import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Components/Header";
import Table from "./Components/Table";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);


  

return (
    <div className="App">
      <Header />
      <Table />
    </div>
  );
}

export default App;
