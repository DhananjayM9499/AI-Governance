import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";

const GovernancesubcontrolView = () => {
  const [user, setUser] = useState({});
  const { subcontrolid } = useParams();

  useEffect(() => {
    if (subcontrolid) {
      axios
        .get(API.GET_SPECIFIC_SUBCONTROL(subcontrolid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Governance Control:",
            error
          );
        });
    }
  }, [subcontrolid]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card-header">
        <p>Control Details</p>
      </div>
      <div className="container">
        <strong>Control ID : </strong>
        <span>{subcontrolid}</span>
        <br />
        <br />
        <strong>Control Name : </strong>
        <span>{user.subcontrolname}</span>
        <br />
        <br />
        <strong>Description : </strong>
        <span>{user.evidence}</span>
        <br />
        <br />
        <Link to="/governancesubcontrol">
          <div className="btn btn-edit">Go Back</div>
        </Link>
      </div>
    </div>
  );
};

export default GovernancesubcontrolView;
