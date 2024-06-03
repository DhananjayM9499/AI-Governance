import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";
import Header from "../pages/header";
import Footer from "../pages/footer";

const ChecklistTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { algorithminventoryid } = useParams();

  const loadData = async () => {
    const response = await axios.get(
      API.GET_SPECIFIC_CHECKLIST(algorithminventoryid)
    );
    setData(response.data);
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
  useEffect(() => {
    loadData();
  }, []);

  const deleteChecklist = (checklistid) => {
    if (window.confirm("Are you sure you want to delete")) {
      axios.delete(API.DELETE_CHECKLIST_API(checklistid));
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
      <div style={{ marginTop: "150px" }}>
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No</th>

              <th style={{ textAlign: "center" }}>Organization</th>

              <th style={{ textAlign: "center" }}>Project</th>
              <th style={{ textAlign: "center" }}>Project Code</th>
              <th style={{ textAlign: "center" }}>Responsibility Group</th>
              <th style={{ textAlign: "center" }}>Responsibility Center</th>
              <th style={{ textAlign: "center" }}>Object Type</th>
              <th style={{ textAlign: "center" }}>Object</th>
              <th style={{ textAlign: "center" }}>Code Name</th>
              <th style={{ textAlign: "center" }}>Theme</th>
              <th style={{ textAlign: "center" }}>Phase</th>
              <th style={{ textAlign: "center" }}>Activity Group</th>
              <th style={{ textAlign: "center" }}>Activity</th>
              <th style={{ textAlign: "center" }}>Expected Evidence</th>
              <th style={{ textAlign: "center" }}>Remark</th>
              <th style={{ textAlign: "center" }}>Percentage Completion</th>
              <th style={{ textAlign: "center" }}>Actual Evidence</th>
              <th style={{ textAlign: "center" }}>Status</th>
              <th style={{ textAlign: "center" }}>Plan Start Date</th>
              <th style={{ textAlign: "center" }}>Plan End Date</th>
              <th style={{ textAlign: "center" }}>Actual Start Date</th>
              <th style={{ textAlign: "center" }}>Actual End Date</th>
              <th style={{ textAlign: "center" }}>Activity Code</th>

              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>

                <td>{item.organization}</td>
                <td>{item.projectname}</td>
                <td>{item.projectcode}</td>
                <td>{item.responsibilitygroup}</td>
                <td>{item.responsibilitycenter}</td>
                <td>{item.objecttype}</td>
                <td>{item.object}</td>
                <td>{item.codename}</td>
                <td>{item.themename}</td>
                <td>{item.phase}</td>
                <td>{item.activitygroup}</td>
                <td>{item.activity}</td>
                <td>{item.expectedevidence || "-"}</td>
                <td>{item.remark}</td>
                <td>{item.percentagecompletion}</td>
                <td>{item.actualevidence}</td>
                <td>{item.status}</td>
                <td>{formatDate(item.planstartdate)}</td>
                <td>{formatDate(item.planenddate)}</td>
                <td>{formatDate(item.actualstartdate)}</td>
                <td>{formatDate(item.actualenddate)}</td>
                <td>{item.activitycode}</td>

                <td>
                  <Link to={`/activitygroupupdate/${item.checklistid}`}>
                    <button className="btn btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteChecklist(item.checklistid)}
                  >
                    Delete
                  </button>
                  <Link to={`/ganttchart`}>
                    <button className="btn btn-view">Gantt Chart</button>
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

export default ChecklistTable;
