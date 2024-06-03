import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";

const View = () => {
  const [user, setUser] = useState({});
  console.log(API.GET_OBJECTTYPE_API);

  const { vendorid } = useParams();

  useEffect(() => {
    axios
      .get(API.VIEW_VENDORMASTER_API(vendorid))
      .then((resp) => setUser({ ...resp.data[0] }));
  }, [vendorid]);

  return (
    <div>
      <Header />
      <div style={{ marginTop: "150px" }}>
        <div className="card">
          <div className="card-header">
            <p>Stake Holder</p>
          </div>
          <div className="container">
            <strong>ID : </strong>
            <span>{user.vendorid}</span>
            <br />
            <br />
            <strong>Stake Holder Name : </strong>
            <span>{user.vendorname}</span>
            <br />
            <br />
            <strong>Stake Holder Contact : </strong>
            <span>{user.vendorcontact}</span>
            <br />
            <br />
            <strong>Stake Holder Email:</strong>
            <span>{user.vendoremail}</span>
            <br />
            <br />
            <Link to="/vendormaster">
              <button className="btn btn-edit">Go Back</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default View;
