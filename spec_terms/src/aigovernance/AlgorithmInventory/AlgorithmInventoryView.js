import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AlgorithmInventory.css";
import Footer from "../pages/footer";
import Header from "../pages/header";
import * as API from "../endpoint";
import AlgorithmOutputTable from "./AlgorithmInventoryTestResults/AlgorithmOutputTable";
import DataSetOutputTable from "./AlgorithmInventoryTestResults/DataSetOutputTable";
import CodeVulnerabilityOutput from "./AlgorithmInventoryTestResults/CodeVulnerabilittyOutput";
import PrivacyDataOutput from "./AlgorithmInventoryTestResults/PrivacyDataOutput";
const AlgorithmInventoryView = () => {
  const [user, setUser] = useState([]);
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState(false);
  const [algorithmTestData, setAlgorithmTestData] = useState([]);
  const [dataSetTestData, setDataSetTestData] = useState([]);
  const [isDataSetModalOpen, setIsDataSetModalOpen] = useState(false);
  const { projectcode } = useParams();

  useEffect(() => {
    axios
      .get(API.GET_SPECIFIC_ALGORITHM_INVENTORY(projectcode))
      .then((resp) => setUser(resp.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [projectcode]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString("en-IN", options);
  };

  const calculateAverage = useMemo(() => {
    return (item) => {
      const columnsToAverageTrust = [
        "reliability",
        "privacy",
        "bias",
        "security",
        "performance",
        "robustness",
      ];

      const columnsToAverageResponsible = [
        "transparency",
        "fairness",
        "accountability",
        "ethics",
        "explanability",
        "resilience",
      ];

      const validValuesTrust = columnsToAverageTrust.map((column) => {
        const value = parseFloat(item[column]) || 0;
        return value;
      });

      const validValuesResponsible = columnsToAverageResponsible.map(
        (column) => {
          const value = parseFloat(item[column]) || 0;
          return value;
        }
      );

      const nonZeroValuesTrust = validValuesTrust.filter(
        (value) => value !== 0
      );
      const nonZeroValuesResponsible = validValuesResponsible.filter(
        (value) => value !== 0
      );

      const totalTrust = nonZeroValuesTrust.reduce(
        (sum, value) => sum + value,
        0
      );
      const totalResponsible = nonZeroValuesResponsible.reduce(
        (sum, value) => sum + value,
        0
      );

      const averageTrust =
        nonZeroValuesTrust.length > 0
          ? totalTrust / nonZeroValuesTrust.length
          : 0;
      const averageResponsible =
        nonZeroValuesResponsible.length > 0
          ? totalResponsible / nonZeroValuesResponsible.length
          : 0;

      return {
        trust: isNaN(averageTrust) ? "N/A" : averageTrust.toFixed(2),
        responsible: isNaN(averageResponsible)
          ? "N/A"
          : averageResponsible.toFixed(2),
      };
    };
  });
  /*****************Algorithm Modal******************************** */
  const toggleAlgorithmModal = (outputdata) => {
    setAlgorithmTestData(outputdata);
    setIsAlgorithmModalOpen(!isAlgorithmModalOpen);
  };
  /******************Data Set Modal*************************************** */
  const toggleDataModal = (outputdataset) => {
    setDataSetTestData(outputdataset);

    setIsDataSetModalOpen(!isDataSetModalOpen);
  };
  /*********************Code Vulnerability*********************************************** */
  const [codeVulnerabilityOutput, setCodeVulnerabilityOutput] = useState([]);
  const [isCodeVulnerabilityOpen, setIsCodeVulnerabilityOpen] = useState(false);
  const toggelCodeVulnerability = (codeVulnerabilityOutput) => {
    setCodeVulnerabilityOutput(codeVulnerabilityOutput);
    setIsCodeVulnerabilityOpen(!isCodeVulnerabilityOpen);
  };

  /*************************DATA PRIVACY******************************** */

  const [dataPrivacyOutput, setDataPrivacyOutput] = useState([]);
  const [isDataPrivacyOpen, setIsDataPrivacyOpen] = useState(false);
  const toggleDataPrivacy = (dataPrivacyOutput) => {
    setDataPrivacyOutput(dataPrivacyOutput);
    setIsDataPrivacyOpen(!isDataPrivacyOpen);
  };

  return (
    <div>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <div style={{ marginTop: "10px" }}>
          <table
            className="styled-table"
            style={{ marginLeft: "15px", maxWidth: "60%" }}
          >
            <thead>
              <center>
                <h1>ALGORITHM INVENTORY</h1>
              </center>
              <h4>ORGANIZATION UNIT</h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Organization</th>
                <th style={{ textAlign: "center" }}>Project</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Responsibility Group</th>
                <th style={{ textAlign: "center" }}>Responsibility Center</th>
                <th style={{ textAlign: "center" }}>Vendor</th>
                <th style={{ textAlign: "center" }}>Technology</th>
                <th style={{ textAlign: "center" }}>Date</th>
                <th style={{ textAlign: "center" }}>Time</th>
                <th style={{ textAlign: "center" }}>Code Name</th>
              </tr>
            </thead>
            <tbody>
              {user.length > 0 && (
                <tr key={user[0].id}>
                  <th scope="row">1</th>
                  <td>{user[0].organization}</td>
                  <td>{user[0].projectname}</td>
                  <td>{user[0].projectcode}</td>
                  <td>{user[0].responsibilitygroup}</td>
                  <td>{user[0].responsibilitycenter}</td>
                  <td>{user[0].vendorname}</td>
                  <td>{user[0].technologyname}</td>
                  <td>{formatDate(user[0].algorithminventorydate)}</td>
                  <td>{formatTime(user[0].algorithminventorytime)}</td>

                  <td>{user[0].codename}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <br></br>

        {/**********************************Algorithm***************************************/}
        <div>
          <table className="styled-table" style={{ marginLeft: "15px" }}>
            <thead>
              <h4>Algorithm</h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Algorithm</th>
                <th style={{ textAlign: "center" }}>Algorithm Bias</th>
                <th style={{ textAlign: "center" }}>Algorithm Status</th>
                <th style={{ textAlign: "center" }}>Algorithm Version No</th>
                <th style={{ textAlign: "center" }}>Algorithm Version Date</th>
                <th style={{ textAlign: "center" }}>
                  Algorithm Test Output URL
                </th>
                <th style={{ textAlign: "center" }}>Algorithm Remark</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) &&
                user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.projectcode}</td>
                    <td>
                      <a
                        href={item.algorithm}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.algorithm, "_blank");
                        }}
                      >
                        {item.algorithm}
                      </a>
                    </td>
                    <td>{item.algorithmbias}</td>
                    <td>{item.algorithmstatus}</td>
                    <td>{item.algorithmversionno}</td>
                    <td>{formatDate(item.algorithmversiondate)}</td>

                    <td>
                      <button
                        className="btn btn-edit"
                        style={{ maxWidth: "5cm" }}
                        onClick={() =>
                          toggleAlgorithmModal(item.algorithmtestoutputurl)
                        }
                      >
                        Show Data
                      </button>
                    </td>
                    <td>{item.algorithmremark}</td>
                  </tr>
                ))}{" "}
            </tbody>
          </table>
        </div>
        <br></br>
        {/************************************Trusted*************************************/}
        <div>
          <table className="styled-table" style={{ marginLeft: "15px" }}>
            <thead>
              <h4>Trusted AI </h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Reliability</th>
                <th style={{ textAlign: "center" }}>Reliability Remark</th>
                <th style={{ textAlign: "center" }}>Privacy</th>
                <th style={{ textAlign: "center" }}>Privacy Remark</th>
                <th style={{ textAlign: "center" }}>Bias</th>
                <th style={{ textAlign: "center" }}>Bias Remark</th>
                <th style={{ textAlign: "center" }}>Security</th>
                <th style={{ textAlign: "center" }}>Security Remark</th>
                <th style={{ textAlign: "center" }}>Performance</th>
                <th style={{ textAlign: "center" }}>Performance Remark</th>
                <th style={{ textAlign: "center" }}>Robustness</th>
                <th style={{ textAlign: "center" }}>Robustness Remark</th>
                <th style={{ textAlign: "center" }}>Safety</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) &&
                user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.projectcode}</td>
                    <td>{item.reliability}</td>
                    <td>{item.reliabilityremark}</td>
                    <td>{item.privacy}</td>
                    <td>{item.privacyremark}</td>
                    <td>{item.bias}</td>
                    <td>{item.biasremark}</td>
                    <td>{item.security}</td>
                    <td>{item.securityremark}</td>
                    <td>{item.performance}</td>
                    <td>{item.performanceremark}</td>
                    <td>{item.robustness}</td>
                    <td>{item.robustnessremark}</td>
                    <td>{calculateAverage(item).trust}</td>
                  </tr>
                ))}{" "}
            </tbody>
          </table>
        </div>
        <br></br>
        {/************************************ Responsible AI*************************************/}
        <div>
          <table className="styled-table" style={{ marginLeft: "15px" }}>
            <thead>
              <h4>Responsible AI</h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Transparency</th>
                <th style={{ textAlign: "center" }}>Transparency Remark</th>
                <th style={{ textAlign: "center" }}>Fairness</th>
                <th style={{ textAlign: "center" }}>Fairness Remark</th>
                <th style={{ textAlign: "center" }}>Accountability</th>
                <th style={{ textAlign: "center" }}>Accountability Remark</th>
                <th style={{ textAlign: "center" }}>Ethics</th>
                <th style={{ textAlign: "center" }}>Ethics Remark</th>
                <th style={{ textAlign: "center" }}>Explanability</th>
                <th style={{ textAlign: "center" }}>Explanability Remark</th>
                <th style={{ textAlign: "center" }}>Resilience</th>
                <th style={{ textAlign: "center" }}>Resilience Remark</th>
                <th style={{ textAlign: "center" }}>Safety</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) &&
                user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.projectcode}</td>
                    <td>{item.transparency}</td>
                    <td>{item.transparencyremark}</td>
                    <td>{item.fairness}</td>
                    <td>{item.fairnessremark}</td>
                    <td>{item.accountability}</td>
                    <td>{item.accountabilityremark}</td>
                    <td>{item.ethics}</td>
                    <td>{item.ethicsremark}</td>
                    <td>{item.explanability}</td>
                    <td>{item.explanabilityremark}</td>
                    <td>{item.resilience}</td>
                    <td>{item.resilienceremark}</td>
                    <td>{calculateAverage(item).responsible}</td>
                  </tr>
                ))}{" "}
            </tbody>
          </table>
        </div>
        <br></br>

        {/************************************Data Set*************************************/}

        <div>
          <table
            className="styled-table"
            style={{ marginLeft: "15px", maxWidth: "50%" }}
          >
            <thead>
              <h4>Data Set</h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Data Set</th>
                <th style={{ textAlign: "center" }}>Data Set Bias</th>
                <th style={{ textAlign: "center" }}>Data Set Status</th>
                <th style={{ textAlign: "center" }}>Data Set Version Date</th>
                <th style={{ textAlign: "center" }}>Data Set Version No</th>
                <th style={{ textAlign: "center" }}>
                  Data Set Test Output URL
                </th>
                <th style={{ textAlign: "center" }}>Data Set Type</th>
                <th style={{ textAlign: "center" }}>Data Set Remark</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) &&
                user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.projectcode}</td>
                    <td>
                      <a
                        href={item.dataset}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.dataset, "_blank");
                        }}
                      >
                        {item.dataset}
                      </a>
                    </td>
                    <td>{item.databias}</td>
                    <td>{item.datasetstatus}</td>
                    <td>{formatDate(item.datasetversiondate)}</td>
                    <td>{item.datasetversionno}</td>
                    <td>
                      <button
                        className="btn btn-contact"
                        onClick={() =>
                          toggleDataModal(item.datasettestoutputurl)
                        }
                      >
                        Show Data
                      </button>
                    </td>
                    <td>{item.datasetname}</td>
                    <td>{item.dataremark}</td>
                  </tr>
                ))}{" "}
            </tbody>
          </table>
        </div>
        <br></br>
        {/************************************Code Vulnerability*************************************/}

        <div>
          <table className="styled-table " style={{ marginLeft: "15px" }}>
            <thead>
              <h4>Code Vulnerability</h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Code Vulnerability</th>
                <th style={{ textAlign: "center" }}>Code Vulnerability Bias</th>
                <th style={{ textAlign: "center" }}>
                  Code Vulnerability Status
                </th>
                <th style={{ textAlign: "center" }}>
                  Code Vulnerability Version No
                </th>
                <th style={{ textAlign: "center" }}>
                  Code Vulnerability Version Date
                </th>

                <th style={{ textAlign: "center" }}>
                  Code Vulnerability Test Output URL
                </th>
                <th style={{ textAlign: "center" }}>
                  Code Vulnerability Remark
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) &&
                user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.projectcode}</td>
                    <td>
                      <a
                        href={item.codevulnerability}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.codevulnerability, "_blank");
                        }}
                      >
                        {item.codevulnerability}
                      </a>
                    </td>
                    <td>{item.codevulnerabilitybias}</td>
                    <td>{item.codevulnerabilitystatus}</td>
                    <td>{item.codevulnerabilityversionno}</td>
                    <td>{formatDate(item.codevulnerabilityversiondate)}</td>

                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() =>
                          toggelCodeVulnerability(
                            item.codevulnerabilitytestoutputurl
                          )
                        }
                      >
                        Show Data
                      </button>
                    </td>
                    <td>{item.codevulnerabilityremark}</td>
                  </tr>
                ))}{" "}
            </tbody>
          </table>
        </div>
        <br></br>
        {/************************************Privacy Data*************************************/}

        <div>
          <table
            className="styled-table"
            style={{ marginLeft: "15px", marginBottom: "15px" }}
          >
            <thead>
              <h4>Privacy Data</h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Privacy Data</th>
                <th style={{ textAlign: "center" }}>privacydatabias</th>
                <th style={{ textAlign: "center" }}>Privacy Data Status</th>
                <th style={{ textAlign: "center" }}>Privacy Version No</th>
                <th style={{ textAlign: "center" }}>Privacy Version Date</th>
                <th style={{ textAlign: "center" }}>
                  Privacy Data Test Output URL
                </th>
                <th style={{ textAlign: "center" }}>privacydataremark</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) &&
                user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.projectcode}</td>
                    <td>
                      <a
                        href={item.privacydata}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.privacydata, "_blank");
                        }}
                      >
                        {item.privacydata}
                      </a>
                    </td>
                    <td>{item.privacydatabias}</td>
                    <td>{item.privacydatastatus}</td>
                    <td>{item.privacyversionno}</td>
                    <td>{formatDate(item.privacyversiondate)}</td>

                    <td>
                      <button
                        className="btn btn-edit"
                        onClick={() =>
                          toggleDataPrivacy(item.privacytestoutputurl)
                        }
                      >
                        Show Data
                      </button>
                    </td>
                    <td>{item.privacydataremark}</td>
                  </tr>
                ))}{" "}
            </tbody>
          </table>
        </div>
        {/************************************Privacy Data*************************************/}

        <div>
          <table
            className="styled-table"
            style={{ marginLeft: "15px", marginBottom: "3cm" }}
          >
            <thead>
              <h4>Assessment & Audit</h4>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Assessment Remark</th>
                <th style={{ textAlign: "center" }}>Assessment Date</th>
                <th style={{ textAlign: "center" }}>Audit Remark</th>
                <th style={{ textAlign: "center" }}>Audit File</th>
                <th style={{ textAlign: "center" }}>Audit Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(user) &&
                user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.projectcode}</td>

                    <td>{item.assessmentremark}</td>
                    <td>{formatDate(item.assessmentdate)}</td>
                    <td>{item.auditremark}</td>
                    <td>
                      <a
                        href={item.auditfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(item.auditfile, "_blank");
                        }}
                      >
                        {item.auditfile}
                      </a>
                    </td>
                    <td>{formatDate(item.auditdate)}</td>
                  </tr>
                ))}{" "}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
      <AlgorithmOutputTable
        isOpen={isAlgorithmModalOpen}
        onClose={toggleAlgorithmModal}
        data={algorithmTestData}
      />
      <DataSetOutputTable
        isOpen={isDataSetModalOpen}
        onClose={toggleDataModal}
        data={dataSetTestData}
      />
      <CodeVulnerabilityOutput
        isOpen={isCodeVulnerabilityOpen}
        onClose={toggelCodeVulnerability}
        data={codeVulnerabilityOutput}
      />
      <PrivacyDataOutput
        isOpen={isDataPrivacyOpen}
        onClose={toggleDataPrivacy}
        data={dataPrivacyOutput}
      />
    </div>
  );
};
export default AlgorithmInventoryView;
