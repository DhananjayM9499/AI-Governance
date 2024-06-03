import React, { useEffect, useState } from "react";
import axios from "axios";
import * as API from "../endpoint";
import "./Kanbanboard.css";
import Footer from "../pages/footer";
import Header from "../pages/header";

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [uniqueValues, setUniqueValues] = useState({
    organization: [],
    responsibilitygroup: [],
    responsibilitycenter: [],
    algorithminventorydate: [],
    project: [],
    projectcode: [],
    algorithminventorytime: [],
    codename: [],
    objecttype: [],
    object: [],
    severity: [],
    technologyname: [],
    environment: [],
    environmenttype: [],
    themename: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API.GET_ALGORITHM_INVENTORY);
      console.log("API Response:", response.data); // Log the response data
      setTasks(response.data);
      const uniqueValuesData = {
        organization: getUniqueValues(response.data, "organization"),
        responsibilitygroup: getUniqueValues(
          response.data,
          "responsibilitygroup"
        ),
        responsibilitycenter: getUniqueValues(
          response.data,
          "responsibilitycenter"
        ),
        algorithminventorydate: getUniqueValues(
          response.data,
          "algorithminventorydate"
        ),
        project: getUniqueValues(response.data, "project"),
        projectcode: getUniqueValues(response.data, "projectcode"),
        algorithminventorytime: getUniqueValues(
          response.data,
          "algorithminventorytime"
        ),
        codename: getUniqueValues(response.data, "codename"),
        objecttype: getUniqueValues(response.data, "objecttype"),
        object: getUniqueValues(response.data, "object"),
        severity: getUniqueValues(response.data, "severity"),
        technologyname: getUniqueValues(response.data, "technologyname"),
        environment: getUniqueValues(response.data, "environment"),
        environmenttype: getUniqueValues(response.data, "environmenttype"),
        themename: getUniqueValues(response.data, "themename"),
      };
      console.log("Unique Values Data:", uniqueValuesData); // Log the unique values data
      setUniqueValues(uniqueValuesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const taskColumns = {
    Open: [],
    "In-Progress": [],
    Closed: [],
    Parked: [],
    Aborted: [],
  };

  tasks.forEach((task) => {
    if (task.algorithmstatus && taskColumns[task.algorithmstatus]) {
      taskColumns[task.algorithmstatus].push(task);
    }
    if (task.datasetstatus && taskColumns[task.datasetstatus]) {
      taskColumns[task.datasetstatus].push(task);
    }
    if (
      task.codevulnerabilitystatus &&
      taskColumns[task.codevulnerabilitystatus]
    ) {
      taskColumns[task.codevulnerabilitystatus].push(task);
    }
    if (task.privacydatastatus && taskColumns[task.privacydatastatus]) {
      taskColumns[task.privacydatastatus].push(task);
    }
  });

  const getUniqueValues = (data, key) => {
    const uniqueValues = [...new Set(data.map((item) => item[key]))];
    return uniqueValues.filter(
      (value) => value !== undefined && value !== null
    );
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  return (
    <div>
      <Header />
      <div>
        <center>
          <h1>Kanban Board</h1>
        </center>
        <div
          style={{
            border: "3px solid #ccc",
            padding: "5px",
          }}
        >
          <div
            className="additional-input-fields"
            style={{
              marginRight: "50px",
              marginLeft: "50px",
              marginBottom: "5px",
              marginTop: "2px",
              padding: "0px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr ",
              gap: "10px",
              fontSize: "1.0em",
            }}
          >
            <div>
              <label htmlFor="organization">Organization:</label>
              <input
                id="organization"
                type="text"
                placeholder="organization"
                defaultValue={uniqueValues.organization[0]}
              />
            </div>

            <div>
              <label htmlFor="responsibilityGroup">Responsibility Group:</label>
              <input
                id="responsibilityGroup"
                type="text"
                placeholder="Responsibility Group"
                defaultValue={uniqueValues.responsibilitygroup[0]}
              />
            </div>

            <div>
              <label htmlFor="responsibilityCenter">
                Responsibility Center:
              </label>
              <input
                id="responsibilityCenter"
                type="text"
                placeholder="Responsibility Center"
                defaultValue={uniqueValues.responsibilitycenter[0]}
              />
            </div>

            <div>
              <label htmlFor="algorithmInventoryDate">
                Algorithm Inventory Date:
              </label>
              <input
                id="algorithmInventoryDate"
                type="text"
                placeholder="Algorithm Inventory Date"
                value={formatDate(uniqueValues.algorithminventorydate[0])}
              />
            </div>

            <div>
              <label htmlFor="project">Project:</label>
              <input
                id="project"
                type="text"
                placeholder="Project"
                defaultValue={uniqueValues.project[0]}
              />
            </div>

            <div>
              <label htmlFor="projectCode">Project Code:</label>
              <input
                id="projectCode"
                type="text"
                placeholder="Project Code"
                defaultValue={uniqueValues.projectcode[0]}
              />
            </div>

            <div>
              <label htmlFor="algorithmInventoryTime">
                Algorithm Inventory Time:
              </label>
              <input
                id="algorithmInventoryTime"
                type="text"
                placeholder="Algorithm Inventory Time"
                defaultValue={uniqueValues.algorithminventorytime[0]}
              />
            </div>

            <div>
              <label htmlFor="codeName">Code Name:</label>
              <input
                id="codeName"
                type="text"
                placeholder="Code Name"
                defaultValue={uniqueValues.codename[0]}
              />
            </div>

            <div>
              <label htmlFor="objectType">Object Type:</label>
              <input
                id="objectType"
                type="text"
                placeholder="Object Type"
                defaultValue={uniqueValues.objecttype[0]}
              />
            </div>

            <div>
              <label htmlFor="object">Object:</label>
              <input
                id="object"
                type="text"
                placeholder="Object"
                defaultValue={uniqueValues.object[0]}
              />
            </div>

            <div>
              <label htmlFor="severity">Severity:</label>
              <input
                id="severity"
                type="text"
                placeholder="Severity"
                defaultValue={uniqueValues.severity[0]}
              />
            </div>

            <div>
              <label htmlFor="technologyname">Technology Name:</label>
              <input
                id="technologyname"
                type="text"
                placeholder="Technology Name"
                defaultValue={uniqueValues.technologyname[0]}
              />
            </div>

            <div>
              <label htmlFor="environment">Environment:</label>
              <input
                id="environment"
                type="text"
                placeholder="Environment"
                defaultValue={uniqueValues.environment[0]}
              />
            </div>

            <div>
              <label htmlFor="environmenttype">Environment Type:</label>
              <input
                id="environmenttype"
                type="text"
                placeholder="Environment Type"
                defaultValue={uniqueValues.environmenttype[0]}
              />
            </div>

            <div>
              <label htmlFor="themename">Theme Name:</label>
              <input
                id="themename"
                type="text"
                placeholder="Theme Name"
                defaultValue={uniqueValues.themename[0]}
              />
            </div>
          </div>
        </div>
        <div style={{ marginBottom: "2cm" }} className="kanban-board">
          {Object.keys(taskColumns).map((status, index) => (
            <div
              key={index}
              className={`column ${status.toLowerCase()}-column`}
            >
              <h3>{status}</h3>
              <div className="tasks" style={{ textAlign: "left" }}>
                {taskColumns[status].map((task) => (
                  <div key={task.algorithminventoryid} className="task">
                    <p>
                      <strong>Project : </strong> {task.project}
                    </p>
                    {task.algorithmstatus === status && (
                      <div>
                        <p>
                          <strong>Algorithm : </strong> {task.algorithm}
                        </p>
                        <p>
                          <strong>Algorithm Bias : </strong>{" "}
                          {task.algorithmbias}
                        </p>
                        <p>
                          <strong>Algorithm Version Date : </strong>

                          {formatDate(task.algorithmversiondate)}
                        </p>
                        <p>
                          <strong>Algorithm Version No : </strong>{" "}
                          {task.algorithmversionno}
                        </p>
                        <p>
                          <strong>Algorithm Remark : </strong>{" "}
                          {task.algorithmremark}
                        </p>
                        <p>
                          <strong> Algorithm Test Output URL : </strong>

                          {task.algorithmtestoutputurl}
                        </p>
                      </div>
                    )}
                    {task.datasetstatus === status && (
                      <div>
                        <p>
                          <strong>Dataset : </strong>
                          {task.dataset}
                        </p>
                        <p>
                          <strong>Dataset Version Date : </strong>

                          {formatDate(task.datasetversiondate)}
                        </p>
                        <p>
                          <strong>Dataset Version No : </strong>{" "}
                          {task.datasetversionno}
                        </p>
                        <p>
                          <strong>Data Remark : </strong> {task.dataremark}
                        </p>
                        <p>
                          <strong>Dataset Test Output URL : </strong>{" "}
                          {task.datasettestoutputurl}
                        </p>
                      </div>
                    )}
                    {task.codevulnerabilitystatus === status && (
                      <div>
                        <p>
                          <strong>Code Vulnerability:</strong>{" "}
                          {task.codevulnerability}
                        </p>
                        <p>
                          <strong>Code Vulnerability Version Date:</strong>{" "}
                          {formatDate(task.codevulnerabilityversiondate)}
                        </p>
                        <p>
                          <strong>Code Vulnerability Version No:</strong>{" "}
                          {task.codevulnerabilityversionno}
                        </p>
                        <p>
                          <strong>Code Vulnerability Bias:</strong>{" "}
                          {task.codevulnerabilitybias}
                        </p>
                        <p>
                          <strong>Code Vulnerability Remark:</strong>{" "}
                          {task.codevulnerabilityremark}
                        </p>
                        <p>
                          <strong>Code Vulnerability Test Output URL:</strong>{" "}
                          {task.codevulnerabilitytestoutputurl}
                        </p>
                      </div>
                    )}
                    {task.privacydatastatus === status && (
                      <div>
                        <p>
                          <strong>Privacy Data:</strong> {task.privacydata}
                        </p>
                        <p>
                          <strong>Privacy Data Version Date:</strong>{" "}
                          {formatDate(task.privacyversiondate)}
                        </p>
                        <p>
                          <strong>Privacy Data Version No:</strong>{" "}
                          {task.privacyversionno}
                        </p>
                        <p>
                          <strong>Privacy Data Bias:</strong>{" "}
                          {task.privacydatabias}
                        </p>
                        <p>
                          <strong>Privacy Data Remark:</strong>{" "}
                          {task.privacydataremark}
                        </p>
                        <p>
                          <strong>Privacy Data Test Output URL:</strong>{" "}
                          {task.privacytestoutputurl}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KanbanBoard;
