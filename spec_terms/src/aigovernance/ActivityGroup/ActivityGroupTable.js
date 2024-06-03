import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";
import Header from "../pages/header";
import Footer from "../pages/footer";

const ActivityGroupTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    const response = await axios.get(API.GET_ACTIVITYGROUP_API);
    setData(response.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteObject = (activitygroupid) => {
    if (window.confirm("Are you sure you want to delete")) {
      axios.delete(API.DELETE_ACTIVITYGROUP_API(activitygroupid));
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
      <Header /> <h1 style={{ textAlign: "center" }}>Activity Group</h1>
      <div style={{ marginTop: "100px" }}>
        <Link to="/addactivitygroup">
          <center>
            <button className="btn btn-contact">Add Activity Group</button>
          </center>
        </Link>

        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No</th>
              <th style={{ textAlign: "center" }}>Activity Group</th>
              <th style={{ textAlign: "center" }}>Theme</th>
              <th style={{ textAlign: "center" }}>Phase</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.groupactivity}</td>
                <td>{item.theme}</td>
                <td>{item.phase}</td>

                <td>
                  <Link to={`/activitygroupupdate/${item.activitygroupid}`}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteObject(item.activitygroupid)}
                  >
                    Delete
                  </button>
                  <Link to={`/activitygroupview/${item.activitygroupid}`}>
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

export default ActivityGroupTable;
