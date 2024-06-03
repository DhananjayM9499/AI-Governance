import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";

const VendorMasterTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    const response = await axios.get(API.GET_VENDORMASTER_API);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteObject = (vendorid) => {
    if (window.confirm("Are you sure you want to delete")) {
      axios.delete(API.DELETE_VENDORMASTER_API(vendorid));
      console.log("success:", "deleted successfully");
      setTimeout(() => loadData(), 500);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <Header />
      <div style={{ marginTop: "15px", marginBottom: "3cm" }}>
        <Link to="/addvendormaster">
          <center>
            <button className="btn btn-contact">Add Stake Holder</button>
          </center>
        </Link>

        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No</th>
              <th style={{ textAlign: "center" }}>Stake Holder Name</th>
              <th style={{ textAlign: "center" }}>Stake Holder Contact</th>
              <th style={{ textAlign: "center" }}>Stake Holder Email</th>
              <th style={{ textAlign: "center" }}>Stake Holder Type</th>
              <th style={{ textAlign: "center" }}>Stake Holder Category</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.vendorname}</td>
                  <td>{item.vendorcontact}</td>
                  <td>{item.vendoremail}</td>
                  <td>{item.stakeholdertype}</td>
                  <td>{item.category}</td>
                  <td>
                    <Link to={`/vendormasterupdate/${item.vendorid}`}>
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteObject(item.vendorid)}
                    >
                      Delete
                    </button>
                    <Link to={`/vendormasterview/${item.vendorid}`}>
                      <button className="btn btn-view">View</button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <center>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(data.length / itemsPerPage) },
              (_, i) => (
                <button key={i + 1} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              )
            )}
          </div>
        </center>
      </div>
      <Footer />
    </div>
  );
};

export default VendorMasterTable;
