import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

function Table() {
  const [data, setData] = useState([]);
  const [pageNumber, setPagenumber] = useState(1);

  const itemsPerPage = 10;
  const pageCount = 9;

  const displayChar = data

    .map((person) => (
      <tr key={person.name}>
        <td>{person.name}</td>
        <td>{person.birth_year}</td>
        <td>{person.height}</td>
        <td>{person.mass}</td>
        <td>{person.homeworld}</td>
        <td>{person.species}</td>
      </tr>
    ));

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `https://swapi.dev/api/people/?page=${pageNumber}`
      );
      const results = response.data.results;

      const dataWithDetails = await Promise.all(
        results.map(async (person) => {
          const homeworldResponse = await axios.get(person.homeworld);
          const homeworld = homeworldResponse.data.name;

          let species = "Human";
          if (person.species.length > 0) {
            const speciesResponse = await axios.get(person.species[0]);
            species = speciesResponse.data.name;
          }

          const speciesUrl = person.species.length > 0 ? person.species[0] : "";
          return {
            ...person,
            homeworld,
            species,
            homeworldUrl: homeworldResponse.data.url,
            speciesUrl,
          };
        })
      );

      setData(dataWithDetails);
    }

    fetchData().catch((error) => {
      console.error(error);
    });
  }, [pageNumber]);

  console.log(data);
  console.log(displayChar);


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
        <div className="table-container">
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
            <tbody>{displayChar}</tbody>
          </table>
        </div>
        <div className="table-footer">
          <p>
            Showing {pageNumber * itemsPerPage + 1} to{" "}
            {Math.min((pageNumber + 1) * itemsPerPage, data.length)} of{" "}
            {data.length} characters
          </p>
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={(selected) => {
              console.log(selected);
              setPagenumber(selected.selected + 1);
            }}
            
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
