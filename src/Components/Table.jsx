import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

function Table() {
  const [data, setData] = useState([]);
  const [pageNumber, setPagenumber] = useState(1);
  const [searchValue, setSearchValue] = useState(null);
  const [searchBar, setSearchBar] = useState(null)

  const itemsPerPage = 10;
  const pageCount = 9;

  const displayChar = data.map((person) => (
    <tr key={person.name}>
      <td>{person.name}</td>
      <td>{person.birth_year}</td>
      <td>{person.height}</td>
      <td>{person.mass}</td>
      <td>{person.homeworld}</td>
      <td>{person.species}</td>
    </tr>
  ));


  const processChar = async (person) => {
    const homeworld = await retrieveName(person.homeworld)
    const species = person.species.length > 0 
            ? await retrieveName(person.species[0])
            : "Human";
    return {
            ...person,
            homeworld,
            species
          };
  }

  const retrieveName = async (url) => {
    const response = await axios.get(url);
    return response.data.name;
  }

  const fetchByPage = async (page) => {
  const response = await axios.get(
    `https://swapi.dev/api/people/?page=${page}`
  );
    return response.data.results;
  }

  const fetchBySearch = async (search) => {
    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${search}`

      );
      return response.data.results;
    }

  const handleSearchClick = () => {
    setSearchValue(searchBar); 
    setSearchBar(null)
  }

  useEffect(() => {
    
    async function fetchData() {
    
      let characters
      if (searchValue === null) characters = await fetchByPage(pageNumber)
      if (searchValue !== null) characters = await fetchBySearch(searchValue)
      
      // const characters = await fetchByPage(pageNumber)
      const charactersWithDetails = await Promise.all(
        characters.map(char => processChar(char))
      );
      setData(charactersWithDetails);
    }

    fetchData().catch((error) => {
      console.error(error);
    });
  }, [pageNumber, searchValue]);



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
