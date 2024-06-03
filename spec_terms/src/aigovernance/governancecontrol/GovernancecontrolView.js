import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";

const GovernancecontrolView = () => {
  const [user, setUser] = useState({});
  const { controlid } = useParams();

  useEffect(() => {
    if (controlid) {
      axios
        .get(API.GET_SPECIFIC_CONTROL(controlid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Project Phase:",
            error
          );
        });
    }
  }, [controlid]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card-header">
        <p>Governance Sub-Control Details</p>
      </div>
      <div className="container">
        <strong>Sub-Control ID : </strong>
        <span>{controlid}</span>
        <br />
        <br />
        <strong>Sub-Control Name : </strong>
        <span>{user.controlname}</span>
        <br />
        <br />
        <strong>Governance Thrust Area : </strong>
        <span>{user.thrustarea}</span>
        <br />
        <br />

        <strong>Control ID : </strong>
        <span>{user.subcontrolid}</span>
        <br />
        <br />
        <strong>Group ID : </strong>
        <span>{user.groupid}</span>
        <br />
        <br />
        <Link to="/governancecontrol">
          <div className="btn btn-edit">Go Back</div>
        </Link>
      </div>
    </div>
  );
};

export default GovernancecontrolView;
