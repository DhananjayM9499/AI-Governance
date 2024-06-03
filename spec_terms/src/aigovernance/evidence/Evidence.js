import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";

const Evidence = (props) => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const initialState = {
    groupid: null,
    groupname: queryParams.get("groupname") || "",
    thrustid: null,
    thrustarea: queryParams.get("thrustarea") || "",
    controlid: null,
    controlname: queryParams.get("controlname") || "",
    controlwt: queryParams.get("controlwt") || "",
    subcontrolname: queryParams.get("subcontrolname") || "",
    subcontrolwt: queryParams.get("subcontrolwt") || "",
    evidence: queryParams.get("evidence") || "",
    evidencereferencelink: "",
    evidenceremark: "",
    evidenceupload: "",
    evidencestatus: "",
    organization: "",
    projectname: "",
    responsibilitycenter: "",
    responsibilitygroup: "",
  };
  const [state, setState] = useState(initialState);
  const [subControlNames, setSubControlNames] = useState([]);
  const [controlNames, setControlNames] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [company, setCompany] = useState([]);
  const [project, setProjects] = useState({});
  const [data, setData] = useState([]);
  const [thrustName, setThrustName] = useState([]);

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
    evidenceremark,
    evidenceupload,
    evidencestatus,
    organization,
    projectname,
    responsibilitycenter,
    responsibilitygroup,
    logindate,
  } = state;
  const { resultid, companyid, projectid } = useParams();
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
    //console.log("USeeffect triggered");
    // Define a memory variable

    // Check if resultid is available and executed is 0
    if (resultid) {
      try {
        axios
          .get(API.GET_SPECIFIC_EVIDENCE(resultid))
          .then((resp) => {
            setState({ ...resp.data[0] });
            // Set executed to 1 after execution
          })
          .catch((error) => {
            console.error(
              "An error occurred while fetching the Governance Audit :",
              error
            );
          });
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

  /***************** ********/

  const handleInputChangeGroup = (e) => {
    //console.log("group called");
    const { name, value } = e.target;
    // console.log("value :", value);
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      thrustarea: "", // Reset thrust area when group changes
      subcontrolname: "",
      subcontrolwt: null,
      controlwt: null,
      controlname: "",
      evidence: "",
    }));

    axios
      .get(API.GET_GROUPNAME_SUBCONTROL(value))
      .then((response) => {
        setThrustName(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while fetching thrust areas:", error);
      });
  };

  const handleInputChangeThrustArea = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      // Reset control id when thrust area changes
    }));

    axios
      .get(API.GET_THRUST_SUBCONTROL(value))
      .then((response) => {
        setControlNames(response.data);
      })
      .catch((error) => {
        console.error("An error occurred while fetching controls:", error);
      });
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "controlid") {
      const selectedControl = controlNames.find(
        (control) => control.controlid === value
      );

      // console.log("Selected Control:", selectedControl);

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

          //console.log("Selected SubControl:", selectedSubControl);

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

    if (
      !evidencereferencelink ||
      !evidenceremark ||
      !evidenceupload ||
      !evidencestatus
    ) {
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
            // subcontrolid,
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
        () => navigate(`/evidenceList/${projectid}/${companyid}`),
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
              thrustName={thrustName}
              groupNames={groupNames}
              data={data}
              handleInputChange={handleInputChange}
              handleInputChangeGroup={handleInputChangeGroup}
              handleInputChangeThrustArea={handleInputChangeThrustArea}
            />
          </div>

          {/* Master Form Buttons */}
          <div>
            <input type="submit" value={resultid ? "Update" : "Save"} />
            <Link to={`/evidenceList/${projectid}/${companyid}`}>
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
  state,
  controlNames,
  subControlNames,
  groupNames,
  thrustName,

  handleInputChange,
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
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        {/* Details Form Inputs */}
        <div>
          <label>Governance Group :</label>
          <select
            style={{
              fontFamily: "Poppins",
              //color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              //backgroundColor: isReadOnly ? "#f4f4f4" : "#ffffff", // Background color for readonly
            }}
            id="groupname"
            name="groupname"
            value={state.groupname || ""}
            onChange={handleInputChangeGroup}

            // disabled={isReadOnly} // Disable if in read-only mode
          >
            <option value="">Select Govenance Group</option>
            {groupNames.map((group) => (
              <option key={group.groupid} value={group.groupname}>
                {group.groupname}
              </option>
            ))}
          </select>
        </div>
        {/*console.log(state.thrustarea)} {/* Add console.log here */}
        <div>
          <label htmlFor="thrustarea">Governance Thrust Area :</label>
          <select
            style={{
              fontFamily: "Poppins",
              //color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
              //backgroundColor: isReadOnly ? "#f4f4f4" : "#ffffff", // Background color for readonly
            }}
            id="thrustarea"
            name="thrustarea"
            value={state.thrustarea}
            onChange={handleInputChangeThrustArea}

            // disabled={isReadOnly} // Disable if in read-only mode
          >
            <option value="">Select Thrust Area</option>
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
            value={state.subcontrolname} // Use state.controlid instead of state.controlname
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
            value={state.subcontrolname || ""}
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
      {/* Divider */}
      <hr style={{ margin: "30px 0px ", border: "3px solid #ccc" }} />
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
    </div>
  );
};

export default Evidence;
