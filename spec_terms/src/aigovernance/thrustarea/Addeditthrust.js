import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
const initialState = {
  thrustarea: "",
  groupname: "",
};
const Addeditthrust = () => {
  const [state, setState] = useState(initialState);

  const { thrustarea, groupname } = state;

  const navigate = useNavigate();
  const { thrustid } = useParams();
  useEffect(() => {
    if (thrustid) {
      try {
        axios
          .get(API.GET_SPECIFIC_THRUST(thrustid))
          .then((resp) => {
            console.log("Response Data:", resp.data);
            setState({ ...resp.data[0] });
          })
          .catch((error) => {
            console.error(
              "An error occurred while fetching the Thrust Area:",
              error
            );
          });
      } catch (error) {
        console.error(
          "An error occurred while fetching the Thrust Area:",
          error
        );
      }
    }
  }, [thrustid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    try {
      setState({ ...state, [name]: value });
    } catch (error) {
      console.error("Error updating Thrust Area:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!thrustarea) {
      toast.error("please provide the Input");
    } else {
      if (!thrustid) {
        axios
          .post(API.ADD_THRUSTAREA_API, {
            thrustarea,
            groupname,
          })
          .then(() => {
            setState({ thrustarea: "", groupname: "" });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Thrust Area added");
      } else {
        axios
          .put(API.UPDATE_THRUST_AREA(thrustid), {
            thrustarea,
            groupname,
          })
          .then(() => {
            setState({
              initialState,
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Thrust Area Updated");
      }
      setTimeout(() => navigate("/thrustarea"), 500);
    }
  };
  return (
    <div>
      <Header />
      <h1>Thrust Area</h1>
      <div style={{ marginTop: "auto" }}>
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
          <label htmlFor="thrutarea">Thrust Area</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="thrustarea"
            name="thrustarea"
            placeholder="Enter the Thrustarea"
            value={thrustarea || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="groupname">Group Name</label>

          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="groupname"
            name="groupname"
            placeholder="Enter the Group Name"
            value={groupname || ""}
            onChange={handleInputChange}
          />

          <input type="submit" value={thrustid ? "Update" : "Save"} />
          <Link to="/thrustarea">
            <input
              type="button"
              value="Go back"
              className="btn btn-edit"
            ></input>
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Addeditthrust;
