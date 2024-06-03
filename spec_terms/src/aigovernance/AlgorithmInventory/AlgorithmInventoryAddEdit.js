import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./AlgorithmInventory.css";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
import AlgorithmOutputTable from "./AlgorithmInventoryTestResults/AlgorithmOutputTable"; // Import the new component
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import DataSetOutputTable from "./AlgorithmInventoryTestResults/DataSetOutputTable";
import CodeVulnerabilittyOutput from "./AlgorithmInventoryTestResults/CodeVulnerabilittyOutput";
import PrivacyDataOutput from "./AlgorithmInventoryTestResults/PrivacyDataOutput";

export function CircularIndeterminate() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

const initialState = {
  organization: " ",
  responsibilitygroup: " ",
  responsibilitycenter: " ",
  algorithminventorydate: null,
  projectname: " ",
  projectcode: " ",
  algorithminventorytime: " ",
  algorithm: " ",
  algorithmbias: " ",
  algorithmremark: " ",
  dataset: " ",
  databias: " ",
  dataremark: " ",
  codevulnerability: " ",
  codevulnerabilitybias: " ",
  codevulnerabilityremark: " ",
  privacydata: " ",
  privacydatabias: " ",
  privacydataremark: " ",
  algorithmtestoutputurl: " ",
  datasettestoutputurl: " ",
  codevulnerabilitytestoutputurl: " ",
  privacytestoutputurl: " ",
  datasetstatus: " ",
  algorithmstatus: " ",
  codevulnerabilitystatus: " ",
  privacydatastatus: " ",
  explanability: " ",
  transparency: " ",
  fairness: "",
  ethics: " ",
  robustness: " ",
  reliability: " ",
  codename: " ",
  algorithmversionno: " ",
  datasetversionno: " ",
  codevulnerabilityversionno: " ",
  privacyversionno: " ",
  algorithmversiondate: " ",
  datasetversiondate: " ",
  codevulnerabilityversiondate: " ",
  privacyversiondate: " ",
  bias: " ",
  security: " ",
  robustnessremark: " ",
  explanabilityremark: " ",
  transparencyremark: " ",
  fairnessremark: " ",
  biasremark: " ",
  ethicsremark: " ",
  reliabilityremark: " ",
  securityremark: " ",
  performance: " ",
  accountability: " ",
  privacy: " ",
  privacyremark: " ",
  performanceremark: " ",
  accountabilityremark: " ",
  assessmentremark: " ",
  assessmentfile: "",
  assessmentdate: "",
  auditremark: "",
  auditfile: null,
  auditdate: "",
  severity: "",
  vendorname: "",
  technologyname: "",
  datasetname: "",
  themename: "",
  objecttype: "",
  object: "",
  environment: "",
  environmenttype: "",
  resilience: "",
  resilienceremark: "",
};
const AlgorithmInventoryAddEdit = () => {
  const [state, setState] = useState(initialState);

  const [respGroup, setRespGroup] = useState([]);

  const [respCenter, setRespCenter] = useState([]);

  const [organizationComp, setOrganizationComp] = useState([]);

  const [projectalg, setProjecectAlg] = useState([]);

  const [isReadOnly] = useState(false);

  const [riskSeverity, setRiskSeverity] = useState([]);

  const [datasets, setDataSet] = useState([]);
  const [theme, setTheme] = useState([]);
  const [objtype, setobjecttype] = useState([]);
  const [obj, setobject] = useState([]);
  const [vendorName, setVendorName] = useState([]);
  const [technologyName, setTechnologyName] = useState([]);
  const [environmentName, setEnvironment] = useState([]);
  const [environmenttypeName, setEnvironmenttype] = useState([]);

  const [algorithmFile, setAlgorithmFile] = useState(null);
  const [algorithmTestOutputUrl, setAlgorithmTestOutputUrl] = useState("");
  const [algorithmTestData, setAlgorithmTestData] = useState([]);

  /****************************************** */
  const [dataSetFile, setDataSetFile] = useState(null);
  const [dataSetTestOutputUrl, setDataSetTestOutputUrl] = useState("");
  const [dataSetTestData, setDataSetTestData] = useState([]);

  /******************************************** */
  const [codevulnerabilityFile, setCodeVulnerabilityFile] = useState(null);
  const [codevulnerabilityTestOutputUrl, setCodeVulnerabilityTestOutputUrl] =
    useState("");
  /*************************************00 */
  const [privacyDataFile, setPrivacyDataFile] = useState([]);
  const [privacyDataTestOutputUrl, setPrivacyDataTestOutputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  // const [vendor, setVendor] = useState([]);

  const {
    organization,
    responsibilitygroup,
    responsibilitycenter,
    algorithminventorydate,
    projectname,
    projectcode,
    algorithminventorytime,
    algorithm,
    algorithmbias,
    algorithmremark,
    algorithmbiasstatus,
    dataset,
    codevulnerability,
    codevulnerabilitybias,
    codevulnerabilityremark,
    databias,
    dataremark,
    privacydata,
    privacydatabias,
    privacydataremark,
    algorithmtestoutputurl,
    datasettestoutputurl,
    codevulnerabilitytestoutputurl,
    privacytestoutputurl,
    datasetstatus,
    algorithmstatus,
    codevulnerabilitystatus,
    privacydatastatus,
    explanability,
    transparency,
    fairness,
    ethics,
    robustness,
    reliability,
    codename,
    algorithmversionno,
    datasetversionno,
    codevulnerabilityversionno,
    privacyversionno,
    algorithmversiondate,
    datasetversiondate,
    codevulnerabilityversiondate,
    privacyversiondate,
    bias,
    security,
    robustnessremark,
    explanabilityremark,
    transparencyremark,
    fairnessremark,
    biasremark,
    ethicsremark,
    reliabilityremark,
    securityremark,
    performance,
    accountability,
    privacy,
    privacyremark,
    performanceremark,
    accountabilityremark,
    assessmentremark,
    assessmentfile,
    assessmentdate,
    auditremark,
    auditfile,
    auditdate,
    severity,
    datasetname,
    themename,
    objecttype,
    object,
    vendorname,
    technologyname,
    environment,
    environmenttype,
    resilience,
    resilienceremark,
  } = state;

  const navigate = useNavigate();

  const { algorithminventoryid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for respGroup
        const respGroupData = await axios.get(API.GET_RESPONSIBILITY_GROUP);
        setRespGroup(respGroupData.data);

        // Fetch data for respCenter
        const respCenterData = await axios.get(API.GET_RESPONSIBILITY_CENTER);
        setRespCenter(respCenterData.data);

        // Fetch data for organizationComp
        const organizationCompData = await axios.get(API.GET_COMPANY_API);
        setOrganizationComp(organizationCompData.data);

        const projectalg = await axios.get(API.GET_PROJECT_API);
        setProjecectAlg(projectalg.data);

        const dataset = await axios.get(API.GET_DATASET_API);
        setDataSet(dataset.data);
        const theme = await axios.get(API.API_THEMEACTIVITY_GET);
        setTheme(theme.data);
        // Fetch data for editing if algorithminventoryid is present
        const objtype = await axios.get(API.GET_OBJECTTYPE_API);
        setobjecttype(objtype.data);
        const obj = await axios.get(API.OBJECTGET_OBJECTNAME_API);
        setobject(obj.data);
        const vend = await axios.get(API.GET_VENDORMASTER_API);
        setVendorName(vend.data);
        const tech = await axios.get(API.GET_TECHNOLOGY_API);
        setTechnologyName(tech.data);
        const envo = await axios.get(API.GET_ENVIRONMENT_API);
        setEnvironment(envo.data);
        const envotype = await axios.get(API.GET_ENVIRONMENTTYPE_API);
        setEnvironmenttype(envotype.data);

        if (algorithminventoryid) {
          const resp = await axios.get(
            API.GET_ALGORITHMINVENTORY_BYID(algorithminventoryid)
          );
          setState({ ...resp.data[0] });
        }
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while fetching data");
      }
    };
    const formatDate = (date) => {
      if (!(date instanceof Date)) {
        // If date is not a valid Date object, return an empty string or handle as needed
        return "";
      }

      // Get the date in "yyyy-MM-dd" format
      return date.toISOString().split("T")[0];
    };

    fetchData();
    axios
      .get(API.GET_RISKSEVERIT_API)
      .then((resp) => setRiskSeverity(resp.data));
  }, [algorithminventoryid]);
  const handleAdditionalFieldsClick = () => {
    setShowAdditionalFields(!showAdditionalFields);
  };

  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

  const handlSubmit = (e) => {
    e.preventDefault();
    if (!organization) {
      toast.error("please provider value into each input field");
    } else {
      if (!algorithminventoryid) {
        axios
          .post(API.ADD_ALGORITHM_INVENTORY, {
            organization,
            responsibilitygroup,
            responsibilitycenter,
            algorithminventorydate,
            projectname,
            projectcode,
            algorithminventorytime,
            algorithm,
            algorithmbias,
            algorithmremark,
            algorithmbiasstatus,
            dataset,
            codevulnerability,
            codevulnerabilitybias,
            codevulnerabilityremark,
            databias,
            dataremark,
            privacydata,
            privacydatabias,
            privacydataremark,
            algorithmtestoutputurl: algorithmTestData,
            datasettestoutputurl: dataSetTestData,
            codevulnerabilitytestoutputurl: codevulnerabilityTestOutputUrl,
            privacytestoutputurl: privacyDataTestOutputUrl,
            datasetstatus,
            algorithmstatus,
            codevulnerabilitystatus,
            privacydatastatus,
            explanability,
            transparency,
            fairness,
            ethics,
            robustness,
            reliability,
            codename,
            algorithmversionno,
            datasetversionno,
            codevulnerabilityversionno,
            privacyversionno,
            algorithmversiondate,
            datasetversiondate,
            codevulnerabilityversiondate,
            privacyversiondate,
            bias,
            security,
            robustnessremark,
            explanabilityremark,
            transparencyremark,
            fairnessremark,
            biasremark,
            ethicsremark,
            reliabilityremark,
            securityremark,
            performance,
            accountability,
            privacy,
            privacyremark,
            performanceremark,
            accountabilityremark,
            assessmentremark,
            assessmentfile,
            assessmentdate,
            auditremark,
            auditfile,
            auditdate,
            severity,
            datasetname,
            themename,
            objecttype,
            object,
            vendorname,
            technologyname,
            environment,
            environmenttype,
            resilience,
            resilienceremark,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success(" Inventory added successfully");
      } else {
        axios
          .put(API.UPDATE_ALGORITHM_INVENTORY(algorithminventoryid), {
            organization,
            responsibilitygroup,
            responsibilitycenter,
            algorithminventorydate,
            projectname,
            projectcode,
            algorithminventorytime,
            algorithm,
            algorithmbias,
            algorithmremark,
            algorithmbiasstatus,
            dataset,
            codevulnerability,
            codevulnerabilitybias,
            codevulnerabilityremark,
            databias,
            dataremark,
            privacydata,
            privacydatabias,
            privacydataremark,
            algorithmtestoutputurl: algorithmTestData,
            datasettestoutputurl: dataSetTestData,
            codevulnerabilitytestoutputurl: codevulnerabilityTestOutputUrl,
            privacytestoutputurl: privacyDataTestOutputUrl,
            datasetstatus,
            algorithmstatus,
            codevulnerabilitystatus,
            privacydatastatus,
            explanability,
            transparency,
            fairness,
            ethics,
            robustness,
            reliability,
            codename,
            algorithmversionno,
            datasetversionno,
            codevulnerabilityversionno,
            privacyversionno,
            algorithmversiondate,
            datasetversiondate,
            codevulnerabilityversiondate,
            privacyversiondate,
            bias,
            security,
            robustnessremark,
            explanabilityremark,
            transparencyremark,
            fairnessremark,
            biasremark,
            ethicsremark,
            reliabilityremark,
            securityremark,
            performance,
            accountability,
            privacy,
            privacyremark,
            performanceremark,
            accountabilityremark,
            assessmentremark,
            assessmentfile,
            assessmentdate,
            auditremark,
            auditfile,
            auditdate,
            severity,
            datasetname,
            themename,
            objecttype,
            object,
            vendorname,
            technologyname,
            environment,
            environmenttype,
            resilience,
            resilienceremark,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Inventory update successfully");
      }
      setTimeout(() => navigate("/algorithminventory"), 500);
    }
  };

  const handleFileChange = (e) => {
    setAlgorithmFile(e.target.files[0]);
  };
  const handleDataFileChange = (e) => {
    setDataSetFile(e.target.files[0]);
  };
  const handleCodeVulnerabilityFileChange = (e) => {
    setCodeVulnerabilityFile(e.target.files[0]);
  };
  const handlePrivacyFile = (e) => {
    setPrivacyDataFile(e.target.files[0]);
  };
  /*********HANDLE ALGORITHM BIAS********************* */
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isCodeVulnerabilityOpen, setIsCodeVulnerabilityOpen] = useState(false);
  const [isDataPrivacyOpen, setIsDataPrivacyOpen] = useState(false);
  // Toggle functions for each modal
  const toggleAlgorithmModal = () => {
    setIsAlgorithmModalOpen(!isAlgorithmModalOpen);
  };

  const toggleDataModal = () => {
    setIsDataModalOpen(!isDataModalOpen);
  };

  const toggleCodeVulnerabilityModal = () => {
    setIsCodeVulnerabilityOpen(!isCodeVulnerabilityOpen);
  };

  const toggledataprivacy = () => {
    setIsDataPrivacyOpen(!isDataPrivacyOpen);
  };

  // Modify handleTest to set the state variable when it's triggered
  const handleTest = async () => {
    setLoading(true);
    if (algorithmFile) {
      const formData = new FormData();
      formData.append("file", algorithmFile);

      try {
        const response = await fetch(
          "https://api.valuevalidator.com/data-extraction/api/process/ai/bias/check",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAlgorithmTestOutputUrl(data.data); // Adjust based on actual response structure
          setAlgorithmTestData(data.data); // Set the response data
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        toggleAlgorithmModal();
      }
    }
  };

  // Similarly, modify handledataset to set the state variable when it's triggered
  const handledataset = async () => {
    setLoading(true);
    if (dataSetFile) {
      const formData = new FormData();
      formData.append("file", dataSetFile);

      try {
        const response = await fetch(
          "https://api.valuevalidator.com/ai-api/analyze/",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const dataSet = await response.json();
          console.log("Data received from API:", dataSet); // Log the received data
          setDataSetTestData(dataSet); // Adjust based on actual response structure
          setDataSetTestOutputUrl(dataSet); // Set the response data
          // Set the state variable
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        toggleDataModal();
      }
    }
  };

  /**************CODE VULNERABILITY OUTPUT******************* */
  const handlecodevulnerability = async () => {
    setLoading(true);
    if (codevulnerabilityFile) {
      const formData = new FormData();
      formData.append("file", codevulnerabilityFile);

      try {
        const response = await fetch(
          "https://api.valuevalidator.com/data-extraction/api/process/ai/vulnerability/check",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const codeVulnerability = await response.json();
          console.log("Data received from API:", codeVulnerability.data); // Log the received data
          setCodeVulnerabilityTestOutputUrl(codeVulnerability.data); // Adjust based on actual response structure
          // Set the response data
          // Set the state variable
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        toggleCodeVulnerabilityModal();
      }
    }
  };
  /******************PRIVACY DATA***************************** */
  const handledataprivacy = async () => {
    setLoading(true);
    if (privacyDataFile) {
      const formData = new FormData();
      formData.append("file", privacyDataFile);

      try {
        const response = await fetch(
          "https://api.valuevalidator.com/ai-api/identify_sensitive_columns/",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          const privateData = await response.json();
          console.log("Data received from API:", privateData.data); // Log the received data
          setPrivacyDataTestOutputUrl(privateData); // Adjust based on actual response structure
          // Set the response data
          // Set the state variable
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
        toggledataprivacy();
      }
    }
  };

  /*************************************** */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  return (
    <div>
      <Header />
      <form
        onSubmit={handlSubmit}
        style={{ marginTop: "10px", marginBottom: "2cm" }}
      >
        <center>
          <h1 style={{ marginTop: "2px", marginBottom: "2px" }}>
            <label htmlFor="objecttype">Algorithm Inventory</label>
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
            <label>Organization:</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="organization"
              name="organization"
              value={organization || ""}
              onChange={handleInputChange}
            >
              <option value="">Organization </option>
              {organizationComp.map((comp) => (
                <option key={comp.companyid} value={comp.organization}>
                  {comp.organization}
                </option>
              ))}
            </select>
            <br />
          </div>
          <div>
            <label> Responsibilty Group:</label>
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
            <label>Project:</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="projectname"
              name="projectname"
              value={projectname || ""}
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
            <label>Project Code:</label>
            <input
              style={{ fontFamily: "Poppins" }}
              type="text"
              id="projectcode"
              name="projectcode"
              placeholder="Enter the Project Code"
              value={projectcode || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Date:</label>
            <br></br>
            <input
              style={{
                fontFamily: "Poppins",

                fontSize: "16px",
                marginTop: "6px",
                width: "350px",
                height: "40px",
                borderRadius: "3px",
              }}
              type="date"
              id="algorithminventorydate"
              name="algorithminventorydate"
              placeholder="Enter the Algorithm Inventory Date"
              value={algorithminventorydate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Time:</label>
            <br></br>
            <input
              style={{
                fontFamily: "Poppins",

                fontSize: "16px",
                marginTop: "6px",
                width: "350px",
                height: "40px",
                borderRadius: "3px",
              }}
              type="time"
              id="algorithminventorytime"
              name="algorithminventorytime"
              placeholder="Enter the time"
              value={algorithminventorytime || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Code Name:</label>
            <input
              style={{ fontFamily: "Poppins" }}
              type="text"
              id="codename"
              name="codename"
              placeholder="Enter the Code Name"
              value={codename || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Risk Severity:</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="severity"
              name="severity"
              value={severity || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Risk Severity</option>
              {riskSeverity.map((riskseverity) => (
                <option
                  key={riskseverity.riskseverityid}
                  value={riskseverity.riskseverityvalue}
                >
                  {riskseverity.riskseveritytype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Object Type:</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="objecttype"
              name="objecttype"
              value={objecttype || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Object Type</option>
              {objtype.map((object) => (
                <option key={object.nameid} value={object.objecttype}>
                  {object.objecttype}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Object:</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="object"
              name="object"
              value={object || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Object</option>
              {obj.map((object) => (
                <option key={object.nameid} value={object.objectcode}>
                  {object.objectcode}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Technology</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="technologyname"
              name="technologyname"
              value={technologyname || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Technology Name</option>
              {technologyName.map((technology) => (
                <option
                  key={technology.technologyid}
                  value={technology.technologyname}
                >
                  {technology.technologyname}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Stake Holder:</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="vendorname"
              name="vendorname"
              value={vendorname || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Stake Holder </option>
              {vendorName.map((vendor) => (
                <option key={vendor.vendorid} value={vendor.vendorname}>
                  {vendor.vendorname}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: "10px" }}>
            <label>Environment :</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="environment"
              name="environment"
              value={environment || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Environment </option>
              {environmentName.map((environment) => (
                <option
                  key={environment.environmentid}
                  value={environment.environmentname}
                >
                  {environment.environmentname}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <label>Environment Type :</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="environmenttype"
              name="environmenttype"
              value={environmenttype || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Environment</option>
              {environmenttypeName.map((environmenttype) => (
                <option
                  key={environmenttype.environmenttypeid}
                  value={environmenttype.environmenttypename}
                >
                  {environmenttype.environmenttypename}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginLeft: "10px" }}>
            <label>Theme :</label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="themename"
              name="themename"
              value={themename || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Theme</option>
              {theme.map((theme) => (
                <option key={theme.themeactivityid} value={theme.themename}>
                  {theme.themename}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginTop: "30px", width: "10cm" }}>
            <Link
              to={`/checklist/${algorithminventoryid}?organization=${organization}&responsibilitycenter=${responsibilitycenter}&responsibilitygroup=${responsibilitygroup}&projectname=${projectname}&projectcode=${projectcode}&codename=${codename}&objecttype=${objecttype}&object=${object}&themename=${themename}`}
            >
              <button className="btn btn-contact">Theme Activity</button>
            </Link>
            <Link
              to={`/issueTable/${algorithminventoryid}?organization=${organization}&responsibilitycenter=${responsibilitycenter}&responsibilitygroup=${responsibilitygroup}&projectname=${projectname}&projectcode=${projectcode}&codename=${codename}&objecttype=${objecttype}&object=${object}&themename=${themename}`}
            >
              <button className="btn btn-contact">Issue Management</button>
            </Link>
          </div>
        </div>
        <div className="box-container">
          <div
            class="box1"
            style={{
              marginRight: "5px",
              marginLeft: "50px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr ",
              gap: "10px",
            }}
          >
            <h3
              style={{
                gridColumn: "span 3",
                textAlign: "center",
                marginTop: "2px",
                marginBottom: "2px",
              }}
            >
              Algorithm
            </h3>
            <div>
              <label style={{ marginLeft: "20px" }}>Algorithm File:</label>
              <div
                style={{
                  maxWidth: "11cm",
                  fontFamily: "Poppins",
                  marginLeft: "10px",
                }}
              >
                <input
                  style={{
                    fontFamily: "Poppins",
                    marginRight: "10px",
                    marginLeft: "10px",
                  }}
                  type="file"
                  id="algorithm"
                  name="algorithm"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-contact"
                style={{
                  marginTop: "35px",
                  width: "150px",
                  marginLeft: "10px",
                }}
                onClick={handleTest}
              >
                Test
              </button>
            </div>

            <div>
              <label htmlFor="algorithmbias">Algorithm Bias:</label>
              <select
                style={{ maxWidth: "90%" }}
                id="algorithmbias"
                name="algorithmbias"
                value={algorithmbias}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="1">Very Low</option>
                <option value="2">Low</option>
                <option value="3">Medium</option>
                <option value="4">High</option>
                <option value="5">Very High</option>
              </select>
            </div>
            <div>
              <label htmlFor="algorithmstatus" style={{ marginLeft: "20px" }}>
                Algorithm Status:
              </label>
              <select
                style={{ maxWidth: "90%", marginLeft: "10px" }}
                id="algorithmstatus"
                name="algorithmstatus"
                value={algorithmstatus}
                onChange={handleInputChange}
              >
                <option value="">status</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Closed">Closed</option>
                <option value="Packed">Parked</option>
                <option value="Aborted">Aborted</option>
              </select>
            </div>

            <div>
              <label style={{ marginLeft: "10px" }}>
                Algorithm Version No:
              </label>
              <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="algorithmversionno"
                name="algorithmversionno"
                placeholder="Enter the algorithm version no"
                value={algorithmversionno || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ marginLeft: "10px" }}>
                Algorithm Version Date:
              </label>
              <br></br>
              <input
                style={{
                  fontFamily: "Poppins",
                  margintop: "1px",
                  fontSize: "16px",
                  margin: "6px",
                  width: "200px",
                  height: "40px",
                }}
                type="date"
                id="algorithmversiondate"
                name="algorithmversiondate"
                placeholder="Enter the Algorithm Inventory Date"
                value={algorithmversiondate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label style={{ marginLeft: "10px" }}>
                Algorithm Test Output URL:
              </label>
              {/* <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="algorithmtestoutputurl"
                name="algorithmtestoutputurl"
                placeholder="Enter the algorithm test output URL"
                value={algorithmTestOutputUrl || ""}
                onChange={handleInputChange}
              /> */}
              <div>
                <button
                  type="button"
                  className="btn btn-contact"
                  style={{
                    marginTop: "10px",
                    width: "150px",
                    marginLeft: "20px",
                  }}
                  onClick={toggleAlgorithmModal}
                >
                  Show Output
                </button>
              </div>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ marginLeft: "10px" }}>Algorithm Remark:</label>
              <textarea
                rows="3"
                cols="30"
                style={{
                  fontFamily: "Poppins",
                  marginTop: "2px",
                  marginLeft: "10px",
                  width: "95%",
                }}
                id="algorithmremark"
                name="algorithmremark"
                placeholder="Enter algorithm remark"
                value={algorithmremark}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div
            class="box2"
            style={{
              marginRight: "50px",
              marginLeft: "4px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr ",
              gap: "10px",
            }}
          >
            <h3
              style={{
                gridColumn: "span 3",
                textAlign: "center",
                marginTop: "2px",
                marginBottom: "2px",
              }}
            >
              DataSet
            </h3>
            <div>
              <label style={{ marginLeft: "20px" }}>Data Set File: </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <br />
                <input
                  style={{
                    fontFamily: "Poppins",
                    marginRight: "10px",
                    marginLeft: "10px",
                  }}
                  type="file"
                  id="dataset"
                  name="dataset"
                  onChange={handleDataFileChange}
                />
                <div style={{ position: "relative" }}></div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-contact"
                style={{
                  marginTop: "35px",
                  width: "150px",
                  marginLeft: "10px",
                }}
                onClick={handledataset}
              >
                Test
              </button>
            </div>
            <div>
              <label htmlFor="databias">Data Bias:</label>
              <select
                style={{ maxWidth: "90%" }}
                id="databias"
                name="databias"
                value={databias}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="1">Very Low</option>
                <option value="2">Low</option>
                <option value="3">Medium</option>
                <option value="4">High</option>
                <option value="5">Very High</option>
              </select>
            </div>

            <div>
              <label htmlFor="datasetstatus" style={{ marginLeft: "20px" }}>
                Data Set Status:
              </label>
              <select
                style={{ maxWidth: "90%", marginLeft: "10px" }}
                id="datasetstatus"
                name="datasetstatus"
                value={datasetstatus}
                onChange={handleInputChange}
              >
                <option value="">status</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Closed">Closed</option>
                <option value="Packed">Parked</option>
                <option value="Aborted">Aborted</option>
              </select>
            </div>

            <div>
              <label style={{ marginLeft: "10px" }}>DataSet Version No:</label>
              <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="datasetversionno"
                name="datasetversionno"
                placeholder="Enter the Data Set version no"
                value={datasetversionno || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label style={{ marginLeft: "10px" }}>
                DataSet Version Date:
              </label>
              <br></br>
              <input
                style={{
                  fontFamily: "Poppins",
                  margintop: "1px",
                  fontSize: "16px",
                  margin: "6px",
                  width: "200px",
                  height: "40px",
                }}
                type="date"
                id="datasetversiondate"
                name="datasetversiondate"
                placeholder="Enter the data set version date"
                value={datasetversiondate || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ marginLeft: "10px" }}>
                DataSet Test Output URL:
              </label>
              {/* <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="datasettestoutputurl"
                name="datasettestoutputurl"
                placeholder="Enter the dataset test output url"
                value={datasettestoutputurl || ""}
                onChange={handleInputChange}
              /> */}
              <button
                type="button"
                className="btn btn-contact"
                style={{
                  marginTop: "10px",
                  width: "150px",
                  marginLeft: "20px",
                }}
                onClick={toggleDataModal}
              >
                Show Output
              </button>
            </div>
            <div>
              <label htmlFor="datasetname" style={{ marginLeft: "20px" }}>
                Data Set Type:
              </label>
              <select
                style={{ maxWidth: "80%", marginLeft: "10px" }}
                id="datasetname"
                name="datasetname"
                value={datasetname || ""}
                onChange={handleInputChange}
              >
                <option value="">Data Set Type</option>
                {datasets.map((dataset) => (
                  <option key={dataset.datasetid} value={dataset.datasetname}>
                    {dataset.datasetname}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dataremark" style={{ marginLeft: "20px" }}>
                Data Remark:
              </label>
              <textarea
                rows="2"
                cols="20"
                style={{
                  fontFamily: "Poppins",
                  marginTop: "6px",
                }}
                id="dataremark"
                name="dataremark"
                placeholder="Enter data remark"
                value={dataremark}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>
        <div className="box-container">
          <div
            class="box3"
            style={{
              marginRight: "5px",
              marginLeft: "50px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr ",
              gap: "10px",
            }}
          >
            <h3
              style={{
                gridColumn: "span 3",
                textAlign: "center",
                marginTop: "2px",
                marginBottom: "2px",
              }}
            >
              Code Vulnerability
            </h3>
            <div>
              <label style={{ marginLeft: "20px" }}>
                Code Vulnerability File:{" "}
              </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <br />
                <input
                  style={{
                    fontFamily: "Poppins",
                    marginRight: "10px",
                    marginLeft: "10px",
                  }}
                  type="file"
                  id="codevulnerability"
                  name="codevulnerability"
                  onChange={handleCodeVulnerabilityFileChange}
                />
                <div style={{ position: "relative" }}></div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-contact"
                style={{
                  marginTop: "35px",
                  width: "150px",
                  marginLeft: "10px",
                }}
                onClick={handlecodevulnerability}
              >
                Test
              </button>
            </div>
            <div>
              <label htmlFor="codevulnerabilitybias">
                Code Vulnerability Bias:
              </label>
              <select
                style={{ maxWidth: "90%" }}
                id="codevulnerabilitybias"
                name="codevulnerabilitybias"
                value={codevulnerabilitybias}
                onChange={handleInputChange}
              >
                <option value="">Select</option>{" "}
                <option value="1">Very Low</option>{" "}
                <option value="2">Low</option>
                <option value="3">Medium</option>{" "}
                <option value="4">High</option>{" "}
                <option value="5">Very High</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="codevulnerabilitystatus"
                style={{ marginLeft: "20px" }}
              >
                Code Vulnerability Status:
              </label>
              <select
                style={{ maxWidth: "90%", marginLeft: "10px" }}
                id="codevulnerabilitystatus"
                name="codevulnerabilitystatus"
                value={codevulnerabilitystatus}
                onChange={handleInputChange}
              >
                <option value="">status</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Closed">Closed</option>
                <option value="Packed">Parked</option>
                <option value="Aborted">Aborted</option>
              </select>
            </div>
            <div>
              <label style={{ marginLeft: "10px" }}>
                Code Vulnerability Version No:
              </label>
              <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="codevulnerabilityversionno"
                name="codevulnerabilityversionno"
                placeholder="Enter the code vulnerability version no"
                value={codevulnerabilityversionno || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label style={{ marginLeft: "10px" }}>
                Code Vulnerability Version Date:
              </label>
              <br></br>
              <input
                style={{
                  fontFamily: "Poppins",
                  margintop: "1px",
                  fontSize: "16px",
                  margin: "6px",
                  width: "200px",
                  height: "40px",
                }}
                type="date"
                id="codevulnerabilityversiondate"
                name="codevulnerabilityversiondate"
                placeholder="Enter the Code Vulnerability Version Date"
                value={codevulnerabilityversiondate}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ marginLeft: "10px" }}>
                Code Vulnerability Test Output URL:
              </label>
              {/* <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="codevulnerabilitytestoutputurl"
                name="codevulnerabilitytestoutputurl"
                placeholder="Enter the code vulnerability test output url"
                value={codevulnerabilitytestoutputurl || ""}
                onChange={handleInputChange}
              /> */}
              <button
                type="button"
                className="btn btn-contact"
                style={{
                  marginTop: "10px",
                  width: "150px",
                  marginLeft: "20px",
                }}
                onClick={toggleCodeVulnerabilityModal}
              >
                Show Output
              </button>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ marginLeft: "10px" }}>
                Code Vulnerability Remark:
              </label>
              <textarea
                rows="3"
                cols="30"
                style={{
                  fontFamily: "Poppins",
                  marginTop: "4px",
                  marginLeft: "10px",
                  width: "95%",
                }}
                id="codevulnerabilityremark"
                name="codevulnerabilityremark"
                placeholder="Enter data code vulnerability remark"
                value={codevulnerabilityremark}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
          </div>
          <div
            class="box4"
            style={{
              marginRight: "50px",
              marginLeft: "5px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            <h3
              style={{
                gridColumn: "span 3",
                textAlign: "center",
                marginTop: "2px",
                marginBottom: "2px",
              }}
            >
              Privacy Data
            </h3>
            <div>
              <label style={{ marginLeft: "20px" }}>Privacy Data File: </label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <br />
                <input
                  style={{
                    fontFamily: "Poppins",
                    marginRight: "10px",
                    marginLeft: "10px",
                    width: "150px",
                  }}
                  type="file"
                  id="privacydata"
                  name="privacydata"
                  onChange={handlePrivacyFile}
                />
                <div style={{ position: "relative" }}></div>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-contact"
                style={{
                  marginTop: "35px",
                  width: "150px",
                  marginLeft: "10px",
                }}
                onClick={handledataprivacy}
              >
                Test
              </button>
            </div>
            <div>
              <label htmlFor="privacydatabias">Privacy Data Bias:</label>
              <select
                style={{ maxWidth: "90%" }}
                id="privacydatabias"
                name="privacydatabias"
                value={privacydatabias}
                onChange={handleInputChange}
              >
                <option value="">Select</option>
                <option value="1">Very Low</option>
                <option value="2">Low</option>
                <option value="3">Medium</option>
                <option value="4">High</option>
                <option value="5">Very High</option>
              </select>
            </div>
            <div>
              <label htmlFor="privacydatastatus" style={{ marginLeft: "20px" }}>
                Privacy Data Status:
              </label>
              <select
                style={{ maxWidth: "90%", marginLeft: "10px" }}
                id="privacydatastatus"
                name="privacydatastatus"
                value={privacydatastatus}
                onChange={handleInputChange}
              >
                <option value="">status</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Closed">Closed</option>
                <option value="Packed">Parked</option>
                <option value="Aborted">Aborted</option>
              </select>
            </div>
            <div>
              <label style={{ marginLeft: "10px" }}>Privacy Version No:</label>
              <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="privacyversionno"
                name="privacyversionno"
                placeholder="Enter the Privacy version no"
                value={privacyversionno || ""}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label style={{ marginLeft: "10px" }}>
                Privacy Version Date:
              </label>
              <br></br>
              <input
                style={{
                  fontFamily: "Poppins",
                  margintop: "1px",
                  fontSize: "16px",
                  margin: "6px",
                  width: "200px",
                  height: "40px",
                }}
                type="date"
                id="privacyversiondate"
                name="privacyversiondate"
                placeholder="Enter the privacy version date"
                value={privacyversiondate}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label style={{ marginLeft: "10px" }}>
                Privacy Test Output URL:
              </label>
              {/* <input
                style={{ fontFamily: "Poppins", marginLeft: "10px" }}
                type="text"
                id="privacytestoutputurl"
                name="privacytestoutputurl"
                placeholder="Enter the privacytestoutputurl"
                value={privacytestoutputurl || ""}
                onChange={handleInputChange}
              /> */}
              <button
                type="button"
                className="btn btn-contact"
                style={{
                  marginTop: "10px",
                  width: "150px",
                  marginLeft: "20px",
                }}
                onClick={toggledataprivacy}
              >
                Show Output
              </button>
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ marginLeft: "10px" }}>Privacy Data Remark:</label>
              <textarea
                rows="3"
                cols="30"
                style={{
                  fontFamily: "Poppins",
                  marginTop: "9px",
                  marginLeft: "10px",
                  width: "95%",
                }}
                id="privacydataremark"
                name="privacydataremark"
                placeholder="Enter the privacydata remark"
                value={privacydataremark}
                onChange={handleInputChange}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>
        <h4
          style={{ marginLeft: "50px", marginTop: "3px", marginBottom: "2px" }}
        >
          Trusted AI
        </h4>
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
            <label htmlFor="privacydatabias">Reliability:</label>
            <select
              id="reliability"
              name="reliability"
              value={reliability}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>

          <div>
            <label htmlFor="privacy">Privacy:</label>
            <select
              id="privacy"
              name="privacy"
              value={privacy}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>

          <div>
            <label htmlFor="bias"> Bias:</label>
            <select
              id="bias"
              name="bias"
              value={bias}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="security">Security:</label>
            <select
              id="security"
              name="security"
              value={security}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="performance">Performance:</label>
            <select
              id="performance"
              name="performance"
              value={performance}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>

          <div>
            <label htmlFor="privacydatabias">Robustness:</label>
            <select
              id="robustness"
              name="robustness"
              value={robustness}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label style={{ marginLeft: "10px" }}>Reliability Remark:</label>
            <br></br>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="reliabilityremark"
              name="reliabilityremark"
              placeholder="Enter reliabilityremark"
              value={reliabilityremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label style={{ marginLeft: "10px" }}>Privacy Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="privacyremark"
              name="privacyremark"
              placeholder="Enter privacy remark"
              value={privacyremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label style={{ marginLeft: "10px" }}>Bias Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="biasremark"
              name="biasremark"
              placeholder="Enter bias remark"
              value={biasremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label style={{ marginLeft: "10px" }}>Security Remark:</label>

            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="securityremark"
              name="securityremark"
              placeholder="Enter security remark"
              value={securityremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label style={{ marginLeft: "10px" }}>Performance Remark:</label>

            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="performanceremark"
              name="performanceremark"
              placeholder="Enter performance remark"
              value={performanceremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label style={{ marginLeft: "10px" }}>Robustness Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="robustnessremark"
              name="robustnessremark"
              placeholder="Enter robustness remark"
              value={robustnessremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>
        </div>
        <h4
          style={{ marginLeft: "50px", marginTop: "3px", marginBottom: "2px" }}
        >
          Responsible AI
        </h4>
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
            <label htmlFor="privacydatabias">Transparency:</label>
            <select
              id="transparency"
              name="transparency"
              value={transparency}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="fairness">Fairness:</label>
            <select
              id="fairness"
              name="fairness"
              value={fairness}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="accountability">Accountability:</label>
            <select
              id="accountability"
              name="accountability"
              value={accountability}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="privacydatabias">Ethics:</label>
            <select
              id="ethics"
              name="ethics"
              value={ethics}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="Explanability">Explanability:</label>
            <select
              id="explanability"
              name="explanability"
              value={explanability}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>
          <div>
            <label htmlFor="Resilience">Resilience:</label>
            <select
              id="resilience"
              name="resilience"
              value={resilience}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="1">Very Low</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">Very High</option>
            </select>
          </div>

          {/* <div>
          <Link
          to={{pathname:"/assessmentaudit",state:{algorithminventory:state},}}><button  style={{marginTop:"10%" , height:" 50px" ,color:"white" ,border:"none", backgroundColor:"#3386ff"}}
             >
              Go to Assessment Audit
            </button></Link> 
          </div> */}

          {/* <div>
        <label htmlFor="security">Mean</label>
        <input
            style={{ fontFamily: "Poppins" }}
            type="text"
            id="projectcode"
            name="projectcode"
            placeholder="Enter the Project Code"
            value={projectcode || ""}
            onChange={handleInputChange}
          />
        </div> */}
        </div>
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
            <label>Transparency Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="transparencyremark"
              name="transparencyremark"
              placeholder="Enter transparency remark"
              value={transparencyremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label style={{ marginLeft: "10px" }}>Fairness Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="fairnessremark"
              name="fairnessremark"
              placeholder="Enter fairness remark"
              value={fairnessremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label style={{ marginLeft: "10px" }}>Accountability Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="accountabilityremark"
              name="accountabilityremark"
              placeholder="Enter accountability remark"
              value={accountabilityremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label style={{ marginLeft: "10px" }}>Ethics Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="ethicsremark"
              name="ethicsremark"
              placeholder="Enter ethic sremark "
              value={ethicsremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>

          <div>
            <label style={{ marginLeft: "10px" }}>Explanability Remark:</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="explanabilityremark"
              name="explanabilityremark"
              placeholder="Enter Explanability Remark"
              value={explanabilityremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>
          <div>
            <label style={{ marginLeft: "10px" }}>Resilience Remark :</label>
            <textarea
              rows="3"
              cols="30"
              style={{ fontFamily: "Poppins" }}
              id="resilienceremark"
              name="resilienceremark"
              value={resilienceremark}
              onChange={handleInputChange}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <center>
          <h1>Assessment Audit</h1>
        </center>
        <div
          style={{
            marginRight: "50px",
            marginLeft: "50px",
            marginBottom: "5px",
            marginTop: "2px",
          }}
        >
          <label>Show Additional Fields</label>
          <button type="button" onClick={handleAdditionalFieldsClick}>
            {showAdditionalFields ? "-" : "+"}
          </button>
        </div>
        {showAdditionalFields && (
          <center>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Remark</th>
                  <th>Date</th>
                  <th>File Upload</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <h3>Assessment</h3>
                  </td>
                  <td>
                    <div>
                      <textarea
                        rows="3"
                        cols="30"
                        style={{ fontFamily: "Poppins" }}
                        id="assessmentremark"
                        name="assessmentremark"
                        placeholder="Enter Assessment Remark"
                        value={assessmentremark}
                        onChange={(e) => handleInputChange(e)}
                        disabled={isReadOnly}
                      />
                    </div>
                  </td>
                  <td>
                    <div>
                      <input
                        style={{ width: "150px", height: "30px" }}
                        type="date"
                        id="assessmentdate"
                        name="assessmentdate"
                        placeholder="Enter the assessmentDate"
                        value={assessmentdate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <br />
                      <input
                        style={{
                          fontFamily: "Poppins",
                          marginRight: "10px",
                          marginLeft: "10px",
                        }}
                        type="text"
                        id="assessmentfile"
                        name="assessmentfile"
                        value={assessmentfile}
                        onChange={(e) => handleInputChange(e)}
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
                  </td>
                </tr>
                <tr>
                  <td>
                    <h3>Audit</h3>
                  </td>
                  <td>
                    <div>
                      <textarea
                        rows="3"
                        cols="30"
                        style={{ fontFamily: "Poppins" }}
                        id="auditremark"
                        name="auditremark"
                        placeholder="Enter Audit Remark"
                        value={auditremark}
                        onChange={(e) => handleInputChange(e)}
                        disabled={isReadOnly}
                      />
                    </div>
                  </td>
                  <td>
                    <div>
                      <input
                        style={{ width: "150px", height: "30px" }}
                        type="date"
                        id="auditdate"
                        name="auditdate"
                        placeholder="Enter the auditDate"
                        value={auditdate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <br />
                      <input
                        style={{
                          fontFamily: "Poppins",
                          marginRight: "10px",
                          marginLeft: "10px",
                        }}
                        type="text"
                        id="auditfile"
                        name="auditfile"
                        value={auditfile}
                        onChange={(e) => handleInputChange(e)}
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
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        )}

        <center>
          <div style={{ width: "30%", marginTop: "20px" }}>
            <input
              type="submit"
              value={algorithminventoryid ? "update" : "Save"}
            />
            <Link to="/algorithminventory"> </Link>
          </div>
        </center>
      </form>
      <DataSetOutputTable
        isOpen={isDataModalOpen}
        onClose={toggleDataModal}
        data={dataSetTestData}
      />
      <AlgorithmOutputTable
        isOpen={isAlgorithmModalOpen}
        onClose={toggleAlgorithmModal}
        data={algorithmTestData}
      />
      <CodeVulnerabilittyOutput
        isOpen={isCodeVulnerabilityOpen}
        onClose={toggleCodeVulnerabilityModal}
        data={codevulnerabilityTestOutputUrl}
      />
      <PrivacyDataOutput
        isOpen={isDataPrivacyOpen}
        onClose={toggledataprivacy}
        data={privacyDataTestOutputUrl}
      />
      <Footer />
    </div>
  );
};
export default AlgorithmInventoryAddEdit;
