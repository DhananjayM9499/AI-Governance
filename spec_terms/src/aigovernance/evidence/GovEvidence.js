import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";

const GovEvidence = (props) => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialState = {
    groupid: null,
    groupname: " ",
    thrustid: null,
    thrustarea: "",
    controlid: null,
    controlname: "",
    controlwt: "",
    subcontrolid: null,
    subcontrolname: "",
    subcontrolwt: "",
    evidence: "",
    evidencereferencelink: queryParams.get("evidencereferencelink") || "",
    evidenceremark: queryParams.get("evidenceremark") || "",
    evidenceupload: queryParams.get("evidenceupload") || "",
    evidencestatus: queryParams.get("evidencestatus") || "",
    organization: "",
    projectname: "",
    responsibilitycenter: "",
    responsibilitygroup: "",
  };

  const [state, setState] = useState(initialState);
  const [subControlNames, setSubControlNames] = useState([]);
  const [controlNames, setControlNames] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [thrustName, setThrustName] = useState([]);
  const [company, setCompany] = useState([]);
  const [project, setProjects] = useState({});

  const {
    groupid,
    groupname,
    thrustid,
    thrustarea,
    controlid,
    controlname,
    controlwt,
    //subcontrolid,
    subcontrolname,
    subcontrolwt,
    evidence,
    evidencereferencelink,
    evidenceupload,
    evidenceremark,
    evidencestatus,
    organization,
    projectname,
    responsibilitycenter,
    responsibilitygroup,
    logindate,
  } = state;

  // Now you can use these values

  const { resultid, companyid, projectid } = useParams();
  const navigate = useNavigate();

  /**********To Get The Thrust Area*********** */

  useEffect(() => {
    if (resultid) {
      try {
        axios
          .get(API.GET_SPECIFIC_EVIDENCE(resultid))
          .then((resp) => setState({ ...resp.data[0] }))
          .catch((error) => {
            console.error(
              "An error occurred while fetching the Governance Audit :",
              error
            );
          });
      } catch (error) {
        console.error(
          "An error occurred while fetching the Governance Audit:",
          error
        );
      }
    }

    axios
      .get(API.GET_SPECIFIC_COMPANY(companyid))
      .then((resp) => {
        setCompany({ ...resp.data[0] });
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching the Project Phase:",
          error
        );
      });

    axios
      .get(API.GET_SPECIFIC_PROJECT(projectid))
      .then((resp) => {
        setProjects({ ...resp.data[0] });
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching the Project Details:",
          error
        );
      });

    axios
      .get(API.GET_DISTINCT_THRUSTAREA)
      .then((response) => {
        setSubControlNames(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while fetching control names:", error);
      });

    axios
      .get(API.GET_GROUP_API)
      .then((response) => {
        setGroupNames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching group names:", error);
      });
    if (groupname) {
      axios
        .get(API.GET_GROUPNAME_SUBCONTROL(groupname))
        .then((response) => {
          // Extract unique values from the response
          const uniqueValues = [...new Set(response.data)];
          setThrustName(uniqueValues);
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching subcontrol names:",
            error
          );
        });
    }

    if (thrustarea) {
      axios
        .get(API.GET_THRUST_SUBCONTROL(thrustarea))
        .then((response) => {
          // Extract unique values from the response

          setControlNames(response.data);
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching subcontrol names:",
            error
          );
        });
    }

    if (props?.location?.state?.governanceDetails) {
      const { governanceDetails } = props.location.state;

      setState((prevState) => ({
        ...prevState,
        evidencereferencelink: governanceDetails.evidencereferencelink,
        evidenceremark: governanceDetails.evidenceremark,
        evidencestatus: governanceDetails.evidencestatus,
        evidenceupload: governanceDetails.evidenceupload,
        organization: governanceDetails.organization,
        projectname: governanceDetails.projectname,
        responsibilitycenter: governanceDetails.responsibilitycenter,
        responsibilitygroup: governanceDetails.responsibilitygroup,
      }));
    }
  }, [
    resultid,
    companyid,
    projectid,
    props?.location?.state?.governanceDetails,
  ]);

  /**********Handle Changes************ */
  const handleInputChangeGroup = async (e) => {
    const { value } = e.target;
    console.log("New groupname selected:", value);

    // Update groupname in the state
    setState((prevState) => ({
      ...prevState,
      groupname: value,
      thrustarea: "", // Reset thrust area when group changes
    }));

    try {
      // Fetch thrust areas associated with the selected groupname
      const response = await axios.get(API.GET_GROUPNAME_SUBCONTROL(value));
      const uniqueValues = [...new Set(response.data)];

      // Update thrust areas in the state
      setThrustName(uniqueValues);
    } catch (error) {
      console.error("An error occurred while fetching thrust areas:", error);
    }
  };

  const handleInputChangeThrustArea = (e) => {
    const { name, value } = e.target;

    // Update thrust area in the state
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      controlid: "", // Reset control id when thrust area changes
    }));

    // Fetch control names associated with the selected thrust area
    fetchControlNames(value);
  };

  const fetchControlNames = async (thrustArea) => {
    try {
      const response = await axios.get(API.GET_THRUST_SUBCONTROL(thrustArea));
      setControlNames(response.data);
    } catch (error) {
      console.error("An error occurred while fetching controls:", error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "controlid") {
      const selectedControl = controlNames.find(
        (control) => control.controlid === value
      );

      console.log("Selected Control:", selectedControl);

      if (selectedControl) {
        const controlUpdates = {
          [name]: value,
          controlwt: selectedControl?.controlwt || "",
          controlname: selectedControl?.controlname || "",
          subcontrolid: selectedControl?.subcontrolid || "",
          subcontrolname: selectedControl?.subcontrolname || "",
          subcontrolwt: selectedControl?.subcontrolwt || "",
          evidence: selectedControl?.evidence || "",
        };

        setState((prevState) => ({
          ...prevState,
          ...controlUpdates,
        }));

        // Check if the selected control has a subcontrolname associated with it
        if (selectedControl?.subcontrolname) {
          // Find the selected subcontrol using the subcontrolname
          const selectedSubControl = subControlNames.find(
            (subcontrol) =>
              subcontrol.subcontrolname === selectedControl.subcontrolname
          );

          console.log("Selected SubControl:", selectedSubControl);

          if (selectedSubControl) {
            const subControlUpdates = {
              subcontrolid: selectedSubControl?.subcontrolid || "",
              subcontrolname: selectedSubControl?.subcontrolname || "",
              subcontrolwt: selectedSubControl?.subcontrolwt || "",
              evidence: selectedSubControl?.evidence || "",
            };

            setState((prevState) => ({
              ...prevState,
              ...subControlUpdates,
            }));
          } else {
            console.error(
              `Selected subcontrol with name ${selectedControl.subcontrolname} not found.`
            );
          }
        } else {
          console.warn(
            "Selected control does not have a subcontrolname associated with it."
          );
        }
      } else {
        console.error(`Selected control with id ${value} not found.`);
      }
    } else {
      setState((prevState) => ({ ...prevState, [name]: value }));
    }
  };
  //Find the selected Group
  // const selectedThrustarea = data.find(
  //   (thrustarea) => thrustarea.thrustarea === value
  // );
  // console.log("selected thrustarea: ", selectedThrustarea);
  // const thrustAreaUpdates = {
  //   thrustarea: selectedThrustarea?.thrustarea || "",
  // };
  // setState((prevState) => ({
  //   ...prevState,
  //   ...thrustAreaUpdates,
  // }));

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupname) {
      toast.error("please provide the Input");
    } else {
      const timestamp = new Date().toISOString();
      if (!resultid) {
        axios
          .post(API.ADD_EVIDENCE_API(projectid, companyid), {
            groupid,
            groupname,
            thrustid,
            thrustarea,
            controlid,
            controlname,
            controlwt,

            subcontrolname,
            subcontrolwt,
            evidence,
            evidencereferencelink,
            evidenceremark,
            evidenceupload,
            evidencestatus,
            organization: company.organization,
            projectname: project.projectname,
            responsibilitycenter: project.responsibilitycenter,
            responsibilitygroup: project.responsibilitygroup,
            logindate: timestamp,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" Evidence added");
      } else {
        axios
          .put(API.EDIT_EVIDENCE_API(resultid), {
            groupid,
            groupname,
            thrustid,
            thrustarea,
            controlid,
            controlname,
            controlwt,
            //subcontrolid,
            subcontrolname,
            subcontrolwt,
            evidence,
            evidencereferencelink,
            evidenceremark,
            evidenceupload,
            evidencestatus,
            organization,
            projectname,
            responsibilitycenter,
            responsibilitygroup,
          })
          .then(() => {
            setState({ initialState });
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Audit Results Updated");
      }
      setTimeout(
        () => navigate(`/GovEvidenceList/${projectid}/${companyid}`),
        500
      );
    }
  };

  return (
    <div style={{ marginBottom: "1.5cm" }}>
      <Header />
      <div
        style={{
          display: "flex",
          marginTop: "10px",
          font: "Poppins",
          marginBottom: "1px",
        }}
      >
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
          <div
            style={{
              width: "10px",
              background: "#ccc",
              alignContent: "end",
            }}
          ></div>
          <div
            style={{
              flex: 1,
              marginRight: "50px",
              textAlign: "left",
              marginLeft: "1cm",
            }}
          >
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
              <div style={{ flex: 1, paddingLeft: "20px", textAlign: "left" }}>
                <h2>Project Details</h2>
                <div>
                  <p>Project Name : {project.projectname}</p>{" "}
                  <p>Start Date : {formatDate(project.fromdate)}</p>
                  <p>End Date : {formatDate(project.todate)}</p>
                  <p>Responsibility Center : {project.responsibilitycenter}</p>
                  <p>Responsibility Group : {project.responsibilitygroup}</p>
                </div>
              </div>
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
            {/* DetailsForm component with controlNames, controlnames, etc. */}
            <DetailsForm
              controlNames={controlNames}
              subControlNames={subControlNames}
              state={state}
              groupNames={groupNames}
              thrustName={thrustName}
              handleInputChange={handleInputChange}
              handleInputChangeGroup={handleInputChangeGroup}
              handleInputChangeThrustArea={handleInputChangeThrustArea}
            />
          </div>

          {/* Master Form Buttons */}
          <div>
            <input type="submit" value={resultid ? "Update" : "Save"} />
            <Link to={`/GovEvidenceList/${projectid}/${companyid}`}>
              <input className="btn btn-edit" type="button" value="Go back" />
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

const DetailsForm = ({
  controlNames,
  subControlNames,
  groupNames,
  state,
  handleInputChange,
  thrustName,
  //isReadOnly,
  data,
  handleInputChangeGroup,
  handleInputChangeThrustArea,
}) => {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr ",
          gap: "40px",
        }}
      >
        <div>
          <label>Evidence Reference Link :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="evidencereferencelink"
            name="evidencereferencelink"
            placeholder="Enter the Evidence Reference Link"
            value={state.evidencereferencelink || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Upload Evidence : </label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <br />
            <input
              style={{ fontFamily: "Poppins", marginRight: "10px" }}
              type="text"
              id="evidenceupload"
              name="evidenceupload"
              placeholder="Enter the Evidence upload link"
              value={state.evidenceupload || ""}
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
          <label>Evidence Remark :</label>
          <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="evidenceremark"
            name="evidenceremark"
            placeholder="Enter the Evidence Reference Link"
            value={state.evidenceremark || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Evidence Status : </label>
          <select
            style={{ fontFamily: "Poppins" }}
            id="evidencestatus"
            name="evidencestatus"
            value={state.evidencestatus}
            g
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="pass">Pass</option>
            <option value="fail">Fail</option>
          </select>
        </div>
      </div>
      {/* Divider */}

      <hr style={{ margin: "30px 0px ", border: "3px solid #ccc" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        {/* Details Form Inputs */}
        <div>
          <label htmlFor="groupname">Governance Group:</label>
          <select
            style={{
              fontFamily: "Poppins",
              // Other styling properties
            }}
            id="groupname"
            name="groupname"
            value={state.groupname || ""}
            onChange={handleInputChangeGroup} // Ensure correct event handler
          >
            <option value="">Select Governance Group</option>
            {groupNames.map((group) => (
              <option key={group.groupid} value={group.groupname}>
                {group.groupname}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Governance Thrust Area :</label>
          <select
            style={{
              fontFamily: "Poppins",
              //color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              //backgroundColor: isReadOnly ? "#f4f4f4" : "#ffffff", // Background color for readonly
            }}
            id="thrustarea"
            name="thrustarea"
            value={state.thrustarea || ""}
            onChange={handleInputChangeThrustArea}

            // disabled={isReadOnly} // Disable if in read-only mode
          >
            <option value="">Select Govenance Thrust Area</option>
            {thrustName.map((thrust) => (
              <option key={thrust.subcontrolid} value={thrust.thrustarea}>
                {thrust.thrustarea}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="controlid">Sub-Control Name:</label>
          <select
            style={{
              fontFamily: "Poppins",
              // color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              // backgroundColor: isReadOnly ? "#eee" : "#ffffff", // Background color for readonly
            }}
            id="controlid"
            name="controlid"
            value={state.controlid || state.controlname} // Use state.controlid instead of state.controlname
            onChange={handleInputChange} // Ensure handleInputChange is correctly updating state.controlid
            //disabled={isReadOnly}
          >
            <option value="">Select Sub-Control Name</option>
            {controlNames.map((control) => (
              <option key={control.controlid} value={control.controlid}>
                {control.subcontrolname}
              </option>
            ))}
          </select>
        </div>

        <div>
          {" "}
          <label>Sub-Control Weight : </label>
          <input
            style={{
              fontFamily: "Poppins",
              //color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              // backgroundColor: isReadOnly ? "#eee" : "#ffffff", // Background color for readonly
            }}
            type="text"
            id="controlwt"
            name="controlwt"
            placeholder="Control Weight"
            //disabled={isReadOnly}
            value={state.subcontrolwt || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr ",
          gap: "40px",
        }}
      >
        <div>
          <label htmlFor="subcontrolid">Control Name:</label>
          <input
            style={{
              fontFamily: "Poppins",
              //color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              //backgroundColor: isReadOnly ? "#eee" : "#ffffff", // Background color for readonly
            }}
            id="subcontrolname"
            name="subcontrolname"
            value={state.controlname}
            onChange={handleInputChange}
            //disabled={isReadOnly}
            type="text"
          />
        </div>
        <div>
          <label>Control Weight : </label>
          <input
            style={{
              fontFamily: "Poppins",
              // color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              // backgroundColor: isReadOnly ? "#eee" : "#ffffff", // Background color for readonly
            }}
            type="text"
            id="subcontrolwt"
            name="subcontrolwt"
            placeholder="Sub-Control Weight"
            // disabled={isReadOnly}
            value={state.controlwt || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          {" "}
          <label>Expected Evidence : </label>
          <input
            style={{
              fontFamily: "Poppins",
              //color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              // backgroundColor: isReadOnly ? "#eee" : "#ffffff", // Background color for readonly
            }}
            type="text"
            id="evidence"
            name="evidence"
            placeholder="Recomended Evidence"
            //disabled={isReadOnly}
            value={state.evidence || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default GovEvidence;
