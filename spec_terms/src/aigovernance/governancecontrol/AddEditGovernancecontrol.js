import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
const AddEditGovernancecontrol = () => {
  const navigate = useNavigate();
  const { controlid } = useParams();

  const [control, setcontrol] = useState({
    controlname: "",
    thrustarea: "",
    subcontrolid: "",
    groupid: "",
    controlwt: "",
  });
  const [controlnames, setcontrolnames] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [thrustNames, SetThrustNames] = useState([]);

  const { controlname, subcontrolid, groupid, thrustarea, controlwt } = control;

  useEffect(() => {
    if (controlid) {
      axios
        .get(API.GET_SPECIFIC_CONTROL(controlid))
        .then((response) => {
          const controlData = response.data[0];
          setcontrol(controlData || {});
        })
        .catch((error) => {
          console.error("Error fetching Governance Sub-Control:", error);
        });
    }

    axios
      .get(API.GET_SUBCONTROL_API)
      .then((response) => {
        setcontrolnames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Sub-Control Names:", error);
      });

    axios
      .get(API.GET_THRUST_AREA)
      .then((response) => {
        SetThrustNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Thrust Area", error);
      });

    axios
      .get(API.GET_GROUP_API)
      .then((response) => {
        setGroupNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching group names:", error);
      });
  }, [controlid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setcontrol({ ...control, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !controlname ||
      !subcontrolid ||
      !groupid ||
      !thrustarea ||
      !controlwt
    ) {
      toast.error("Please provide all required information");
    } else {
      const apiEndpoint = controlid
        ? API.UPDATE_CONTROL_API(controlid)
        : API.ADD_CONTROL_API;

      const requestData = controlid
        ? { controlname, subcontrolid, groupid, thrustarea, controlwt }
        : { controlname, subcontrolid, groupid, controlwt };

      const successMessage = controlid
        ? "Governance Sub-Control Updated Successfully"
        : "Governance Sub-Control Added Successfully";

      axios
        .request({
          method: controlid ? "PUT" : "POST",
          url: apiEndpoint,
          data: requestData,
        })
        .then(() => {
          toast.success(successMessage);
          navigate("/governancecontrol");
        })
        .catch((err) => {
          toast.error(err.response.data);
        });
    }
  };

  return (
    <div>
      <Header />
      <h1>Governance Sub-Control Details</h1>
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
          <label htmlFor="controlname">Sub-Control Name:</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="controlname"
            name="controlname"
            placeholder="Enter the Sub-Control Name"
            value={controlname}
            onChange={handleInputChange}
          />

          <label htmlFor="thrustarea">Thrust Area:</label>
          <select
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="thrustarea"
            name="thrustarea"
            value={thrustarea}
            onChange={handleInputChange}
          >
            <option value="">Select Thrust Area</option>
            {thrustNames.map((thrust) => (
              <option key={thrust.thrustid} value={thrust.thrustarea}>
                {thrust.thrustarea}
              </option>
            ))}
          </select>

          <label htmlFor="subcontrolid">Governance Control:</label>
          <select
            style={{ fontFamily: "Poppins" }}
            id="subcontrolid"
            name="subcontrolid"
            value={subcontrolid}
            onChange={handleInputChange}
          >
            <option value="">Select Governance Control</option>
            {controlnames.map((subcontrol) => (
              <option
                key={subcontrol.subcontrolid}
                value={subcontrol.subcontrolid}
              >
                {subcontrol.subcontrolname}
              </option>
            ))}
          </select>

          <label htmlFor="groupid">Group Name:</label>
          <select
            style={{ fontFamily: "Poppins" }}
            id="groupid"
            name="groupid"
            value={groupid}
            onChange={handleInputChange}
          >
            <option value="">Select Group Name</option>
            {groupNames.map((group) => (
              <option key={group.groupid} value={group.groupid}>
                {group.groupname}
              </option>
            ))}
          </select>

          <label htmlFor="controlwt">Control Weight:</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="controlwt"
            name="controlwt"
            placeholder="Enter the control Weight "
            value={controlwt}
            onChange={handleInputChange}
          />

          <input type="submit" value={controlid ? "Update" : "Save"} />

          <Link to="/governancecontrol">
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

export default AddEditGovernancecontrol;
