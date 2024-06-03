import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";

const ThemeTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    const response = await axios.get(API.GET_THEMEMASTER_API);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteObject = (thememasterid) => {
    if (window.confirm("Are you sure you want to delete")) {
      axios.delete(API.DELETE_THEMEMASTER_API(thememasterid));
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
      <div style={{ marginTop: "15px" }}>
        <Link to="/addthememaster">
          <center>
            <button className="btn btn-contact">Theme</button>
          </center>
        </Link>

        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No</th>
              <th style={{ textAlign: "center" }}>Theme Code</th>
              <th style={{ textAlign: "center" }}>Theme Name</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.themecode}</td>
                <td>{item.themename}</td>

                <td>
                  <Link to={`/thememasterupdate/${item.thememasterid}`}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteObject(item.thememasterid)}
                  >
                    Delete
                  </button>
                  <Link to={`/view/${item.thememasterid}`}>
                    <button className="btn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            ))}
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

export default ThemeTable;
