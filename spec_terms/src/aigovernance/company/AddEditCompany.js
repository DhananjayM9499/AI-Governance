import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
const initialState = {
  organization: "",
  contactname: "",
  contactemail: "",
  contactphone: "",
};
const AddEditCompany = () => {
  const [state, setState] = useState(initialState);

  const { organization, contactname, contactemail, contactphone } = state;

  const navigate = useNavigate();
  const { companyid } = useParams();
  useEffect(() => {
    console.log("USeeffect got triggered");
    if (companyid) {
      try {
        axios
          .get(API.GET_SPECIFIC_COMPANY(companyid))
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
  }, [companyid]);

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

    if (!organization || !contactname || !contactemail || !contactphone) {
      toast.error("please provide the Input");
    } else {
      if (!companyid) {
        axios
          .post(API.ADD_COMPANY_API, {
            organization,
            contactname,
            contactemail,
            contactphone,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Company Details added");
      } else {
        axios
          .put(API.UPDATE_COMPANY_API(companyid), {
            organization,
            contactname,
            contactemail,
            contactphone,
          })
          .then(() => {
            setState({
              organization: "",
              contactname: "",
              contactemail: "",
              contactphone: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Company Details Updated");
      }
      setTimeout(() => navigate("/aigovernance"), 500);
    }
  };
  return (
    <div style={{ fontFamily: "Poppins" }}>
      <Header />
      <h1>Organization Details</h1>
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
          <label htmlFor="organization">Organization</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="organization"
            name="organization"
            placeholder="Enter the Company Name"
            value={organization || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="contactname">Contact Name</label>

          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="contactname"
            name="contactname"
            placeholder="Enter the Contact Name"
            value={contactname || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="contactemail">Contact Email</label>

          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="contactemail"
            name="contactemail"
            placeholder="Enter the Contact Email"
            value={contactemail || ""}
            onChange={handleInputChange}
          />
          <label htmlFor="contactphone">Contact Phone</label>

          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="contactphone"
            name="contactphone"
            placeholder="Enter the Contact Phone"
            value={contactphone || ""}
            onChange={handleInputChange}
          />

          <input type="submit" value={companyid ? "Update" : "Save"} />
          <Link to="/aigovernance">
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

export default AddEditCompany;
