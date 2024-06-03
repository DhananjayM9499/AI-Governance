import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";

const Governancetestresultview = () => {
  const [user, setUser] = useState({});
  const { resultid } = useParams();

  useEffect(() => {
    if (resultid) {
      axios
        .get(API.GET_SPECIFIC_PROJECTAUDIT(resultid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Test result:",
            error
          );
        });
    }
  }, [resultid]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card-header">
        <p>Governance Test Result </p>
      </div>
      <div className="container">
        <strong>Result ID : </strong>
        <span>{resultid}</span>
        <br />
        <br />
        <strong>control ID : </strong>
        <span>{user.controlid}</span>
        <br />
        <br />
        <strong>subcontrol ID : </strong>
        <span>{user.subcontrolid}</span>
        <br />
        <br />
        <strong>Result Status : </strong>
        <span>{user.status}</span>
        <br />
        <br />
        <strong>Remarks : </strong>
        <span>{user.remarks}</span>
        <br />
        <br />
        <strong>Document link : </strong>
        <span>{user.documentupload}</span>
        <br />
        <br />
        <Link to={`/governancetestresult/${user.auditid}`}>
          <div className="btn btn-edit">Go Back</div>
        </Link>
      </div>
    </div>
  );
};

export default Governancetestresultview;
