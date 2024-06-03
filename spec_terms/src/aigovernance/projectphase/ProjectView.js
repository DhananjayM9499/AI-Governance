import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProjectView.css";
import * as API from "../endpoint";
const ProjectView = () => {
  const [user, setUser] = useState({}); // Use "useState" instead of "setUser"
  const { phaseid } = useParams();

  useEffect(() => {
    if (phaseid) {
      axios
        .get(API.GET_SPECIFIC_PHASE(phaseid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Project Phase:",
            error
          );
        });
    }
  }, [phaseid]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card-header">
        <p>Phase Details</p>
      </div>
      <div className="container">
        <strong>Phase ID: </strong>
        <span>{phaseid}</span>
        <br />
        <br />
        <strong>Phase Name: </strong>
        <span>{user.phasename}</span>
        <br />
        <br />
        <strong>Description: </strong>
        <span>{user.description}</span>
        <br />
        <br />
        <Link to="/projectPhase">
          <div className="btn btn-edit">Go Back</div>
        </Link>
      </div>
    </div>
  );
};

export default ProjectView;
