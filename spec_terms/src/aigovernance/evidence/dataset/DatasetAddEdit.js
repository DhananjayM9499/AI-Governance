import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../../pages/header";
import Footer from "../../pages/footer";
import * as API from "../../endpoint";
const initialState = {
  datasetname: "",
  datasetdescription: "",
};
const DatasetAddEdit = () => {
  const [state, setState] = useState(initialState);

  const { datasetname, datasetdescription } = state;

  const navigate = useNavigate();
  const { datasetid } = useParams();
  useEffect(() => {
    if (datasetid) {
      try {
        axios
          .get(API.VIEW_DATASET_API(datasetid))
          .then((resp) => setState({ ...resp.data[0] }))
          .catch((error) => {
            console.error(
              "An error occurred while fetching the Company Details:",
              error
            );
          });
      } catch (error) {
        console.error(
          "An error occurred while fetching the Company Details:",
          error
        );
      }
    }
  }, [datasetid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    try {
      setState({ ...state, [name]: value });
    } catch (error) {
      console.error("Error updating Company Details:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!datasetname || !datasetdescription) {
      toast.error("please provide the Input");
    } else {
      if (!datasetid) {
        axios
          .post(API.ADD_DATASET_API, {
            datasetname,
            datasetdescription,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Company Details added");
      } else {
        axios
          .put(API.UPDATE_DATASET_API(datasetid), {
            datasetname,
            datasetdescription,
          })
          .then(() => {
            setState({
              datasetname: "",
              datasetdescription: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Data Set Details Updated");
      }
      setTimeout(() => navigate("/dataset"), 500);
    }
  };
  return (
    <div style={{ fontFamily: "Poppins" }}>
      <Header />
      <h1>Data Set Types</h1>
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
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="datasetname"
            name="datasetname"
            placeholder="Enter the Data Set name"
            value={datasetname || ""}
            onChange={handleInputChange}
          />
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="datasetdescription"
            name="datasetdescription"
            placeholder="Enter the Data Set Description"
            value={datasetdescription || ""}
            onChange={handleInputChange}
          />

          <input type="submit" value={datasetid ? "Update" : "Save"} />
          <Link to="/dataset">
            <input
              className="btn btn-edit"
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

export default DatasetAddEdit;
