import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
const initialState = {
  groupname: "",
};
const AddEditGovernancegroup = () => {
  const [state, setState] = useState(initialState);

  const { groupname } = state;

  const navigate = useNavigate();
  const { groupid } = useParams();
  useEffect(() => {
    if (groupid) {
      try {
        axios
          .get(API.GET_SPECIFIC_GROUP(groupid))
          .then((resp) => setState({ ...resp.data[0] }))
          .catch((error) => {
            console.error(
              "An error occurred while fetching the Governance Group:",
              error
            );
          });
      } catch (error) {
        console.error(
          "An error occurred while fetching the Governance Group:",
          error
        );
      }
    }
  }, [groupid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    try {
      setState({ ...state, [name]: value });
    } catch (error) {
      console.error("Error updating state:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupname) {
      toast.error("please provide the Input");
    } else {
      if (!groupid) {
        axios
          .post(API.ADD_GROUP_API, {
            groupname,
          })
          .then(() => {
            setState({ groupname: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Governance Group added");
      } else {
        axios
          .put(API.UPDATE_GROUP_API(groupid), {
            groupname,
          })
          .then(() => {
            setState({ groupname: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Governance Group Updated");
      }
      setTimeout(() => navigate("/governanceGroup"), 500);
    }
  };
  return (
    <div>
      <Header />
      <h1>Governance Group Details</h1>
      <div style={{ marginTop: "100px" }}>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center",
          }}
          onSubmit={handleSubmit}
        >
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="groupname"
            name="groupname"
            placeholder="Enter the Governance Group Name"
            value={groupname || ""}
            onChange={handleInputChange}
          />
          <input type="submit" value={groupid ? "Update" : "Save"} />
          <Link to="/governanceGroup">
            <input
              style={{ fontFamily: "Poppins", backgroundColor: "#3386ff" }}
              type="button"
              value="Go back"
            ></input>
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddEditGovernancegroup;
