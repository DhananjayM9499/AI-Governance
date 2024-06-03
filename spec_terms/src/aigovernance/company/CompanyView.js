import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";

const CompanyView = () => {
  const [user, setUser] = useState({});
  const { companyid } = useParams();

  useEffect(() => {
    if (companyid) {
      axios
        .get(API.GET_SPECIFIC_COMPANY(companyid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Project Phase:",
            error
          );
        });
    }
  }, [companyid]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card-header">
        <p>Organization Details</p>
      </div>
      <div className="container">
        <strong>Organization ID : </strong>
        <span>{companyid}</span>
        <br />
        <br />
        <strong>Organization Name : </strong>
        <span>{user.organization}</span>
        <br />
        <br />
        <strong>Contact Name: </strong>
        <span>{user.contactname}</span>
        <br />
        <br />
        <strong>contact Email: </strong>
        <span>{user.contactemail}</span>
        <br />
        <br />
        <strong>Contact Phone : </strong>
        <span>{user.contactphone}</span>
        <br />
        <br />
        <Link to={`/project/${companyid}`}>
          <div className="btn btn-edit">Project Details</div>
        </Link>
        <Link to="/aigovernance">
          <div className="btn btn-edit">Go Back</div>
        </Link>
      </div>
    </div>
  );
};

export default CompanyView;
