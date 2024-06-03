import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddEdit.css";
import Header from "./header";
import Footer from "./footer";
const initialState = {
  termsetname: "",
};
const AddEdit = () => {
  const [state, setState] = useState(initialState);

  const { termsetname } = state;

  const navigate = useNavigate();

  const { termsetid } = useParams();
  useEffect(() => {
    if (termsetid) {
      try {
        axios
          .get(
            `https://staging.apilayer.valuevalidator.com/node-api/api/get/${termsetid}`
          )
          .then((resp) => setState({ ...resp.data[0] }))
          .catch((error) => {
            console.error(
              "An error occurred while fetching the term set:",
              error
            );
            // Handle the error here
          });
      } catch (error) {
        console.error("An error occurred while fetching the term set:", error);
        // Handle the error here
      }
    }
  }, [termsetid]);

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

    if (!termsetname) {
      toast.error("please provide the Input");
    } else {
      if (!termsetid) {
        axios
          .post(
            "https://staging.apilayer.valuevalidator.com/node-api/api/post",
            {
              termsetname,
            }
          )
          .then(() => {
            setState({ termsetname: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Term set Added");
      } else {
        axios
          .put(
            `https://staging.apilayer.valuevalidator.com/node-api/api/update/${termsetid}`,
            {
              termsetname,
            }
          )
          .then(() => {
            setState({ termsetname: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Term set Updated");
      }
      setTimeout(() => navigate("/home"), 500);
    }
  };

  return (
    <div>
      <Header />
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
          <label htmlFor="termsetname">Term Set</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="termsetname"
            name="termsetname"
            placeholder="Enter the term set"
            onChange={handleInputChange}
            value={termsetname || ""}
          />
          <input type="submit" value={termsetid ? "Update" : "Save"} />
          <Link to="/home">
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

export default AddEdit;
