import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
const initialState = {
  subcontrolname: "",
  evidence: "",
  subcontrolwt: "",
};
const AddEditGS = () => {
  const [state, setState] = useState(initialState);

  const { subcontrolname, evidence, subcontrolwt } = state;

  const navigate = useNavigate();
  const { subcontrolid } = useParams();
  useEffect(() => {
    if (subcontrolid) {
      try {
        axios
          .get(API.GET_SPECIFIC_SUBCONTROL(subcontrolid))
          .then((resp) => setState({ ...resp.data[0] }))
          .catch((error) => {
            console.error(
              "An error occurred while fetching the Governance Control:",
              error
            );
          });
      } catch (error) {
        console.error(
          "An error occurred while fetching the Governance Control:",
          error
        );
      }
    }
  }, [subcontrolid]);

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

    if (!subcontrolname || !evidence || !subcontrolwt) {
      toast.error("please provide the Input");
    } else {
      if (!subcontrolid) {
        axios
          .post(API.ADD_SUBCONTROL_API, {
            subcontrolname,
            evidence,
            subcontrolwt,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Governance Control added");
      } else {
        axios
          .put(API.UPDATE_SUBCONTROL_API(subcontrolid), {
            subcontrolname,
            evidence,
            subcontrolwt,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Governance Control Updated");
      }
      setTimeout(() => navigate("/governancesubcontrol"), 500);
    }
  };
  return (
    <div>
      <Header />
      <h1>Governance Control</h1>
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
          <label htmlFor="subcontrolname">Governance Control :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="subcontrolname"
            name="subcontrolname"
            placeholder="Enter the Governance Control"
            value={subcontrolname || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="subcontrolwt"> Control Weight :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="subcontrolwt"
            name="subcontrolwt"
            placeholder="Enter the Weight of the Governance Control"
            value={subcontrolwt || ""}
            onChange={handleInputChange}
          />

          <label htmlFor="evidence">Evidence :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="evidence"
            name="evidence"
            placeholder="Enter the Evidence of the Governance Control"
            value={evidence || ""}
            onChange={handleInputChange}
          />

          <input type="submit" value={subcontrolid ? "Update" : "Save"} />

          <Link to="/governancesubcontrol">
            <input
              style={{ fontFamily: "Poppins", backgroundColor: "#3386ff" }}
              type="button"
              value="Go back"
            />
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddEditGS;
