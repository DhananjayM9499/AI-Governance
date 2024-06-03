import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";
import { useParams } from "react-router-dom";
import { Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import Modal from "./Modal";

const initialState = {
  organization: "",
  responsibilitygroup: "",
  responsibilitycenter: "",
  projectname: "",
  object: "",
  objecttype: "",
  controlweight: "5",
  subcontrolweight: "5",
  groupname: "",
};

const DashBoardTable = () => {
  const [state, setState] = useState(initialState);
  const [user, setUser] = useState([]);
  const chartRef = useRef(null);
  const [respGroup, setRespGroup] = useState([]);
  const [respCenter, setRespCenter] = useState([]);
  const [organizationComp, setOrganizationComp] = useState([]);
  const [projectName, setProject] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const { resultid } = useParams();
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [isVisibleGraph, setIsVisibleGraph] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedRiskDetail, setSelectedRiskDetail] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null); 
  const [issueData, setIssueData] = useState(null);
  const [selectedDetailType, setSelectedDetailType] = useState(null);
  const [algorithmData, setAlgorithmData] = useState(null); 
  const [evidenceData, setEvidenceData] = useState(null);
  const [auditData, setAuditData] = useState(null);
  const [checklistData, setChecklistData] = useState(null);
  const [governanceTestResultData, setGovernanceData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = {
          organization: state.organization,
          responsibilitygroup: state.responsibilitygroup,
          responsibilitycenter: state.responsibilitycenter,
          projectname: state.projectname,
          object: state.object,
          objecttype: state.objecttype,
          groupname: state.groupname,
        };

        const response = await axios.get(API.GET_DASHBOARD_API, {
          params: queryParams,
        });

        setRespGroup(await fetchDataFromAPI(API.GET_GOVERNANCE_API, queryParams));
        setRespCenter(await fetchDataFromAPI(API.GET_GOVERNANCE_API, queryParams));
        setProject(await fetchDataFromAPI(API.GET_GOVERNANCE_API, queryParams));
        setOrganizationComp(await fetchDataFromAPI(API.GET_GOVERNANCE_API, queryParams));

        setUser(response.data);
        console.log("User Data", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [state, resultid, selectedItem1]);

  const filterUniqueGroupNames = (groupArray) => {
    return groupArray.filter((item, index, self) =>
      index === self.findIndex((t) => 
        t.goverenceid === item.goverenceid &&
        t.riskid === item.riskid &&
        t.checklistid === item.checklistid &&
        t.algorithminventoryid === item.algorithminventoryid
      )
    );
  };

  const handleInputChange = (e) => {
    setIsVisible(Object.values(state).some((val) => val !== ""));
    const { name, value } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const fetchDataFromAPI = async (apiEndpoint, queryParams) => {
    const response = await axios.get(apiEndpoint, { params: queryParams });
    return response.data;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

 
  const handleItemClick = async (item, type) => {
    switch (type) {
      case 'risk':
        await handleClickRisk(item.riskname, item.count, type);
        setSelectedDetailType('risk');
        break;
      case 'issue':
        await handleClickIssue(item.issuename, item.count, type);
        setSelectedDetailType('issue');
        break;
      case 'algorithm':
        await handleClickAlgorithm(item.algorithm, item.count, type);
        setSelectedDetailType('algorithm');
        break;
      case 'evidence':
        await handleClickEvidence(item.evidence, item.count, type);
        setSelectedDetailType('evidence');
        break;
      case 'assessmentreferencelink':
        await handleClickAssessment(item.assessmentreferencelink, item.count, type);
        setSelectedDetailType('assessmentreferencelink');
        break;
      case 'auditreferencelink':
        await handleClickAudit(item.auditreferencelink, item.count, type);
        setSelectedDetailType('auditreferencelink');
        break;
        case 'checklist':
        await handleClickChecklist(item.theme, item.count, type);
        setSelectedDetailType('checklist');
        break;
        case 'governancetestresult':
          await handleClickGovernance(item.subcontrolname, item.count, type);
          setSelectedDetailType('governancetestresult');
          break;
      default:
        console.error('Invalid type');
    }
  };
  

  const handleClickRisk = async (riskname, count, sourceLink) => {
    try {
      const response = await axios.get(API.GET_RISK_API, {
        params: { riskname, count, sourceLink }
      });
      setSelectedRiskDetail(response.data);
    } catch (error) {
      console.error("Error fetching risk detail:", error);
    }
  };

  const handleClickIssue = async () => {
    try {
      const response = await axios.get(API.GET_ISSUE_API, {
        params: {
          organization: state.organization,
          responsibilitygroup: state.responsibilitygroup,
          responsibilitycenter: state.responsibilitycenter,
          projectname: state.projectname,
          object: state.object,
          objecttype: state.objecttype,
          groupname: state.groupname,
        },
      });
      setIssueData(response.data); // Set issue data into state
    } catch (error) {
      console.error("Error fetching issue data:", error);
    }
  };

  const handleClickAlgorithm = async (algorithm, count, sourceLink) => {
    try {
      const response = await axios.get(API.GET_ALGORITHMINVENTORY_API, {
        params: { algorithm, count, sourceLink }
      });
      setAlgorithmData(response.data); // Set algorithm data into state
    } catch (error) {
      console.error("Error fetching algorithm detail:", error);
    }
  };

  const handleClickEvidence = async () => {
    try {
      const response = await axios.get(API.GET_GOVERNANCE_API, {
        params: {
          organization: state.organization,
          responsibilitygroup: state.responsibilitygroup,
          responsibilitycenter: state.responsibilitycenter,
          projectname: state.projectname,
          object: state.object,
          objecttype: state.objecttype,
          groupname: state.groupname,
        },
      });
      setEvidenceData(response.data); // Set evidence data into state
    } catch (error) {
      console.error("Error fetching evidence data:", error);
    }
  };
  const handleClickAssessment = async () => {
    try {
      const response = await axios.get(API.GET_GOVERNANCE_API, {
        params: {
          organization: state.organization,
          responsibilitygroup: state.responsibilitygroup,
          responsibilitycenter: state.responsibilitycenter,
          projectname: state.projectname,
          object: state.object,
          objecttype: state.objecttype,
          groupname: state.groupname,
        },
      });
      setAssessmentData(response.data); // Set assessment data into state
    } catch (error) {
      console.error("Error fetching assessment data:", error);
    }
  };

  const handleClickAudit = async () => {
    try {
      const response = await axios.get(API.GET_GOVERNANCE_API, {
        params: {
          organization: state.organization,
          responsibilitygroup: state.responsibilitygroup,
          responsibilitycenter: state.responsibilitycenter,
          projectname: state.projectname,
          object: state.object,
          objecttype: state.objecttype,
          groupname: state.groupname,
        },
      });
      setAuditData(response.data); // Set audit data into state
    } catch (error) {
      console.error("Error fetching audit data:", error);
    }
  };

  const handleClickChecklist = async () => {
    try {
      const response = await axios.get(API.GET_CHECKLIST_API, {
        params: {
          organization: state.organization,
          responsibilitygroup: state.responsibilitygroup,
          responsibilitycenter: state.responsibilitycenter,
          projectname: state.projectname,
          object: state.object,
          objecttype: state.objecttype,
          groupname: state.groupname,
        },
      });
      setChecklistData(response.data); // Set audit data into state
    } catch (error) {
      console.error("Error fetching audit data:", error);
    }
  };


  const handleClickGovernance = async () => {
    try {
      const response = await axios.get(API.GET_GOVERNANCE_API, {
        params: {
          organization: state.organization,
          responsibilitygroup: state.responsibilitygroup,
          responsibilitycenter: state.responsibilitycenter,
          projectname: state.projectname,
          object: state.object,
          objecttype: state.objecttype,
          groupname: state.groupname,
        },
      });
      setGovernanceData(response.data); // Set audit data into state
    } catch (error) {
      console.error("Error fetching audit data:", error);
    }
  };

  const renderDetailDataTable = () => {
    switch (selectedDetailType) {
      case 'risk':
        return renderRiskDetailDataTable();
      case 'issue':
        return renderIssueDetailDataTable();
      case 'algorithm':
        return renderAlgorithmDetailDataTable();
      case 'evidence':
        return renderEvidenceDetailDataTable();
      case 'assessmentreferencelink':
        return renderAssessmentDetailDataTable();
      case 'auditreferencelink':
        return renderAuditDetailDataTable();
      case 'checklist':
        return renderChecklistTable();
      case 'governancetestresult':
          return renderGovernanceTestResultTable();  
      default:
        return null;
    }
  };
  
  const renderRiskDetailDataTable = () => {
    if (!selectedRiskDetail) return null;
    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
        <tr>
            <th>No</th>
            <th>Risk Name</th>
            <th>Risk Code</th>
            <th>Risk Severity</th>
            <th>Risk Group</th>
            <th>Date</th>
            <th>Confidentiality</th>
            <th>Availability</th>
            <th>Integrity</th>
            <th>Probability</th>
            <th>Impact</th>
            <th>Risk Exposure</th>
            <th>Residual Risk</th>
            <th>Control Owner</th>
            <th>Group Name</th>
            <th>Thrust Area</th>
            <th>Control</th>
            <th>Control Weight</th>
            <th>Sub-Control</th>
            <th>Sub-Control Weight</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
        {selectedRiskDetail.map((item, index) => (
          <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.riskname}</td>
              <td>{item.riskcode}</td>
              <td>{item.severity}</td>
              <td>{item.riskgroup}</td>
              <td>{item.date}</td>
              <td>{item.confidentiality}</td>
              <td>{item.availability}</td>
              <td>{item.integrity}</td>
              <td>{item.probability}</td>
              <td>{item.impact}</td>
              <td>{item.riskexposure}</td>
              <td>{item.residualrisk}</td>
              <td>{item.controlowner}</td>
              <td>{item.groupname}</td>
              <td>{item.thrustarea}</td>
              <td>{item.controlname}</td>
              <td>{item.controlwt}</td>
              <td>{item.subcontrolname}</td>
              <td>{item.subcontrolwt}</td>
              <td>{item.remark}</td>
            </tr>
             ))}
        </tbody>
      </table>
    );
  };


  const renderIssueDetailDataTable = () => {
    if (!issueData) return null;

    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Project Name</th>
            <th>Project Code</th>
            <th>Code Name</th>
            <th>Issue Name</th>
            <th>Object</th>
            <th>Object Type</th>
            <th>Issue Date</th>
            <th>Process Issue</th>
            <th>Coding Issue</th>
            <th>Resource Issue</th>
            <th>Infrastructure Issue</th>
            <th>Model Issue</th>
            <th>Performance Issue</th>
            <th>Security Issue</th>
            <th>Data Issue</th>
          </tr>
        </thead>
        <tbody>
          {issueData.map((item, index) => (
            <tr key={index}>
              <td>{item.organization}</td>
              <td>{item.responsibilitygroup}</td>
              <td>{item.responsibilitycenter}</td>
              <td>{item.projectname}</td>
              <td>{item.projectcode}</td>
              <td>{item.codename}</td>
              <td>{item.issuename}</td>
              <td>{item.object}</td>
              <td>{item.objecttype}</td>
              <td>{item.issuedate}</td>
              <td>{item.processissue}</td>
              <td>{item.codingissue}</td>
              <td>{item.resourceissue}</td>
              <td>{item.infrastructureissue}</td>
              <td>{item.modelissue}</td>
              <td>{item.performanceissue}</td>
              <td>{item.securityissue}</td>
              <td>{item.dataissue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };



 const renderAlgorithmDetailDataTable = () => {
    if (!algorithmData) return null;

    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Project Name</th>
            <th>Project Code</th>
            <th>Algorithm Inventory Date</th>
            <th>Algorithm Inventory Time</th>
            <th>Algorithm</th>
            <th>Algorithm Remark</th>
          </tr>
        </thead>
        <tbody>
          {algorithmData.map((item, index) => (
            <tr key={index}>
              <td>{item.organization}</td>
              <td>{item.responsibilitygroup}</td>
              <td>{item.responsibilitycenter}</td>
              <td>{item.projectname}</td>
              <td>{item.projectcode}</td>
              <td>{item.algorithminventorydate}</td>
              <td>{item.algorithminventorytime}</td>
              <td>{item.algorithm}</td>
              <td>{item.algorithmremark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };


  const renderEvidenceDetailDataTable = () => {
    if (!evidenceData) return null;

    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Evidence</th>
            <th>Evidence Reference Link</th>
            <th>Evidence Remark</th>
            <th>Evidence Upload</th>
            <th>Evidence Status</th>
          </tr>
        </thead>
        <tbody>
          {evidenceData.map((item, index) => (
            <tr key={index}>
              <td>{item.organization}</td>
              <td>{item.responsibilitygroup}</td>
              <td>{item.responsibilitycenter}</td>
              <td>{item.evidence}</td>
              <td>{item.evidencereferencelink}</td>
              <td>{item.evidenceremark}</td>
              <td>{item.evidenceupload}</td>
              <td>{item.evidencestatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAssessmentDetailDataTable = () => {
    if (!assessmentData) return null;

    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Project Name</th>
            <th>Assessment Reference Link</th>
            <th>Assessment Remark</th>
            <th>Assessment Upload</th>
            <th>Assessment Status</th>
            <th>Assessment Score</th>
          </tr>
        </thead>
        <tbody>
          {assessmentData.map((item, index) => (
            <tr key={index}>
              <td>{item.organization}</td>
              <td>{item.responsibilitygroup}</td>
              <td>{item.responsibilitycenter}</td>
              <td>{item.projectname}</td>
              <td>{item.assessmentreferencelink}</td>
              <td>{item.assessmentremark}</td>
              <td>{item.assessmentupload}</td>
              <td>{item.assessmentstatus}</td>
              <td>{item.assessmentscore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAuditDetailDataTable = () => {
    if (!auditData) return null;

    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Project Name</th>
            <th>Audit Reference Link</th>
            <th>Audit Remark</th>
            <th>Audit Upload</th>
            <th>Audit Status</th>
            <th>Audit Score</th>
          </tr>
        </thead>
        <tbody>
          {auditData.map((item, index) => (
            <tr key={index}>
              <td>{item.organization}</td>
              <td>{item.responsibilitygroup}</td>
              <td>{item.responsibilitycenter}</td>
              <td>{item.projectname}</td>
              <td>{item.auditreferencelink}</td>
              <td>{item.auditremark}</td>
              <td>{item.auditupload}</td>
              <td>{item.auditstatus}</td>
              <td>{item.auditscore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderChecklistTable = () => {
    if (!checklistData) return null;
    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Project Name</th>
            <th>Phase</th>
            <th>Theme</th>
            <th>Activity Group</th>
            <th>Activity</th>
            <th>Expected Evidence</th>
            <th>Remark</th>
            <th>Percentage Completion</th>
            <th>Actual Evidence</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {checklistData.map((item, index) => (
            <tr key={index}>
              <td>{item.organization}</td>
              <td>{item.responsibilitygroup}</td>
              <td>{item.responsibilitycenter}</td>
              <td>{item.projectname}</td>
              <td>{item.phase}</td>
              <td>{item.theme}</td>
              <td>{item.activitygroup}</td>
              <td>{item.activity}</td>
              <td>{item.expectedevidence}</td>
              <td>{item.remark}</td>
              <td>{item.percentagecompletion}</td>
              <td>{item.actualevidence}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  const renderGovernanceTestResultTable = () => {
    if (!governanceTestResultData) return null;
    return (
      <table className="styled-table" style={{ margin: "20px auto", width: "80%" }}>
        <thead>
          <tr>
            <th>Organization</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Control Name</th>
            <th>Control Weight</th>
           <th>Sub-Control Name</th>
            <th>Sub-Control Weight</th>
          </tr>
        </thead>
        <tbody>
          {governanceTestResultData.map((item, index) => (
            <tr key={index}>
              <td>{item.organization}</td>
              <td>{item.responsibilitygroup}</td>
              <td>{item.responsibilitycenter}</td>
              <td>{item.controlname}</td>
              <td>{item.controlwt}</td>
              <td>{item.subcontrolname}</td>
              <td>{item.subcontrolwt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  const getSourceLinkName = (sourcelink) => {
    switch (sourcelink) {
      case 'risk':
        return 'Risk';
      case 'issue':
        return 'Issue';
      case 'checklist':
        return 'CheckList';
      case 'assessmentreferencelink':
        return 'Assessment';
      case 'auditreferencelink':
        return 'Audit';
      case 'governancetestresult':
        return 'Governance';
      case 'evidence':
          return 'Evidence';  
      case 'algorithm':
          return 'Algorithm';  
      default:
        return sourcelink; // Return the sourcelink value as is if it doesn't match any of the above
    }
  };
  
  return (
    <div>
      <Header />
      <div>
        <form onSubmit={handleSubmit}>
          <center>
            <h1 style={{ marginTop: "2px", marginBottom: "6px" }}>
              <label htmlFor="objecttype">DashBoard</label>
            </h1>
          </center>
          <hr />
          <div
            style={{
              marginRight: "50px",
              marginLeft: "50px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "10px",
            }}
          >
            {/* Dropdowns here */}
            {/* Organization Dropdown */}
            <div>
              <label>Organization:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="organization"
                name="organization"
                value={state.organization}
                onChange={handleInputChange}
              >
                <option value="">Organization</option>
                {filterUniqueGroupNames(organizationComp).map((comp) => (
                  <option key={comp.resultid} value={comp.organization}>
                    {comp.organization}
                  </option>
                ))}
              </select>
            </div>
            {/* Responsibility Group Dropdown */}
            <div>
              <label>Responsibility group:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitygroup"
                name="responsibilitygroup"
                value={state.responsibilitygroup}
                onChange={handleInputChange}
              >
                <option value="">Responsibility Group</option>
                {filterUniqueGroupNames(respGroup).map((respgroup) => (
                  <option
                    key={respgroup.resultid}
                    value={respgroup.responsibilitygroup}
                  >
                    {respgroup.responsibilitygroup}
                  </option>
                ))}
              </select>
            </div>
            {/* Responsibility Center Dropdown */}
            <div>
              <label>Responsibility Center:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitycenter"
                name="responsibilitycenter"
                value={state.responsibilitycenter}
                onChange={handleInputChange}
              >
                <option value="">Responsibility Center</option>
                {filterUniqueGroupNames(respCenter).map((respcenter) => (
                  <option
                    key={respcenter.resultid}
                    value={respcenter.responsibilitycenter}
                  >
                    {respcenter.responsibilitycenter}
                  </option>
                ))}
              </select>
            </div>
            {/* projectnameDropdown */}
            <div>
              <label>Project:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                type="text"
                id="projectname"
                name="projectname"
                placeholder="Enter the Project"
                value={state.projectname}
                onChange={handleInputChange}
              >
                <option value="">Project</option>
                {filterUniqueGroupNames(projectName).map((project) => (
                  <option key={project.resultid} value={project.projectname}>
                    {project.projectname}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ margin: "20px auto", width: "80%" }}>   
            {isVisible && (
              <table className="styled-table" style={{ marginLeft: "10px", marginRight: "10px" }}>
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Responsibility Group</th>
                    <th>Responsibility Center</th>
                    <th>Project Name</th>
                    <th>Source Link</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((item, index) => (
                    <tr key={index}>
                      <td>{item.organization}</td>
                      <td>{item.responsibilitygroup}</td>
                      <td>{item.responsibilitycenter}</td>
                      <td>{item.projectname}</td>
                      <td>{getSourceLinkName(item.sourcelink)}</td>
                   <td>
                    <a href="#" onClick={() => {
                      console.log("Item clicked:", item);
                      handleItemClick(item,item.sourcelink);
                    }}>
                      {item.count}
                    </a>
                  </td>
 </tr>
                  ))}
                </tbody>
              </table>
            )}
             {showModal && <Modal closeModal={() => setShowModal(false)} modalData={modalData} />}
      {renderDetailDataTable()}
          </div>
          <div style={{ display: isVisibleGraph ? "block" : "none" }}>
            <canvas id="myChart" ref={chartRef}></canvas>
          </div>
        </form>
      </div>
    </div>  
  );
};

export default DashBoardTable;
