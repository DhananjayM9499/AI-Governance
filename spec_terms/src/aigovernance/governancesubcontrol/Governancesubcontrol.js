import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../pages/header";
import Footer from "../pages/footer";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../endpoint";

const Governancesubcontrol = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_SUBCONTROL_API);
      const sortedData = response.data.sort(
        (a, b) => b.subcontrolid - a.subcontrolid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const deleteGovernancesubcontrol = async (subcontrolid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_SUBCONTROL_API(subcontrolid)
        );
        if (response.status === 200) {
          toast.success("Governance Control Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete Governance Control as there are associated Projects present ."
          );
        } else {
          console.log(error);
          toast.error("An error occurred while deleting Governance Control.");
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
      <h1>Governance Control </h1>
      <div style={{ marginTop: "auto", paddingBottom: "100px" }}>
        <Link to="/addGovernancesubcontrol">
          <button className="btn btn-contact">Add Governance Control</button>
        </Link>
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Governance Control Name</th>
              <th style={{ textAlign: "center" }}>Control Weight</th>
              <th style={{ textAlign: "center" }}>Evidence</th>

              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + indexOfFirstItem + 1}</th>
                  <td>{item.subcontrolname}</td>
                  <td>{item.subcontrolwt}</td>
                  <td>{item.evidence}</td>
                  <td>
                    <Link to={`/governanceEdit/${item.subcontrolid}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() =>
                        deleteGovernancesubcontrol(item.subcontrolid)
                      }
                    >
                      Delete
                    </button>
                    <Link to={`/governancesubcontrolView/${item.subcontrolid}`}>
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

export default Governancesubcontrol;
