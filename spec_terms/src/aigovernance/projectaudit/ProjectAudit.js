import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../pages/header";
import Footer from "../pages/footer";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../endpoint";

const ProjectAudit = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const { projectid, companyid, resultid } = useParams();
  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_RESULT_AUDITPLAN(resultid));
      const sortedData = response.data.sort(
        (a, b) => b.projectid - a.projectid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  const loadProjectData = async () => {
    try {
      const response = await axios.get(API.GET_AUDITPLAN_API);
      const sortedData = response.data.sort(
        (a, b) => b.projectid - a.projectid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  useEffect(() => {
    if (companyid && resultid && projectid) {
      loadData();
    } else {
      loadProjectData();
    }
  }, []);

  const deleteprojectaudit = async (auditid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(API.DELETE_AUDITPLAN_API(auditid));
        if (response.status === 200) {
          toast.success("Project Audit Deleted Successfully");
          if (companyid && resultid && projectid) {
            loadData();
          } else {
            loadProjectData();
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Cannot delete Details there are associates present .");
        } else {
          console.log(error);
          toast.error("An error occurred while deleting Project Audit.");
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
        {companyid ? (
          <Link to={`/projectauditAdd/${projectid}/${companyid}/${resultid}`}>
            <button className="btn btn-contact">
              Add Project Governance Audit Plan
            </button>
          </Link>
        ) : (
          <Link to="/directprojectauditAdd">
            <button className="btn btn-contact">Plan Audit</button>
          </Link>
        )}
        <table className="styled-table">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Project Name</th>
              <th style={{ textAlign: "center" }}>Auditor</th>
              <th style={{ textAlign: "center" }}>Auditees</th>
              <th style={{ textAlign: "center" }}>Audit Scope</th>
              <th style={{ textAlign: "center" }}>Audit Date</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + indexOfFirstItem + 1}</th>
                  <td>{item.projectname}</td>
                  <td>{item.auditors}</td>
                  <td>{item.auditees}</td>
                  <td>{item.auditscope}</td>
                  <td>{formatDate(item.auditdate)}</td>{" "}
                  <td>
                    <Link
                      to={`/projectauditEdit/${item.auditid}/${projectid}/${companyid}`}
                    >
                      <button className="btn btn-edit">Edit</button>
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={() => deleteprojectaudit(item.auditid)}
                    >
                      Delete
                    </button>
                    <Link
                      to={`/AddGovernancetestresult/${item.auditid}/${projectid}/${companyid}/${resultid}`}
                    >
                      <button className="btn btn-view">Audit</button>
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

export default ProjectAudit;
