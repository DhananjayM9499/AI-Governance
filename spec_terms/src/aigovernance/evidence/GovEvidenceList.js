import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
};

const GovEvidenceList = (props) => {
  const [state, setState] = useState(initialState);
  const [evidenceList, setEvidenceList] = useState([]);
  const [company, setCompany] = useState([]);
  const [project, setProjects] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  // const navigate =useNavigate();
  const [governance, setGovernance] = useState([]);
  const itemsPerPage = 3;
  const [hasAssessment, setHasAssessment] = useState(false);
  const { companyid, projectid, resultid } = useParams();
  const [subControlNames, setSubControlNames] = useState([]);
  const [controlNames, setControlNames] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [data, setData] = useState([]);
  const disableGovernanceInputs = evidenceList.length === 0; // const {
  //   groupid,
  //   groupname,
  //   thrustid,
  //   thrustarea,
  //   controlid,
  //   controlname,
  //   controlwt,
  //   subcontrolid,
  //   subcontrolname,
  //   subcontrolwt,
  // } = state;

  const loadData = async () => {
    try {
      const response = await axios.get(
        API.GET_EVIDENCE_API(projectid, companyid)
      );
      const sortedData = response.data.sort(
        (a, b) => b.projectid - a.projectid
      );
      setEvidenceList(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };
  const loadThrust = async () => {
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
    if (!resultid) {
      loadData();
    }

    axios.get(API.GET_EVIDENCE_API(projectid, companyid)).then((resp) => {
      if (resp.data.length > 0) {
        setGovernance({ ...resp.data[0] });
        // assuming the evidence data is in the same format
      }
    });

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
    if (projectid) {
      axios
        .get(API.GET_PROJECT_ASSESSMENTS(projectid))
        .then((assessmentResponse) => {
          // Check if assessmentResponse.data is not null or undefined before filtering
          const filteredData = assessmentResponse.data
            ? assessmentResponse.data.filter(
                (item) => item.assessmentreferencelink !== null
              )
            : [];

          setHasAssessment(filteredData);
        })
        .catch((error) => {
          console.error("Error fetching assessment data:", error);
        });
    }
    loadData();
    loadThrust();

    axios
      .get(API.GET_SPECIFIC_PROJECT(projectid))
      .then((resp) => {
        setProjects({ ...resp.data[0] });
      })
      .catch((error) => {
        console.error(
          "An error occured while fetching the Project Details:",
          error
        );
      });
    if (
      props.location &&
      props.location.state &&
      props.location.state.governanceDetails
    ) {
      const { governanceDetails } = props.location.state;
      setGovernance(governanceDetails);
    }
  }, [resultid, companyid, projectid]);

  const deleteEvidence = async (resultid, e) => {
    e.stopPropagation(); // Stop event propagation to prevent triggering other events

    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(API.DELETE_EVIDENCE_API(resultid));

        if (response.status === 200) {
          toast.success("Evidence Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete Evidence as there are associates present."
          );
        } else {
          console.log(error);
          toast.error("An error occurred while deleting Evidence.");
        }
      }
    }
  };

  /**********Handle Changes************ */
  const handleInputChangeThrustArea = (event) => {
    const selectedValue = event.target.value;
    const [thrustid, thrustarea] = selectedValue.split("|");
    setState({
      ...state,
      thrustid: thrustid,
      thrustarea: thrustarea,
    });
  };
  /***************** ********/

  const handleInputChangeGroup = (event) => {
    const selectedValue = event.target.value;
    const [groupid, groupname] = selectedValue.split("|");
    setState({
      ...state,
      groupid: groupid,
      groupname: groupname,
    });
  };
  /*********************** */

  /******************************* */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "controlid") {
      const selectedControl = controlNames.find(
        (control) => control.controlid === value
      );

      setState((prevState) => ({
        ...prevState,
        [name]: value,
        controlwt: selectedControl ? selectedControl.controlwt : "",
        controlname: selectedControl ? selectedControl.controlname : "", // Add this line
      }));
    } else if (name === "subcontrolid") {
      const selectedSubControl = subControlNames.find(
        (subcontrol) => subcontrol.subcontrolid === value
      );

      setState((prevState) => ({
        ...prevState,
        [name]: value,
        subcontrolwt: selectedSubControl ? selectedSubControl.subcontrolwt : "",
        subcontrolname: selectedSubControl
          ? selectedSubControl.subcontrolname
          : "", // Add this line
      }));
    } else {
      setState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = evidenceList.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
            <div>
              <p>Contact Person : {company.contactname}</p>
              <p>Contact Email : {company.contactemail}</p>
              <p>Contact phone : {company.contactphone}</p>
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
            <div>
              <p>Project Name : {project.projectname}</p>{" "}
              <p>Start Date : {formatDate(project.fromdate)}</p>
              <p>End Date : {formatDate(project.todate)}</p>
              <p>Responsibility Center : {project.responsibilitycenter}</p>
              <p>Responsibility Group : {project.responsibilitygroup}</p>
            </div>
          </div>

          <div
            style={{
              width: "10px",
              background: "#ccc",
              alignContent: "end",
            }}
          ></div>
        </div>
      </div>

      {/* Details Section - Governance Test Results Form */}
      <div style={{ marginTop: "5px", padding: "20px" }}>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "0px",
          }}
          //onSubmit={handleSubmit}
        >
          <div style={{ marginBottom: "20px" }}>
            <DetailsForm
              governance={governance}
              controlNames={controlNames}
              subControlNames={subControlNames}
              state={state}
              groupNames={groupNames}
              data={data}
              handleInputChange={handleInputChange}
              handleInputChangeThrustArea={handleInputChangeThrustArea}
              handleInputChangeGroup={handleInputChangeGroup}
              disableGovernanceInputs={disableGovernanceInputs}
            />
          </div>

          {/* Evidence Form */}
          <div>
            {evidenceList.length === 0 ? (
              <div>
                <p>No evidence associated with this project.</p>
                <Link
                  to={{
                    pathname: `/GovEvidence/${projectid}/${companyid}`,
                  }}
                >
                  <button className="btn btn-contact">Add Governance</button>
                </Link>
              </div>
            ) : (
              <div>
                <Link
                  to={`/GovEvidence/${projectid}/${companyid}?evidencereferencelink=${governance.evidencereferencelink}&evidenceupload=${governance.evidenceupload}&evidenceremark=${governance.evidenceremark}&evidencestatus=${governance.evidencestatus}`}
                >
                  <button className="btn btn-contact">Add Governance</button>
                </Link>
                <table className="styled-table" style={{ marginBottom: "3cm" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>No.</th>
                      <th style={{ textAlign: "center" }}>Governance Group</th>
                      <th style={{ textAlign: "center" }}>Governance Area</th>
                      <th style={{ textAlign: "center" }}>Control </th>
                      <th style={{ textAlign: "center" }}>Sub-Control</th>
                      <th style={{ textAlign: "center" }}>Evidence</th>
                      <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <th scope="row">{index + indexOfFirstItem + 1}</th>
                          <td>{item.groupname}</td>
                          <td>{item.thrustarea}</td>
                          <td>{item.controlname}</td>

                          <td>{item.subcontrolname}</td>
                          <td>{item.evidence}</td>
                          <td>
                            <Link
                              to={`/GovEvidenceedit/${projectid}/${companyid}/${item.resultid}`}
                            >
                              <button className="btn btn-edit">Edit</button>
                            </Link>
                            <button
                              className="btn btn-delete"
                              onClick={(e) => deleteEvidence(item.resultid, e)}
                            >
                              Delete
                            </button>
                            {hasAssessment.length === 0 ? (
                              <Link
                                to={{
                                  pathname: `/assessment/${projectid}/${companyid}/${item.resultid}`,
                                  state: { governanceDetails: governance },
                                }}
                              >
                                <button className="btn btn-contact">
                                  Assessment
                                </button>
                              </Link>
                            ) : (
                              <Link
                                to={`/assessmentList/${project.projectid}/${project.companyid}/${item.resultid}`}
                              >
                                <button className="btn btn-view">
                                  Assessment
                                </button>
                              </Link>
                            )}
                            <Link
                              to={`/projectaudit/${projectid}/${companyid}/${item.resultid}`}
                            >
                              <button className="btn btn-edit">
                                Audit Plan
                              </button>
                            </Link>
                            <Link
                              to={`/AddGovernancetestresult/${projectid}/${companyid}/${item.resultid}`}
                            >
                              <button className="btn btn-view">Audit</button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="pagination">
            {Array.from({
              length: Math.ceil(evidenceList.length / itemsPerPage),
            }).map((item, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

const DetailsForm = ({
  controlNames,
  governance,
  subControlNames,
  groupNames,
  handleInputChange,
  handleInputChangeThrustArea,
  handleInputChangeGroup,
  data,
  disableGovernanceInputs,
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
        {/* Details Form Inputs */}
        <div>
          <label>Evidence Referencelink :</label>
          <input
            type="text"
            style={{
              fontFamily: "Poppins",
            }}
            id="evidencereferencelink"
            name="evidencereferencelink"
            value={governance.evidencereferencelink || ""}
            onChange={handleInputChangeGroup}
            disabled={disableGovernanceInputs}
            // Disable if in read-only mode
          ></input>
        </div>
        <div>
          <label>Evidence Remark :</label>
          <select
            style={{
              fontFamily: "Poppins",
            }}
            id="evidenceremark"
            name="evidenceremark"
            value={governance.evidenceremark}
            onChange={handleInputChangeThrustArea}
            disabled={disableGovernanceInputs}
          >
            <option value="">{governance.evidenceremark}</option>
            {data.map((area) => (
              <option
                key={area.thrustid}
                value={`${area.thrustid}|${area.thrustarea}`}
              >
                {area.thrustarea}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="controlid">Evidence Upload</label>
          <select
            style={{
              fontFamily: "Poppins",
            }}
            id="evidenceupload"
            name="evidenceupload"
            value={governance.evidenceupload}
            onChange={handleInputChange}
            disabled={disableGovernanceInputs}
          >
            <option value="">{governance.evidenceupload}</option>
            {/* Populate the options based on your data */}
            {controlNames.map((control) => (
              <option key={control.controlid} value={control.controlid}>
                {control.controlname}
              </option>
            ))}
          </select>
        </div>
        <div>
          {" "}
          <label>Evidence Status : </label>
          <input
            style={{
              fontFamily: "Poppins",
            }}
            type="text"
            id="evidencestatus"
            name="evidencestatus"
            placeholder="evidencestatus"
            value={governance.evidencestatus || ""}
            onChange={handleInputChange}
            disabled={disableGovernanceInputs}
          />
        </div>
      </div>
      <hr style={{ margin: "30px 0px ", border: "3px solid #ccc" }} />
    </div>
  );
};

export default GovEvidenceList;
