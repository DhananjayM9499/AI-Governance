import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";

const EvidenceTable = () => {
  const [evidenceList, setEvidenceList] = useState([]);

  const fetchEvidenceData = async () => {
    try {
      const response = await axios.get(API.GET_DATALINEAGE_API);
      setEvidenceList(response.data);
    } catch (error) {
      console.error("Error fetching evidence data:", error.message);
    }
  };

  const deleteEvidence = async (datalineageid) => {
    try {
      if (window.confirm("Are you sure you want to delete?")) {
        await axios.delete(API.DELETE_DATALINEAGE_API(datalineageid));
        console.log("Success: Deleted successfully");
        fetchEvidenceData(); // No need for setTimeout
      }
    } catch (error) {
      console.error("Error deleting evidence:", error.message);
    }
  };

  useEffect(() => {
    fetchEvidenceData();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ marginTop: "15px", marginBottom: "3cm" }}>
        <Link to="/adddatalineage">
          <center>
            <button className="btn btn-contact">Evidence</button>
          </center>
        </Link>

        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No</th>
              <th style={{ textAlign: "center" }}>Organization</th>
              <th style={{ textAlign: "center" }}>Responsibility Group</th>
              <th style={{ textAlign: "center" }}>Project Name</th>
              <th style={{ textAlign: "center" }}>Evidence Remark</th>
              <th style={{ textAlign: "center" }}>Evidence Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {evidenceList.map((evidence, index) => (
              <tr key={evidence.datalineageid}>
                <th scope="row">{index + 1}</th>
                <td>{evidence.organization}</td>
                <td>{evidence.responsibilitygroup}</td>
                <td>{evidence.projectname}</td>
                <td>{evidence.evidenceremark}</td>
                <td>{evidence.evidencestatus}</td>
                <td>
                  {/* <Link to={/datalineageupdate/${evidence.datalineageid}}>
                  <button className="btn btn-edit">Edit</button>
                </Link> */}
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteEvidence(evidence.datalineageid)}
                  >
                    Delete
                  </button>
                  <Link to={`/datalineageview/${evidence.datalineageid}`}>
                    <button className="btn btn-view">View</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default EvidenceTable;
