import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";

const initialState = {
  organization: "",
  projectname: "",
  responsibilitygroup: "",
  responsibilitycenter: "",
  objecttype: "",
  objectcode: "",
  evidencereferencelink: "", // Set default value
  evidenceremark: "", // Set default value
  evidenceupload: "", // Set default value
  evidencestatus: "", // Set default value
  controlname: "", // Set default value
  subcontrolname: "", // Set default value
  thrustarea: "", // Set default value
};

const EvidenceAddEdit = () => {
  const [state, setState] = useState(initialState);
  const [evidenceData, setEvidenceData] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [respGroup, setRespGroup] = useState([]);
  const [respCenter, setRespCenter] = useState([]);
  const [organizationComp, setOrganizationComp] = useState([]);
  const [objectType, setObjectType] = useState([]);
  const [objectName, setObjectName] = useState([]);
  const [projectalg, setProjecectAlg] = useState([]);

  const {
    organization,
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    objecttype,
    objectcode,
    evidencereferencelink,
    evidenceremark,
    evidenceupload,
    evidencestatus,
    controlname,
    subcontrolname,
    thrustarea,
  } = state;

  const navigate = useNavigate();

  const { datalineageid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for respGroup
        const respGroupData = await axios.get(API.GET_RESPONSIBILITY_GROUP);
        setRespGroup(respGroupData.data);

        // Fetch data for respCenter
        const respCenterData = await axios.get(API.GET_RESPONSIBILITY_CENTER);
        setRespCenter(respCenterData.data);

        const organizationCompData = await axios.get(API.GET_COMPANY_API);
        setOrganizationComp(organizationCompData.data);

        axios
          .get(API.GET_OBJECTTYPE_API)
          .then((resp) => setObjectType(resp.data));

        axios
          .get(API.OBJECTGET_OBJECTNAME_API)
          .then((resp) => setObjectName(resp.data));

        const projectalg = await axios.get(API.GET_PROJECT_API);
        setProjecectAlg(projectalg.data);

        if (datalineageid) {
          const resp = await axios.get(API.GET_DATALINEAGE_API(datalineageid));
          setState({ ...resp.data[0] });
        }

        if (projectname) {
          try {
            const evidenceResponse = await axios.get(
              API.GET_COMPANYPROJECT_API,
              {
                params: { projectname: projectname },
              }
            );
            setEvidenceData(evidenceResponse.data);
          } catch (error) {
            console.error(error);
            toast.error("An error occurred while fetching evidence data");
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching data");
      }
    };

    fetchData();
  }, [datalineageid, projectname]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    // Ensure value is not null or undefined before setting it
    setState({ ...state, [name]: value || "" });

    if (name === "projectname") {
      console.log("Updated Project Name:", value);
      try {
        const evidenceResponse = await axios.get(API.COMPANY_PROJECT_API, {
          params: { projectname: value },
        });
        console.log("Evidence Response:", evidenceResponse.data);

        setEvidenceData(evidenceResponse.data);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching evidence data");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Request Payload:", {
      organization,
      projectname,
      responsibilitygroup,
      responsibilitycenter,
      objecttype,
      objectcode,
      evidenceData: selectedEvidence,
      // ... other properties
    });

    if (!organization) {
      toast.error("Please provide a value into each input field");
    } else {
      if (!datalineageid) {
        console.log("Adding new evidence...");

        axios
          .post(API.ADD_DATALINEAGE_API, {
            organization,
            projectname,
            responsibilitygroup,
            responsibilitycenter,
            objecttype,
            objectcode,
            evidenceData: selectedEvidence,
          })
          .then((response) => {
            console.log("Add evidence response:", response.data);
            setState({
              organization: " ",
              projectname: " ",
              responsibilitygroup: " ",
              responsibilitycenter: " ",
              objecttype: " ",
              objectcode: " ",
              evidencereferencelink: " ",
              evidenceremark: " ",
              evidenceupload: " ",
              evidencestatus: " ",
              controlname: " ",
              subcontrolname: " ",
              thrustarea: " ",
            });
          })
          .catch((err) => {
            console.error("Error adding evidence:", err.response.data);
            toast.error(err.response.data);
          });

        toast.success("Added successfully");
      } else {
        console.log("Updating evidence...");

        axios
          .put(API.UPDATE_EVIDENCE_API(datalineageid), {
            organization,
            projectname,
            responsibilitygroup,
            responsibilitycenter,
            objecttype,
            objectcode,
            evidenceData: selectedEvidence,
          })
          .then((response) => {
            console.log("Update evidence response:", response.data);
            setState({
              organization: " ",
              projectname: " ",
              responsibilitygroup: " ",
              responsibilitycenter: " ",
              objecttype: " ",
              objectcode: " ",
              evidencereferencelink: " ",
              evidenceremark: " ",
              evidenceupload: " ",
              evidencestatus: " ",
              controlname: " ",
              subcontrolname: " ",
              thrustarea: " ",
            });
          })
          .catch((err) => {
            console.error("Error updating evidence:", err.response.data);
            toast.error(err.response.data);
          });

        toast.success("Evidence updated successfully");
      }
      setTimeout(() => navigate("/datalineage"), 500);
    }
  };

  const initialEvidenceData = evidenceData.map((evidence) => ({
    ...evidence,
    isChecked: true,
  }));

  const handleCheckboxChange = (resultId) => {
    setEvidenceData((prevEvidenceData) =>
      prevEvidenceData.map((evidence) => {
        if (evidence.resultid === resultId) {
          const updatedEvidence = {
            ...evidence,
            isChecked: !evidence.isChecked,
          };

          setSelectedEvidence((prevSelected) => {
            const existingIndex = prevSelected.findIndex(
              (selected) => selected.resultid === resultId
            );

            if (existingIndex !== -1) {
              // If the evidence is already in selectedEvidence, update it
              const updatedSelectedEvidence = [...prevSelected];
              updatedSelectedEvidence[existingIndex] = updatedEvidence;
              return updatedSelectedEvidence;
            } else {
              // If the evidence is not in selectedEvidence, add it
              return [...prevSelected, updatedEvidence];
            }
          });
          console.log("selected Evidence :", selectedEvidence);

          return updatedEvidence;
        }

        return evidence;
      })
    );
  };

  return (
    <div>
      <Header />
      <div>
        <form onSubmit={handleSubmit}>
          <center>
            <h1 style={{ marginTop: "2px", marginBottom: "2px" }}>
              <label htmlFor="objecttype">Evidence</label>
            </h1>
          </center>
          <hr></hr>

          <div
            style={{
              marginRight: "50px",
              marginLeft: "50px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label>Company:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="organization"
                name="organization"
                value={organization}
                onChange={handleInputChange}
              >
                <option value="">Company</option>
                {organizationComp.map((comp) => (
                  <option key={comp.companyid} value={comp.organization}>
                    {comp.organization}
                  </option>
                ))}
              </select>
              <br />
            </div>
            <div>
              <label>Project:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="projectname"
                name="projectname"
                value={projectname}
                onChange={handleInputChange}
              >
                <option value="">Project </option>
                {projectalg.map((proj) => (
                  <option key={proj.projectid} value={proj.projectname}>
                    {proj.projectname}
                  </option>
                ))}
              </select>
              <br />
            </div>
            <div>
              <label> Responsibilty group:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitygroup"
                name="responsibilitygroup"
                value={responsibilitygroup || ""}
                onChange={handleInputChange}
              >
                <option value="">Responsibilty Group</option>
                {respGroup.map((respgroup) => (
                  <option
                    key={respgroup.responsibilityid}
                    value={respgroup.responsibilitytype}
                  >
                    {respgroup.responsibilitytype}
                  </option>
                ))}
              </select>
              <br />
            </div>
            <div>
              <label> Responsibilty Center:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="responsibilitycenter"
                name="responsibilitycenter"
                value={responsibilitycenter || ""}
                onChange={handleInputChange}
              >
                <option value="">Responsibilty Center</option>
                {respCenter.map((respcenter) => (
                  <option
                    key={respcenter.responsibilitynameid}
                    value={respcenter.responsibilitytype}
                  >
                    {respcenter.responsibilitytype}
                  </option>
                ))}
              </select>
              <br />
            </div>
            <div>
              <label>Object Type:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="objecttype"
                name="objecttype"
                value={objecttype}
                onChange={handleInputChange}
              >
                <option value="">Object Type</option>
                {objectType.map((objtype) => (
                  <option key={objtype.objectid} value={objtype.objecttype}>
                    {objtype.objecttype}
                  </option>
                ))}
              </select>
              <br />
            </div>
            <div>
              <label>Object Name:</label>
              <select
                style={{ fontFamily: "Poppins" }}
                id="objectcode"
                name="objectcode"
                value={objectcode}
                onChange={handleInputChange}
              >
                <option value="">Object Name</option>
                {objectName.map((objname) => (
                  <option key={objname.nameid} value={objname.objectcode}>
                    {objname.objectcode}
                  </option>
                ))}
              </select>
              <br />
            </div>
          </div>

          <table className="styled-table">
            <thead>
              <tr>
                <th>EvidenceId</th>
                <th>Evidence</th>
                <th>Evidence Reference Link</th>
                <th>Evidence Remark</th>
                <th>Evidence File</th>
                <th>Evidence Status</th>
                <th>controlname</th>
                <th>subcontrolname</th>
                <th>thrustarea</th>
              </tr>
            </thead>
            <tbody>
              {evidenceData.map((evidence) => (
                <tr key={evidence.resultid}>
                  <td>{evidence.resultid}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={evidence.isChecked}
                      onChange={() => handleCheckboxChange(evidence.resultid)}
                    />
                  </td>

                  <td>{evidence.evidencereferencelink}</td>
                  <td>{evidence.evidenceremark}</td>
                  <td>{evidence.evidenceupload}</td>
                  <td>{evidence.evidencestatus}</td>
                  <td>{evidence.controlname}</td>
                  <td>{evidence.subcontrolname}</td>
                  <td>{evidence.thrustarea}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <center>
            <div style={{ width: "30%", marginTop: "20px" }}>
              <input type="submit" value={datalineageid ? "update" : "Load"} />
              <Link to="/datalineage"> </Link>
            </div>
          </center>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EvidenceAddEdit;
