import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
const initialState = {
  auditreferencelink: "",
  auditremark: "",
  auditupload: "",
  auditstatus: "",
  auditscore: "",
};

const AddEditGovernancetestresult = () => {
  const [state, setState] = useState(initialState);
  const [subControlNames, setSubControlNames] = useState([]);
  const [controlNames, setControlNames] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [user, setUser] = useState({});
  const [company, setCompany] = useState([]);
  const [project, setProjects] = useState({});
  const [data, setData] = useState([]);
  const [governance, setGovernance] = useState([]);
  const [assess, setassess] = useState([]);

  const {
    auditreferencelink,
    auditremark,
    auditupload,
    auditstatus,
    auditscore,
  } = state;
  const { resultid, companyid, projectid, auditid } = useParams();
  const navigate = useNavigate();

  /**********To Get The Thrust Area*********** */
  const loadData = async () => {
    try {
      const response = await axios.get(API.GET_THRUST_AREA);
      const sortedData = response.data.sort(
        (a, b) => b.companyid - a.companyid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  useEffect(() => {
    if (resultid) {
      try {
        axios.get(API.GET_RESULT_EVIDENCE(resultid)).then((resp) => {
          if (resp.data.length > 0) {
            setGovernance({ ...resp.data[0] });
            // assuming the evidence data is in the same format
          }
        });
      } catch (error) {
        console.error(
          "An error occurred while fetching the Governance Audit:",
          error
        );
      }
    }
    loadData();
    axios
      .get(API.GET_SPECIFIC_COMPANY(companyid))
      .then((resp) => setCompany({ ...resp.data[0] }))
      .catch((error) => {
        console.error(
          "An error occurred while fetching the Project Phase:",
          error
        );
      });

    axios
      .get(API.GET_ASSESSMENTS(resultid))
      .then((resp) => setassess({ ...resp.data[0] }))
      .catch((error) => {
        console.error(
          "An error occurred while fetching the Project Phase:",
          error
        );
      });

    axios
      .get(API.GET_SPECIFIC_PROJECT(projectid))
      .then((resp) => setProjects({ ...resp.data[0] }))
      .catch((error) => {
        console.error(
          "An error occured while fetching the Project Details:",
          error
        );
      });

    if (auditid) {
      axios
        .get(API.GET_SPECIFIC_AUDITPLAN(auditid))
        .then((resp) => setUser({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Project Audit:",
            error
          );
        });
    }

    axios
      .get(API.GET_SUBCONTROL_API)
      .then((response) => {
        setSubControlNames(response.data);
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching subcontrol names:",
          error
        );
      });

    axios
      .get(API.GET_CONTROL_API)
      .then((response) => {
        setControlNames(response.data);
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching subcontrol names:",
          error
        );
      });

    axios
      .get(API.GET_GROUP_API)
      .then((response) => {
        setGroupNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching group names:", error);
      });
  }, [resultid, auditid, companyid, projectid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    try {
      setState({ ...state, [name]: value });
    } catch (error) {
      console.error("Error updating Audit Details:", error);
    }
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!auditreferencelink) {
      toast.error("please provide the Input");
    } else {
      // if (!auditreferencelink) {
      axios
        .put(API.ADD_PROJECTAUDIT_API(resultid), {
          auditreferencelink,
          auditremark,
          auditupload,
          auditstatus,
          auditscore,
        })
        .then(() => {
          setState({ initialState });
        })
        .catch((err) => toast.error(err.response.data));
      toast.success(" Audit added");
      // } else {
      axios
        .put(API.UPDATE_PROJECTAUDIT_API(resultid), {
          auditreferencelink,
          auditremark,
          auditupload,
          auditstatus,
          auditscore,
        })
        .then(() => {
          setState({ initialState });
        })
        .catch((err) => toast.error(err.response.data));
      toast.success("Audit  Updated");
      // }
      setTimeout(
        () =>
          navigate(
            `/governancetestresult/${resultid}/${projectid}/${companyid}/${auditid}`
          ),
        500
      );
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: "flex", marginTop: "10px", font: "Poppins" }}>
        {/* Master Section - Company and Project Details */}
        <div
          style={{
            border: "3px solid #ccc",
            padding: "5px",
            flex: 1,
            display: "flex",
          }}
        >
          {/* Company Details */}
          <div style={{ flex: 1, marginRight: "50px", textAlign: "left" }}>
            <h2>{company.organization}</h2>
            {/* Display company details here */}
            <div>
              <p>Contact Person : {company.contactname}</p>
              <p>Contact Email : {company.contactemail}</p>
              <p>Contact phone : {company.contactphone}</p>
              {/* Add other company details like contact name, email, phone */}
            </div>
          </div>

          {/* Vertical partition */}
          <div
            style={{
              width: "10px",
              background: "#ccc",
              alignContent: "end",
            }}
          ></div>
          {/* Project Details */}
          <div style={{ flex: 1, paddingLeft: "20px", textAlign: "left" }}>
            <h2>Project Details</h2>
            {/* Display project details here */}
            <div>
              <p>Project Name : {project.projectname}</p>
              <p>Start Date : {formatDate(project.fromdate)}</p>
              <p>End Date : {formatDate(project.todate)}</p>

              {/* Add other project details like start date, end date */}
            </div>
          </div>
          <div
            style={{
              width: "10px",
              background: "#ccc",
              alignContent: "end",
            }}
          ></div>

          {/* Project Details */}

          <div style={{ flex: 1, paddingLeft: "10px", textAlign: "left" }}>
            <h2>Audit Plan</h2>
            {/* Display project details here */}
            {user.auditors ||
            user.auditees ||
            user.auditscope ||
            user.auditdate ? (
              <div>
                <p>Auditor: {user.auditors}</p>
                <p>Auditees: {user.auditees}</p>
                <p>Audit Scope: {user.auditscope}</p>
                <p>Audit Date: {formatDate(user.auditdate)}</p>
                {/* Add other project details like start date, end date */}
              </div>
            ) : (
              <p>No audit plan data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Section - Governance Test Results Form */}
      <div style={{ marginTop: "5px", padding: "20px" }}>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "0px",
          }}
          onSubmit={handleSubmit}
        >
          {/* Governance Test Results Form */}
          <div style={{ marginBottom: "20px" }}>
            {/* DetailsForm component with controlNames, controlnames, etc. */}
            <DetailsForm
              controlNames={controlNames}
              subControlNames={subControlNames}
              state={state}
              groupNames={groupNames}
              data={data}
              handleInputChange={handleInputChange}
              governance={governance}
              assess={assess}
            />
          </div>

          {/* Master Form Buttons */}
          <div>
            <input type="submit" value={"Save"} />
            <Link
              to={`/governancetestresult/${resultid}/${auditid}/${projectid}/${companyid}`}
            >
              <button
                className="btn edit-btn
                "
                type="button"
              >
                {" "}
                Go back
              </button>
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

const DetailsForm = ({ state, handleInputChange, assess, governance }) => {
  const isAuditPlanAvailable = governance && Object.keys(governance).length > 0;
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        {/* Details Form Inputs */}
        <div>
          <label>Governance Group :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="groupid"
            name="groupid"
            value={governance.groupname}
            readOnly
          ></input>

          <br />
        </div>
        <div>
          <label>Governance Thrust Area :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="thrustarea"
            name="thrustarea"
            value={governance.thrustarea}
            readOnly
          ></input>
        </div>
        <div>
          <label htmlFor="controlid">Control Name:</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="controlid"
            name="controlid"
            value={governance.controlname}
            readOnly
          ></input>
        </div>
        <div>
          <label>Control Weight : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="controlwt"
            name="controlwt"
            value={governance.controlwt}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="subcontrolid">Sub-Control Name:</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="subcontrolid"
            name="subcontrolid"
            value={governance.subcontrolname}
            readOnly
          ></input>
        </div>
        <div>
          <label>Sub-Control Weight : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="subcontrolwt"
            name="subcontrolwt"
            value={governance.subcontrolwt}
            readOnly
          />
        </div>
      </div>
      {/* Divider */}
      <hr style={{ margin: "30px 0px ", border: "3px solid #ccc" }} />
      {/*********Evidences*********** */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr ",
          gap: "40px",
        }}
      >
        <div>
          <label>Evidence Link :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="referencelink"
            name="evidencereferencelink"
            value={governance.evidencereferencelink}
            readOnly
          ></input>
          <br />
        </div>
        <div>
          <label>Evidence Remark :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="evidenceremark"
            name="evidenceremark"
            value={governance.evidenceremark}
            readOnly
          ></input>
        </div>
        <div>
          <label>Evidence Upload :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="evidenceupload"
            name="evidenceupload"
            value={governance.evidenceupload}
            readOnly
          ></input>
        </div>
        <div>
          <label>Evidence Status : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="evidencestatus"
            name="evidencestatus"
            value={governance.evidencestatus}
            readOnly
          />
        </div>
      </div>
      {/***********Assesment******* */}

      <hr style={{ margin: "25px 0px ", border: "3px solid #ccc" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr ",
          gap: "40px",
        }}
      >
        <div>
          <label>Assesment Link :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="assessmentreferencelink"
            name="assessmentreferencelink"
            value={assess.assessmentreferencelink}
            readOnly
          ></input>
          <br />
        </div>
        <div>
          <label>Assesment Remark :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="assessmentremark"
            name="assessmentremark"
            value={assess.assessmentremark}
            readOnly
          ></input>
        </div>
        <div>
          <label>Assesment Upload :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="assessmentupload"
            name="assessmentupload"
            value={assess.assessmentupload}
            readOnly
          ></input>
        </div>
        <div>
          <label>Assesment Status : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="assessmentstatus"
            name="assessmentstatus"
            value={assess.assessmentstatus}
            readOnly
          />
        </div>
        <div>
          <label>Assesment Score : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="assessmentscore"
            name="assessmentscore"
            value={assess.assessmentscore}
            readOnly
          />
        </div>
      </div>

      {/**************************************
       *
       *
       *
       * Audit Details
       *
       *
       *
       *
       */}
      <hr style={{ margin: "25px 0px ", border: "3px solid #ccc" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        <div>
          <label>Audit Reference Link :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="auditreferencelink"
            name="auditreferencelink"
            placeholder="Enter the Audit Reference Link"
            value={state.auditreferencelink || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Audit Upload : </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <br />
            <input
              style={{ fontFamily: "Poppins", marginRight: "10px" }}
              type="text"
              id="auditupload"
              name="auditupload"
              placeholder="Enter the Audit upload link"
              value={state.auditupload || ""}
              onChange={handleInputChange}
            />
            <div style={{ position: "relative" }}></div>
            <a
              href="https://drive.google.com/drive/folders/1u_OGWeIobTWHPf9umERPeptEPwWE12Pl?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Upload file here
            </a>
          </div>
        </div>
        <div>
          <label>Audit Remark :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="auditremark"
            name="auditremark"
            placeholder="Enter the Audit Remark"
            value={state.auditremark || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Audit Status : </label>
          <select
            style={{ fontFamily: "Poppins" }}
            id="auditstatus"
            name="auditstatus"
            value={state.auditstatus}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
          </select>
        </div>
        <div>
          <label>Audit Score :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="number"
            id="auditscore"
            name="auditscore"
            placeholder="Enter the audit Score"
            value={state.auditscore || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditGovernancetestresult;
