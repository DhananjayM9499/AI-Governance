import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../pages/header";
import Footer from "../pages/footer";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../endpoint";
import FileUploader from "../ExcelUpload/FileUploader";

const Governancecontrol = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_CONTROL_API);
      const sortedData = response.data;
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleUpload = (data) => {
    console.log("Uploaded data:", data);
  };

  const handleUploadButtonClick = () => {
    setShowUploadPopup(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteCompany = async (controlid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(API.DELETE_CONTROL_API(controlid));
        if (response.status === 200) {
          toast.success("Control Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete Governance Sub-Control as there are associates present."
          );
        } else {
          console.error(error);
          toast.error(
            "An error occurred while deleting Governance Sub-Control."
          );
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
      <h1>Governance Sub-Controls List</h1>
      <div style={{ marginTop: "auto", paddingBottom: "100px" }}>
        <button className="btn btn-contact" onClick={handleUploadButtonClick}>
          Upload Excel
        </button>
        <Link to="/addGovernancecontrol">
          <button className="btn btn-contact">
            Add Governance Sub-Control
          </button>
        </Link>
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Group Name</th>
              <th style={{ textAlign: "center" }}>Thrust Area</th>
              <th style={{ textAlign: "center" }}>Control Name</th>
              <th style={{ textAlign: "center" }}>Sub-Control Name</th>
              <th style={{ textAlign: "center" }}>Sub-Control Weight</th>
              <th style={{ textAlign: "center" }}>Expected Evidence</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + indexOfFirstItem + 1}</th>
                <td>{item.groupname}</td>
                <td>{item.thrustarea}</td>
                <td>{item.controlname}</td>
                <td>{item.subcontrolname}</td>
                <td>{item.controlwt}</td>
                <td>{item.evidence}</td>
                <td>
                  <Link to={`/controlGovernanceedit/${item.controlid}`}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteCompany(item.controlid)}
                  >
                    Delete
                  </button>
                  <Link to={`/controlGovernanceView/${item.controlid}`}>
                    <button className="btn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          {Array.from({ length: Math.ceil(data.length / itemsPerPage) }).map(
            (_, index) => (
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
      {showUploadPopup && (
        <FileUploader
          onClose={() => setShowUploadPopup(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default Governancecontrol;
