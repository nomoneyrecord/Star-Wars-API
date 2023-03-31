import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Table() {
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
    <div className="container">
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Text"
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary">Search</button>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-dark table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Height</th>
              <th>Mass</th>
              <th>Homeworld</th>
              <th>Species</th>
            </tr>
          </thead>
          <tbody>
            {data.map(person => (
              <tr key={person.name}>
                <td>{person.name}</td>
                <td>{person.birth_year}</td>
                <td>{person.height}</td>
                <td>{person.mass}</td>
                <td>{person.homeworld}</td>
                <td>{person.species}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
