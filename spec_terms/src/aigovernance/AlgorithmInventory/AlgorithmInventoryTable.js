import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {} from "react-toastify";
import axios from "axios";
import Footer from "../pages/footer";
import Header from "../pages/header";
import * as API from "../endpoint";

const AlgorithmInventoryTable = () => {
  const [data, setData] = useState({});

  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_ALGORITHM_INVENTORY);

      // Check if response.data is an object
      if (typeof response.data === "object" && response.data !== null) {
        setData(response.data);
      } else {
        console.error(
          "Data received from the API is not an object:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
  const deleteobject = (algorithminventoryid) => {
    if (window.confirm("Are you sure you want to delete")) {
      axios.delete(API.DELETE_ALGORITHM_INVENTORY(algorithminventoryid));
      console.log("success:", "deleted successfully");
      setTimeout(() => loadData(), 500);
    }
  };
  return (
    <div>
      <Header />
      <div style={{ marginTop: "1cm", marginBottom: "3cm" }}>
        <Link to="/addalgorithminventory">
          <center>
            {" "}
            <button className="btn btn-contact">Add Algorithm Inventory</button>
          </center>
        </Link>
        <table className="styled-table" style={{ maxWidth: "90%" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No</th>
              <th style={{ textAlign: "center" }}>Project</th>
              <th style={{ textAlign: "center" }}>Project Code</th>
              <th style={{ textAlign: "center" }}>Algorithm Remark</th>
              <th style={{ textAlign: "center" }}>Algorithm Date</th>
              <th style={{ textAlign: "center" }}>Data Remark</th>
              <th style={{ textAlign: "center" }}>Data set Date</th>
              <th style={{ textAlign: "center" }}>Code Vulnerability Remark</th>
              <th style={{ textAlign: "center" }}>Code Vulnerability Date</th>
              <th style={{ textAlign: "center" }}>Privacydata Remark</th>
              <th style={{ textAlign: "center" }}>Privacydata Date</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key, index) => {
              const item = data[key];
              return (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.projectname}</td>
                  <td>{item.projectcode}</td>
                  <td>{item.algorithmremark}</td>
                  <td>{formatDate(item.algorithmversiondate)}</td>
                  <td>{item.dataremark}</td>
                  <td>{formatDate(item.datasetversiondate)}</td>
                  <td>{item.codevulnerabilityremark}</td>
                  <td>{formatDate(item.codevulnerabilityversiondate)}</td>
                  <td>{item.privacydataremark}</td>
                  <td>{formatDate(item.privacyversiondate)}</td>

                  <td>
                    <Link
                      to={`/algorithminventoryupdate/${item.algorithminventoryid}`}
                    >
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteobject(item.algorithminventoryid)}
                    >
                      Delete
                    </button>
                    <Link to={`/algorithminventoryview/${item.projectcode}`}>
                      <button className="btn btn-view">View</button>
                    </Link>
                    <Link to={`/algorithminventorygraph/${item.projectcode}`}>
                      <button className="btn btn-view">Graph</button>
                    </Link>
                    <Link to={`/fishbone/${item.algorithminventoryid}`}>
                      <button className="btn btn-view">Fish Bone </button>
                    </Link>
                    <Link to={`/ganttchart`}>
                      <button className="btn btn-edit">Gantt Chart</button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Footer />
      </div>
    </div>
  );
};

export default AlgorithmInventoryTable;
