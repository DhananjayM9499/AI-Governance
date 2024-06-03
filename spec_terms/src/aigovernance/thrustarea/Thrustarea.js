import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../pages/header";
import Footer from "../pages/footer";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../endpoint";

const Thrustarea = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_THRUST_AREA);
      const sortedData = response.data.sort(
        (a, b) => b.companyid - a.companyid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const deleteThrust = async (thrustid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(API.DELETE_THRUST_AREA(thrustid));
        if (response.status === 200) {
          toast.success("Thrust Area Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete Thrust Area as there are associates present ."
          );
        } else {
          console.log(error);
          toast.error("An error occurred while deleting Thrust Area.");
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
      <h1>Thrust List</h1>
      <div style={{ marginTop: "auto", paddingBottom: "100px" }}>
        <Link to="/thrustareaAdd">
          <button className="btn btn-contact">Add Thrust Area</button>
        </Link>
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Thrust Area</th>
              <th style={{ textAlign: "center" }}>Governance Group</th>

              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + indexOfFirstItem + 1}</th>
                  <td>{item.thrustarea}</td>
                  <td>{item.groupname}</td>

                  <td>
                    <Link to={`/thrustareaEdit/${item.thrustid}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteThrust(item.thrustid)}
                    >
                      Delete
                    </button>
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

export default Thrustarea;
