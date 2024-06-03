import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "./AddEdit.css";
import Header from "./header";
import Footer from "./footer";
const initialState = {
  termname: "",
};
const AddEditTerms = () => {
  const [state, setState] = useState(initialState);

  const { termname } = state;

  const navigate = useNavigate();

  const { termid, termsetid } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  useEffect(() => {
    if (termid && termsetid) {
      try {
        axios
          .get(
            `https://staging.apilayer.valuevalidator.com/node-api/api/get/term/${termid}/${termsetid}`
          )
          .then((resp) => setState({ ...resp.data[0] }))
          .catch((error) => {
            // Handle error from the axios request
            console.error("Error fetching data:", error);
            // You might want to set an error state or handle the error in some way
          });
      } catch (error) {
        // Handle any synchronous errors that might occur within the useEffect
        console.error("Error in useEffect:", error);
        // You might want to set an error state or handle the error in some way
      }
    }
  }, [termid, termsetid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termname) {
      toast.error("please provide the Input");
    } else {
      if (!termid) {
        axios
          .post(
            `https://staging.apilayer.valuevalidator.com/node-api/api/post/term/${termsetid}`,
            {
              termname,
            }
          )
          .then(() => {
            setState({ termname: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Term Added");
      } else {
        axios
          .put(
            `https://staging.apilayer.valuevalidator.com/node-api/api/update/term/${termid}/${termsetid}`,
            {
              termname,
            }
          )
          .then(() => {
            setState({ termname: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Term Updated");
      }
      setTimeout(() => navigate(`/view/${termsetid}`), 500);
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
          <label htmlFor="termname">Term </label>
          <input
            style={{
              fontFamily: "Poppins",
            }}
            type="text"
            id="termname"
            name="termname"
            placeholder="Enter the term"
            onChange={handleInputChange}
            value={termname || " "}
          />
          <input type="submit" value={termid ? "Update" : "Save"} />
          <Link to={`/view/${termsetid}`}>
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

export default AddEditTerms;
