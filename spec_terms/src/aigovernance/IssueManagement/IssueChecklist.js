import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
import axios from "axios";

const Issuechecklist = () => {
  const { checklistid, algorithminventoryid } = useParams();
  const navigate = useNavigate();

  // Initial form state
  const initialFormData = {
    theme: "Ishikawa model",
    stakeholdername: [],
    designation: [],
    resources: [],
    activitycode: [],
    status: [],
    actualevidence: [],
    percentagecompletion: [],
    remark: [],
    planstartdate: [],
    planenddate: [],
    actualstartdate: [],
    actualenddate: [],
  };

  // State variables
  const [formData, setFormData] = useState(initialFormData);
  const [activityData, setActivityData] = useState([0]);
  const [resourceList, setResourceList] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [groupedResources, setGroupedResources] = useState({});

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityResponse, resourceResponse, stakeholderResponse] =
          await Promise.all([
            axios.get(API.GET_AIISSUE_API(algorithminventoryid)),
            axios.get(API.GET_RESOURCE_API),
            axios.get(API.GET_VENDORMASTER_API),
          ]);

        setActivityData(activityResponse.data);
        setResourceList(resourceResponse.data);
        setStakeholders(stakeholderResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [algorithminventoryid]);

  // Group resources by designation
  useEffect(() => {
    const groupResources = () => {
      const grouped = {};
      resourceList.forEach((resource) => {
        if (!grouped[resource.designation]) {
          grouped[resource.designation] = [];
        }
        grouped[resource.designation].push(resource);
      });
      setGroupedResources(grouped);
    };

    groupResources();
  }, [resourceList]);

  // Filter resources based on selected designation
  useEffect(() => {
    if (formData.designation) {
      const filtered = resourceList.filter(
        (resource) => resource.designation === formData.designation
      );
      setFilteredResources(filtered);
    }
  }, [formData.designation, resourceList]);

  // Handle form input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };

    // Initialize the field array if it doesn't exist
    if (!newFormData[name]) {
      newFormData[name] = [];
    }

    // Update the value at the specified index
    newFormData[name][index] = value;

    setFormData(newFormData);
  };

  // Handle designation change
  const handleDesignationChange = (e, index) => {
    const newDesignation = e.target.value;
    const newFormData = { ...formData };
    newFormData.designation[index] = newDesignation;
    setFormData(newFormData);
  };

  // Handle form submission
  const handleSubmit = async (e, rowIndex) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        API.ADD_CHECKLIST_API(algorithminventoryid),
        {
          ...formData,
          algorithminventoryid,
          phase: activityData[rowIndex]?.issuename,
          activitygroup: "Activity Group", // Placeholder value, update as needed
          activity: "Activity", // Placeholder value, update as needed
        }
      );

      if (response.status === 200) {
        toast.success("Data added successfully");
        navigate(`/checklistTable/${algorithminventoryid}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to submit data");
    }
  };

  const renderInputs = (index) => (
    <>
      <td>
        <div>
          <select
            name={`stakeholdername[${index}]`}
            value={formData.stakeholdername[index] || ""}
            onChange={(e) => handleInputChange(e, index)}
          >
            <option value="">Select Stake Holder(s)</option>
            {stakeholders.map((stakeholder) => (
              <option key={stakeholder.vendorid} value={stakeholder.vendorname}>
                {stakeholder.vendorname}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td>
        <div>
          <select
            name={`designation[${index}]`}
            value={formData.designation[index] || ""}
            onChange={(e) => handleDesignationChange(e, index)}
          >
            <option value="">Select Designation</option>
            {Object.keys(groupedResources).map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td>
        <div>
          <select
            name={`resources[${index}]`}
            value={formData.resources[index] || ""}
            onChange={(e) => handleInputChange(e, index)}
          >
            <option value="">Select resource(s)</option>
            {filteredResources.map((resource) => (
              <option key={resource.resourceid} value={resource.resourcename}>
                {resource.resourcename}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td>
        <input
          name={`activitycode[${index}]`}
          type="text"
          value={formData.activitycode[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <select
          name={`status[${index}]`}
          value={formData.status[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        >
          <option value="">Status</option>
          <option value="Open">Open</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Closed">Closed</option>
          <option value="Packed">Parked</option>
          <option value="Aborted">Aborted</option>
        </select>
      </td>
      <td>
        <input
          name={`actualevidence[${index}]`}
          type="text"
          value={formData.actualevidence[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          name={`percentagecompletion[${index}]`}
          type="number"
          value={formData.percentagecompletion[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          name={`remark[${index}]`}
          type="text"
          value={formData.remark[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          name={`planstartdate[${index}]`}
          type="date"
          value={formData.planstartdate[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          name={`planenddate[${index}]`}
          type="date"
          value={formData.planenddate[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          name={`actualstartdate[${index}]`}
          type="date"
          value={formData.actualstartdate[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <input
          name={`actualenddate[${index}]`}
          type="date"
          value={formData.actualenddate[index] || ""}
          onChange={(e) => handleInputChange(e, index)}
        />
      </td>
      <td>
        <div>
          <input
            type="submit"
            value={checklistid ? "Update" : "Save"}
            onClick={(e) => handleSubmit(e, index)}
          />
        </div>
        <button className="btn btn-edit">Edit</button>
      </td>
    </>
  );

  /**************************************************************************************************** */

  return (
    <div>
      <Header />
      <div>
        {/* Master Section - Company and Project Details */}
        <div
          style={{
            border: "3px solid #ccc",
            padding: "5px",
          }}
        >
          {/* Company Details */}
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr ",
                gap: "40px",
              }}
            >
              <div>
                {" "}
                <p>
                  <strong>Organization : </strong>{" "}
                  {activityData[0].organization}
                </p>
              </div>
              <div>
                <p>
                  <strong>Responsibility Center : </strong>{" "}
                  {activityData[0].responsibilitycenter}
                </p>
              </div>
              <div>
                <p>
                  <strong>Responsibility Group : </strong>
                  {activityData[0].responsibilitygroup}
                </p>
              </div>
              <div>
                <p>
                  <strong>Object Type : </strong>
                  {activityData[0].objecttype}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr ",
                gap: "40px",
              }}
            >
              <div>
                {" "}
                <p>
                  <strong>Object : </strong> {activityData[0].object}
                </p>
              </div>
              <div>
                <p>
                  <strong>Project : </strong>
                  {activityData[0].projectname}
                </p>
              </div>
              <div>
                <p>
                  <strong>Project Code : </strong>
                  {activityData[0].projectcode}
                </p>
              </div>
              <div>
                <p>
                  <strong>Code Name : </strong>
                  {activityData[0].codename}
                </p>
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
          </div>
        </div>

        <div style={{ textAlign: "left", marginLeft: "2cm" }}>
          <p>
            <strong>Theme : </strong>
            {initialFormData.theme}
          </p>
        </div>
        <hr
          style={{ width: "100%", marginLeft: "0", border: "3px solid #ccc" }}
        ></hr>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "auto",
            padding: "5px",
            alignContent: "center",
          }}
          onSubmit={handleSubmit}
        >
          <div
            style={{
              padding: "5px",
            }}
          >
            <table
              className="styled-table"
              style={{
                maxWidth: "100%",
                margin: "1px",
                fontSize: "1.0em",
                marginBottom: "2cm",
              }}
            >
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th></th>
                  <th>Activity Category</th>
                  <th colSpan="2">Activity Group</th>
                  <th> Activity/Task</th>
                  <th>Stake Holder</th>
                  <th>Designation</th>
                  <th>Resources</th> {/* Add column for resources */}
                  <th>Activity Code</th>
                  <th>Status</th>
                  <th>Actual Evidence</th>
                  <th>Percentage Completion</th>
                  <th>Remark</th>
                  <th>Plan Start Date</th>
                  <th>Plan End Date</th>
                  <th>Actual Start Date</th>
                  <th>Actual End Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {activityData.map(
                  (activity, index) =>
                    activity.processissue && (
                      <tr key={`processissue_${index}`}>
                        <th scope="row">•</th>
                        <td>{activity.issuename}</td>
                        <td colSpan="2">Process Issue:</td>
                        <td>{activity.processissue}</td>
                        {renderInputs("processissue", index)}
                      </tr>
                    )
                )}

                {activityData.map(
                  (activity, index) =>
                    activity.codingissue && (
                      <tr key={`codingissue_${index}`}>
                        <th scope="row">•</th> <td>{activity.issuename}</td>
                        <td>Coding Issue:</td>
                        <td colSpan="2">{activity.codingissue}</td>
                        {renderInputs(index)}
                      </tr>
                    )
                )}
                {activityData.map(
                  (activity, index) =>
                    activity.resourceissue && (
                      <tr key={`resourceissue_${index}`}>
                        <th scope="row">•</th> <td>{activity.issuename}</td>
                        <td>Resource Issue:</td>
                        <td colSpan="2">{activity.resourceissue}</td>
                        {renderInputs(index)}
                      </tr>
                    )
                )}
                {activityData.map(
                  (activity, index) =>
                    activity.infrastructureissue && (
                      <tr key={`infrastructureissue_${index}`}>
                        <th scope="row">•</th> <td>{activity.issuename}</td>
                        <td>Infrastructure Issue:</td>
                        <td colSpan="2">{activity.infrastructureissue}</td>
                        {renderInputs(index)}
                      </tr>
                    )
                )}
                {activityData.map(
                  (activity, index) =>
                    activity.performanceissue && (
                      <tr key={`performanceissue_${index}`}>
                        <th scope="row">•</th> <td>{activity.issuename}</td>
                        <td>Performance Issue:</td>
                        <td colSpan="2">{activity.performanceissue}</td>
                        {renderInputs(index)}
                      </tr>
                    )
                )}
                {activityData.map(
                  (activity, index) =>
                    activity.securityissue && (
                      <tr key={`securityissue_${index}`}>
                        <th scope="row">•</th> <td>{activity.issuename}</td>
                        <td>Security Issue:</td>
                        <td colSpan="2">{activity.securityissue}</td>
                        {renderInputs(index)}
                      </tr>
                    )
                )}
                {activityData.map(
                  (activity, index) =>
                    activity.dataissue && (
                      <tr key={`dataissue_${index}`}>
                        <th scope="row">•</th>
                        <td>{activity.issuename}</td>
                        <td>Data Issue:</td>
                        <td colSpan="2">{activity.dataissue}</td>
                        {renderInputs(index)}
                      </tr>
                    )
                )}
                {activityData.map(
                  (activity, index) =>
                    activity.modelissue && (
                      <tr key={`modelissue_${index}`}>
                        <th scope="row">•</th>
                        <td>{activity.issuename}</td>
                        <td>Model Issue:</td>
                        <td colSpan="2">{activity.modelissue}</td>
                        {renderInputs(index)}
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Issuechecklist;
