import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

function Table() {
  const [data, setData] = useState([]);
  const [pageNumber, setPagenumber] = useState(1);
  const [searchValue, setSearchValue] = useState(null);
  const [searchBar, setSearchBar] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;
  const pageCount = Math.ceil(totalCount / itemsPerPage);

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
    const homeworld = await retrieveName(person.homeworld);
    const species =
      person.species.length > 0
        ? await retrieveName(person.species[0])
        : "Human";
    return {
      ...person,
      homeworld,
      species,
    };
  };

  const retrieveName = async (url) => {
    const response = await axios.get(url);
    return response.data.name;
  };

  const fetchByPage = async (page) => {
    const response = await axios.get(
      `https://swapi.dev/api/people/?page=${page}`
    );
    const totalCount = response.data.count;
    const adjustedPage = Math.min(page, Math.ceil(totalCount / itemsPerPage));
    const adjustedResponse = await axios.get(
      `https://swapi.dev/api/people/?page=${adjustedPage}`
    );
    return {
      totalCount,
      results: adjustedResponse.data.results,
    };
  };

  const fetchBySearch = async (search, page) => {
    const response = await axios.get(
      `https://swapi.dev/api/people/?search=${search}&page=${page}`
    );
    return {
      totalCount: response.data.count,
      results: response.data.results,
    };
  };

  const handleSearchClick = () => {
    setSearchValue(searchBar);
    setPagenumber(1);
    setSearchBar((prevSearchBar) => prevSearchBar);
  };

  useEffect(() => {
    async function fetchData() {
      let characters;
      let totalCount;
      if (searchValue === null) {
        const response = await fetchByPage(pageNumber);
        characters = response.results;
        totalCount = response.totalCount;
      } else {
        const response = await fetchBySearch(searchValue, pageNumber);
        characters = response.results;
        totalCount = response.totalCount;
      }
      const charactersWithDetails = await Promise.all(
        characters.map((char) => processChar(char))
      );
      setData(charactersWithDetails);
      setTotalCount(totalCount);
    }
    fetchData().catch((error) => {
      console.error(error);
    });
  }, [pageNumber, searchValue]);

  useEffect(() => {
    if (searchBar === "" && searchValue !== null) {
      setSearchValue(null);
      setPagenumber(1);
    }
  }, [searchBar, searchValue]);

  const handlePageChange = async (selected) => {
    console.log("selected: ", selected)
    const newPageNumber = selected.selected + 1;
    console.log("newPageNumber: ", newPageNumber)
    setPagenumber(newPageNumber);
    let characters;
    let totalCount;
    if (searchValue === null) {
      const response = await fetchByPage(newPageNumber);
      characters = response.results;
      totalCount = response.totalCount;
    } else {
      const response = await fetchBySearch(searchValue, newPageNumber);
      characters = response.results;
      totalCount = response.totalCount;
    }
    const charactersWithDetails = await Promise.all(
      characters.map((char) => processChar(char))
    );
    setData(charactersWithDetails);
    setTotalCount(totalCount);
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Text"
            value={searchBar}
            onChange={(e) => setSearchBar(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={handleSearchClick}>
            Search
          </button>
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
            Showing {pageNumber * itemsPerPage - 9} to{" "}
            {Math.min((pageNumber) * itemsPerPage, totalCount)} of{" "}
            {totalCount} characters
          </p>
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            activeClassName={"active"}
            forcePage={pageNumber -1}
          />
        </div>
      </div>
    </div>
  );
}

export default Table;
