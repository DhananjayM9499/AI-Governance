import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
const initialState = {
  groupid: null,
  groupname: "",
  thrustid: null,
  thrustarea: "",
  controlid: null,
  controlname: "",
  controlwt: "",
  subcontrolid: null,
  subcontrolname: "",
  subcontrolwt: "",
  evidencereferencelink: "",
  evidenceremark: "",
  evidenceupload: "",
  evidencestatus: "",
  assessmentreferencelink: "",
  assessmentremark: "",
  assessmentupload: "",
  assessmentstatus: "",
  assessmentscore: null,
};
const Assesment = (props) => {
  const [state, setState] = useState(initialState);
  const [company, setCompany] = useState([]);
  const [project, setProjects] = useState({});
  const [governance, setGovernance] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(true); // Added state

  const {
    groupid,
    groupname,
    thrustid,
    thrustarea,
    controlid,
    controlname,
    controlwt,
    subcontrolid,
    subcontrolname,
    subcontrolwt,
    evidencereferencelink,
    evidenceremark,
    evidenceupload,
    evidencestatus,
    assessmentreferencelink,
    assessmentremark,
    assessmentupload,
    assessmentstatus,
    assessmentscore,
  } = state;
  const { resultid, companyid, projectid } = useParams();
  const navigate = useNavigate();

  /**********To Get The Thrust Area************/

  useEffect(() => {
    if (resultid) {
      axios
        .get(API.GET_ASSESSMENTS(resultid))
        .then((resp) => setState({ ...resp.data[0] }))
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Project Phase:",
            error
          );
        });
    }
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
      .get(API.GET_SPECIFIC_PROJECT(projectid))
      .then((resp) => setProjects({ ...resp.data[0] }))
      .catch((error) => {
        console.error(
          "An error occurred while fetching the Project Details:",
          error
        );
      });

    axios
      .get(API.GET_SPECIFIC_EVIDENCE(resultid))
      .then((resp) => {
        if (resp.data.length > 0) {
          setGovernance({ ...resp.data[0] });
          // assuming the evidence data is in the same format
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching the Results:", error);
      });

    if (props?.location?.state?.governanceDetails) {
      const { governanceDetails } = props.location.state;
      setState((prevState) => ({
        ...prevState,
        groupid: governanceDetails.groupid,
        groupname: governanceDetails.groupname,
        thrustid: governanceDetails.thrustid,
        thrustarea: governanceDetails.thrustarea,
        controlid: governanceDetails.controlid,
        controlname: governanceDetails.controlname,
        controlwt: governanceDetails.controlwt,
        subcontrolid: governanceDetails.subcontrolid,
        subcontrolname: governanceDetails.subcontrolname,
        subcontrolwt: governanceDetails.subcontrolwt,
        evidencereferencelink: governanceDetails.evidencereferencelink,
        evidenceremark: governanceDetails.evidenceremark,
        evidenceupload: governanceDetails.evidenceupload,
        evidencestatus: governanceDetails.evidencestatus,
      }));
      setIsReadOnly(true); // Set readonly mode
    } else {
      setIsReadOnly(false);
    }
  }, [
    resultid,
    companyid,
    projectid,
    props?.location?.state?.governanceDetails,
  ]);

  /************************/
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    try {
      setState((prevState) => ({ ...prevState, [name]: value }));
    } catch (error) {
      console.error("Error updating Assesment:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !assessmentreferencelink ||
      !assessmentremark ||
      !assessmentupload ||
      !assessmentstatus ||
      !assessmentscore
    ) {
      toast.error("please provide the Input");
    } else {
      if (resultid) {
        axios
          .post(API.ADD_ASSESSMENT_API(projectid, companyid), {
            groupid: governance.groupid,
            groupname: governance.groupname,
            thrustid: governance.thrustid,
            thrustarea: governance.thrustarea,
            controlid: governance.controlid,
            controlname: governance.controlname,
            controlwt: governance.controlwt,
            subcontrolid: governance.subcontrolid,
            subcontrolname: governance.subcontrolname,
            subcontrolwt: governance.subcontrolwt,
            evidencereferencelink: governance.evidencereferencelink,
            evidenceremark: governance.evidenceremark,
            evidenceupload: governance.evidenceupload,
            evidencestatus: governance.evidencestatus,
            assessmentreferencelink,
            assessmentremark,
            assessmentupload,
            assessmentstatus,
            assessmentscore,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" Audit result added");
      } else {
        axios
          .put(API.UPDATE_ASSESSMENTS_API(resultid), {
            groupid: governance.groupid,
            groupname: governance.groupname,
            thrustid: governance.thrustid,
            thrustarea: governance.thrustarea,
            controlid: governance.controlid,
            controlname: governance.controlname,
            controlwt: governance.controlwt,
            subcontrolid: governance.subcontrolid,
            subcontrolname: governance.subcontrolname,
            subcontrolwt: governance.subcontrolwt,
            evidencereferencelink: governance.evidencereferencelink,
            evidenceremark: governance.evidenceremark,
            evidenceupload: governance.evidenceupload,
            evidencestatus: governance.evidencestatus,
            assessmentreferencelink,
            assessmentremark,
            assessmentupload,
            assessmentstatus,
            assessmentscore,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Audit Results Updated");
      }
      setTimeout(() => {
        const incrementedResultId = parseInt(resultid, 10) + 1;
        navigate(
          `/assessmentList/${projectid}/${companyid}/${incrementedResultId}`
        );
      }, 500);
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
            <DetailsForm governance={governance} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr ",
              gap: "40px",
            }}
          >
            <div>
              <label>Assessment Reference Link :</label>
              <input
                style={{ fontFamily: "Poppins" }}
                type="text"
                id="assessmentreferencelink"
                name="assessmentreferencelink"
                placeholder="Enter the assessment Reference Link"
                value={assessmentreferencelink || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Assessment Upload : </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <br />
                <input
                  style={{ fontFamily: "Poppins", marginRight: "10px" }}
                  type="text"
                  id="assessmentupload"
                  name="assessmentupload"
                  placeholder="Enter the assessment upload link"
                  value={assessmentupload || ""}
                  onChange={handleInputChange}
                />
                <div style={{ position: "relative" }}></div>
                <a
                  href="https://drive.google.com/drive/folders/1AJ8YN8wgFtDWkPk0YCWYtNok1c2xuQeY?usp=share_link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Upload file here
                </a>
              </div>
            </div>
            <div>
              <label>Assessment Remark :</label>
              <input
                style={{ fontFamily: "Poppins" }}
                type="text"
                id="assessmentremark"
                name="assessmentremark"
                placeholder="Enter the assessment Remark"
                value={assessmentremark || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Assessment Status : </label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="assessmentstatus"
                name="assessmentstatus"
                value={assessmentstatus || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Status</option>
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
              </select>
            </div>
            <div>
              <label>Assessment Score : </label>
              <input
                style={{ fontFamily: "Poppins" }}
                type="number"
                id="assessmentscore"
                name="assessmentscore"
                placeholder="Enter the assessment Score"
                value={assessmentscore || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Master Form Buttons */}
          <div>
            <input type="submit" value={resultid ? "save" : "Save"} />
            <Link to={`/assessmentList/${projectid}/${companyid}/${resultid}`}>
              <input
                style={{
                  fontFamily: "Poppins",
                  backgroundColor: "#3386ff",
                  width: "100px",
                }}
                type="button"
                value="Go back"
              />
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

const DetailsForm = ({ governance }) => {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
          gap: "40px",
        }}
      >
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
      <hr style={{ margin: "30px 0px ", border: "3px solid #ccc" }} />
    </div>
  );
};

export default Assesment;
