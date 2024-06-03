import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as API from "../endpoint";
import Header from "../pages/header";
import Footer from "../pages/footer";
const initialState = {
  vendorname: " ",
  vendorcontact: " ",
  vendoremail: " ",
  stakeholdertype: "",
  category: "",
};

const VendorMasterAddEdit = () => {
  const [state, setState] = useState(initialState);
  console.log(API.GET_VENDORMASTER_API);

  const { vendorname, vendorcontact, vendoremail, stakeholdertype, category } =
    state;

  const navigate = useNavigate();

  const { vendorid } = useParams();

  useEffect(() => {
    if (vendorid) {
      axios
        .get(API.VIEW_VENDORMASTER_API(vendorid))
        .then((resp) => setState({ ...resp.data[0] }));
    }
  }, [vendorid]);

  const handlSubmit = (e) => {
    e.preventDefault();
    if (!vendorname) {
      toast.error("please provider value into each input field");
    } else {
      if (!vendorid) {
        axios
          .post(API.ADD_VENDORMASTER_API, {
            vendorname,
            vendorcontact,
            vendoremail,
            stakeholdertype,
            category,
          })
          .then(() => {
            setState({
              vendorname: " ",
              vendorcontact: " ",
              vendoremail: " ",
              stakeholdertype: "",
              category: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" added successfully");
      } else {
        axios
          .put(API.UPDATE_VENDORMASTER_API(vendorid), {
            vendorname,
            vendorcontact,
            vendoremail,
            stakeholdertype,
            category,
          })
          .then(() => {
            setState({
              vendorname: " ",
              vendorcontact: " ",
              vendoremail: " ",
              stakeholdertype: "",
              category: "",
            });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("update successfully");
      }
      setTimeout(() => navigate("/vendormaster"), 500);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div>
      <Header />
      <div style={{ marginTop: " 100px" }}>
        <form
          style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center",
            fontFamily: "Poppins",
          }}
          onSubmit={handlSubmit}
        >
          <label htmlFor="vendorname">Stake Holder Name</label>
          <input
            type="text"
            id="vendorname"
            name="vendorname"
            placeholder="Enter vendor name"
            value={vendorname || " "}
            onChange={handleInputChange}
          />
          <label htmlFor="vendorcontact">Stake Holder Contact</label>
          <input
            type="text"
            id="vendorcontact"
            name="vendorcontact"
            placeholder="Enter vendor contact"
            value={vendorcontact || " "}
            onChange={handleInputChange}
          />

          <label htmlFor="vendoremail">Stake Holder Email</label>
          <input
            type="text"
            id="vendoremail"
            name="vendoremail"
            placeholder="Enter vendor email"
            value={vendoremail || " "}
            onChange={handleInputChange}
          />
          <label htmlFor="vendoremail">Stake Holder Type</label>
          <select
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="stakeholdertype"
            name="stakeholdertype"
            placeholder="Enter Stake Holder Type"
            value={stakeholdertype || " "}
            onChange={handleInputChange}
          >
            <option style={{ fontFamily: "Poppins" }} value="">
              Select Stake Holder Type
            </option>
            <option style={{ fontFamily: "Poppins" }} value="Vendor">
              Vendor
            </option>
            <option style={{ fontFamily: "Poppins" }} value="Client">
              Client
            </option>
            <option style={{ fontFamily: "Poppins" }} value="Partner">
              Partner
            </option>
          </select>
          <label htmlFor="category">Stake Holder Category</label>
          <select
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="category"
            name="category"
            placeholder="Enter Stakeholder Category"
            value={category || " "}
            onChange={handleInputChange}
          >
            <option value="">Select Stakeholder Category</option>
            <option value="Investors">Investors</option>
            <option value="Employees">Employees</option>
            <option value="Customers">Customers</option>
            <option value="Suppliers">Suppliers</option>
            <option value="Communities">Communities</option>
            <option value="Governments">Governments</option>
            <option value="Trade Associations">Trade Associations</option>
          </select>

          <input
            type="submit"
            className="btn btn-save"
            value={vendorid ? "update" : "Save"}
          />
          <Link to="/vendormaster">
            <input className="btn btn-edit" type="button" value="go back" />
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default VendorMasterAddEdit;
