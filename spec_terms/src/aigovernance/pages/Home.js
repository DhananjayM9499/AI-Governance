import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "./header";
import Footer from "./footer";
const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const response = await axios.get(
        "https://staging.apilayer.valuevalidator.com/node-api/api/get"
      );
      const sortedData = response.data.sort(
        (a, b) => b.termsetid - a.termsetid
      );
      console.log(sortedData); // Log the received data
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const deleteTermSet = async (termsetid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          `https://staging.apilayer.valuevalidator.com/node-api/api/remove/${termsetid}`
        );
        if (response.status === 200) {
          toast.success("Term Set Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete term set as there are associated terms present ."
          );
        } else {
          console.log(error);
          toast.error("An error occurred while deleting term set.");
        }
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Header />
      <div style={{ marginTop: "89px", paddingBottom: "100px" }}>
        <Link to="/addTermSet">
          <button className="btn btn-contact">Add Term Set</button>
        </Link>
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Term Set</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + indexOfFirstItem + 1}</th>
                  <td>{item.termsetname}</td>
                  <td>
                    <Link to={`/update/${item.termsetid}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteTermSet(item.termsetid)}
                    >
                      Delete
                    </button>
                    <Link to={`/view/${item.termsetid}`}>
                      <button className="btn btn-view">View</button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map(
            (item, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
