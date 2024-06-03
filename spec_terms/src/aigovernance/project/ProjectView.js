import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as API from "../endpoint";

const ProjectView = () => {
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});
  const [project, setProject] = useState({});
  const [designation, setDesignation] = useState("");
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [resource, setResource] = useState([]);

  const { companyid, projectid } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (projectid || companyid) {
      axios
        .get(API.GET_COMPANY_PROJECT(projectid, companyid))
        .then((resp) => {
          const formattedUser = formatDates(resp.data[0]);
          setUser(formattedUser);
        })
        .catch((error) => {
          console.error("An error occurred while fetching the Project:", error);
        });
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
        setProject({ ...resp.data[0] });
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching the Project Details:",
          error
        );
      });

    axios
      .get(API.GET_DESIGNATION_API)
      .then((resp) => {
        setResource(resp.data);
      })
      .catch((error) => {
        console.error(
          "An error occurred while fetching the Project Details:",
          error
        );
      });
  }, [projectid, companyid]);

  useEffect(() => {
    if (designation) {
      axios
        .get(API.GET_RESOURCES_BY_DESIGNATION(designation))
        .then((resp) => {
          setResources(resp.data);
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching the Resources:",
            error
          );
        });
    }
  }, [designation]);

  const formatDates = (project) => {
    const formattedProject = { ...project };
    formattedProject.fromdate = formatDate(project.fromdate);
    formattedProject.todate = formatDate(project.todate);
    return formattedProject;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
    setSelectedResources([]);
  };

  const handleResourceCheckboxChange = (resourceid) => {
    console.log("Resource checkbox changed for resource ID:", resourceid);
    setSelectedResources((prevSelectedResources) => {
      if (prevSelectedResources.includes(resourceid)) {
        return prevSelectedResources.filter(
          (selectedResourceId) => selectedResourceId !== resourceid
        );
      } else {
        return [...prevSelectedResources, resourceid];
      }
    });
  };

  const handleAllocateProject = () => {
    // Prepare the payload
    const payload = {
      projectid: projectid, // Include the project ID
      resourceid: selectedResources, // Include the array of resource IDs
    };

    // Make the POST request to the API endpoint
    axios
      .post(API.ALLOCATE_RESOURCE_API, payload)
      .then((response) => {
        console.log("Resource allocation successful:", response.data);
        // Optionally, you can perform further actions upon successful allocation
      })
      .catch((error) => {
        console.error("Error allocating resources:", error);
        // Handle errors if the API call fails
      });
    setTimeout(() => navigate(`/project/${companyid}`), 500);
  };

  return (
    <div>
      {company && project && (
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
                <div
                  style={{ flex: 1, paddingLeft: "20px", textAlign: "left" }}
                >
                  <div>
                    <p>Project Name : {project.projectname}</p>{" "}
                    <p>Start Date : {formatDate(project.fromdate)}</p>
                    <p>End Date : {formatDate(project.todate)}</p>
                    <p>
                      Responsibility Center : {project.responsibilitycenter}
                    </p>
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
      )}

      <div>
        <label>Designation :</label>
        <select
          style={{
            fontFamily: "Poppins",
            //color: isReadOnly ? "#000000" : "#000000", // Grey for readonly
            //backgroundColor: isReadOnly ? "#f4f4f4" : "#ffffff", // Background color for readonly
          }}
          id="designation"
          name="designation"
          value={designation || ""}
          onChange={handleDesignationChange}

          // disabled={isReadOnly} // Disable if in read-only mode
        >
          <option value="">Select Designation</option>
          {resource.map((resource) => (
            <option key={resource.resourceid} value={resource.designation}>
              {resource.designation}
            </option>
          ))}
        </select>
      </div>
      {resources.length > 0 && (
        <div>
          <h2>Resources:</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.resourceid}>
                  <td>{resource.resourcename}</td>
                  <td>{resource.designation}</td>
                  <td>{resource.status}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(resource.resourceid)}
                      onChange={() =>
                        handleResourceCheckboxChange(resource.resourceid)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-edit" onClick={handleAllocateProject}>
            Allocate Resource
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectView;
