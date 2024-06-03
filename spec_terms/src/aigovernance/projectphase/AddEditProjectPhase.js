import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddEditProjectPhase.css";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";

const initialState = {
  phasename: "",
  description: "",
};
const AddEditProjectPhase = () => {
  const [state, setState] = useState(initialState);

  const { phasename, description } = state;

  const navigate = useNavigate();
  const { phaseid } = useParams();
  useEffect(() => {
    if (phaseid) {
      try {
        axios
          .get(API.GET_SPECIFIC_PHASE(phaseid))
          .then((resp) => setState({ ...resp.data[0] }))
          .catch((error) => {
            console.error(
              "An error occurred while fetching the Project Phase:",
              error
            );
          });
      } catch (error) {
        console.error(
          "An error occurred while fetching the Project Phase:",
          error
        );
      }
    }
  }, [phaseid]);

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

    if (!phasename || !description) {
      toast.error("please provide the Input");
    } else {
      if (!phaseid) {
        axios
          .post(API.ADD_PHASE_API, {
            phasename,
            description,
          })
          .then(() => {
            setState({ phasename: "", description: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Project Phase added");
      } else {
        axios
          .put(API.UPDATE_PHASE_API(phaseid), {
            phasename,
            description,
          })
          .then(() => {
            setState({ phasename: "", description: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Phase Updated");
      }
      setTimeout(() => navigate("/projectPhase"), 500);
    }
  };

  return (
    <div>
      <Header />
      <h1>Project Phase Details</h1>
      <div style={{ marginTop: "0px" }}>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "auto",
            padding: "15px",
            maxWidth: "300px",
            alignContent: "center",
          }}
          onSubmit={handleSubmit}
        >
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="phasename"
            name="phasename"
            placeholder="Enter the Project Phase"
            value={phasename || ""}
            onChange={handleInputChange}
          />
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="description"
            name="description"
            placeholder="Enter the Description of the Project Phase"
            value={description || ""}
            onChange={handleInputChange}
          />
          <input type="submit" value={phaseid ? "Update" : "Save"} />
          <Link to="/projectPhase">
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

export default AddEditProjectPhase;
