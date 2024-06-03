import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";

const ProjectAuditView = () => {
  const [user, setUser] = useState({});
  const { auditid } = useParams();

  useEffect(() => {
    if (auditid) {
      axios
        .get(API.GET_SPECIFIC_AUDITPLAN(auditid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Project Audit:",
            error
          );
        });
    }
  }, [auditid]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card-header">
        <p>Project Governance Audit Plan Details</p>
      </div>
      <div className="container">
        <strong>Audit ID : </strong>
        <span>{auditid}</span>
        <br />
        <br />
        <strong>Project Name : </strong>
        <span>{user.projectname}</span>
        <br />
        <br />
        <strong>Auditor(s) : </strong>
        <span>{user.auditors}</span>
        <br />
        <br />
        <strong>Auditee(s): </strong>
        <span>{user.auditees}</span>
        <br />
        <br />
        <strong>Audit Date : </strong>
        <span>{formatDate(user.auditdate)}</span>
        <br />
        <br />

        <Link to="/projectaudit">
          <div className="btn btn-edit">Go Back</div>
        </Link>
        <Link to={`/governancetestresult/${auditid}`}>
          <div className="btn btn-edit">Add Audit</div>
        </Link>
      </div>
    </div>
  );
};

export default ProjectAuditView;
