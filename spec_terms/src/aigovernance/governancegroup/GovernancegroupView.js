import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";
const GovernancegroupView = () => {
  const [user, setUser] = useState({});
  const { groupid } = useParams();

  useEffect(() => {
    if (groupid) {
      axios
        .get(API.GET_SPECIFIC_GROUP(groupid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Project Phase:",
            error
          );
        });
    }
  }, [groupid]);

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="card-header">
        <p>Group Details</p>
      </div>
      <div className="container">
        <strong>Group ID : </strong>
        <span>{groupid}</span>
        <br />
        <br />
        <strong>Group Name : </strong>
        <span>{user.groupname}</span>
        <br />
        <br />
        <Link to="/governanceGroup">
          <div className="btn btn-edit">Go Back</div>
        </Link>
      </div>
    </div>
  );
};

export default GovernancegroupView;
