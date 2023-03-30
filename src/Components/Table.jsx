import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Table() {
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
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Table;
