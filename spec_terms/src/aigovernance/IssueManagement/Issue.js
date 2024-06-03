import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
import axios from "axios";

const Issue = () => {
  const { issueid, algorithminventoryid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize state with URL parameters
  const queryParams = new URLSearchParams(location.search);
  const initialState = {
    organization: queryParams.get("organization") || "",
    projectname: queryParams.get("projectname") || "",
    projectcode: queryParams.get("projectcode") || "",
    responsibilitygroup: queryParams.get("responsibilitygroup") || "",
    responsibilitycenter: queryParams.get("responsibilitycenter") || "",
    objecttype: queryParams.get("objecttype") || "",
    object: queryParams.get("object") || "",
    codename: queryParams.get("codename") || "",
    issuename: "", // Add issuename to initial state
    processissue: "",
    codingissue: "",
    resourceissue: "",
    infrastructureissue: "",
    modelissue: "",
    performanceissue: "",
    resolution: "",
    dataissue: "",
    issuedate: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [activityData, setActivityData] = useState([]);
  const [issueOptions, setIssueOptions] = useState([]); // State for issue dropdown options
  // Load issue options
  useEffect(() => {
    const fetchIssueData = async () => {
      try {
        const response = await axios.get(API.GET_SPECIFIC_ISSUE(issueid));
        const issueData = response.data[0];
        // Update formData state with fetched issue data
        setFormData({
          ...formData,
          ...issueData,
        });
      } catch (error) {
        console.error("Error fetching issue data:", error);
      }
    };

    if (issueid) {
      fetchIssueData();
    }
  }, [issueid]); // Include issueid in the dependency array

  // Function to handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };
    newFormData[name] = value;
    setFormData(newFormData);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        API.UPDATE_ISSUE_API(issueid, algorithminventoryid),
        formData
      );
      if (response.status === 200) {
        toast.success("Data Updated successfully");
        navigate(
          `/issueTable/${algorithminventoryid}?organization=${formData.organization}&responsibilitycenter=${formData.responsibilitycenter}&responsibilitygroup=${formData.responsibilitygroup}&projectname=${formData.projectname}&projectcode=${formData.projectcode}&codename=${formData.codename}&objecttype=${formData.objecttype}&object=${formData.object}&theme=${formData.themename}`
        );
      }
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    }
  };

  return (
    <div>
      <Header />
      <div>
        {/* Company and Project Details */}
        <div style={{ border: "3px solid #ccc" }}>
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
                    <strong>Organization : </strong> {formData.organization}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Responsibility Center : </strong>{" "}
                    {formData.responsibilitycenter}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Responsibility Group : </strong>
                    {formData.responsibilitygroup}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Object Type : </strong>
                    {formData.objecttype}
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
                    <strong>Object : </strong> {formData.object}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Project : </strong>
                    {formData.projectname}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Project Code : </strong>
                    {formData.projectcode}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Code Name : </strong>
                    {formData.codename}
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

          {/* Render Company and Project Details */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Issue Name Dropdown */}
          <div
            style={{ marginBottom: "10px", width: "20%", marginTop: "10px" }}
          >
            <label htmlFor="issuename">
              <strong>Problem Type:</strong>
            </label>
            <select
              type="text"
              id="issuename"
              name="issuename"
              value={formData.issuename}
              onChange={(e) => handleInputChange(e)}
            >
              <option value="">Select Issue Name</option>
              <option val="Algorithm">Algorithm</option>
              <option val="Data set">Data Set</option>
              <option val="Code Vulnerability">Code Vulnerability</option>
              <option val="Privacy Data">Privacy Data</option>
              <option val="Reliability">Reliability</option>
              <option val="Privacy">Privacy</option>
              <option val="Bias">Bias</option>
              <option val="Security">Security</option>
              <option val="Performance">Performance</option>
              <option val="Robustness">Robustness</option>
              <option val="Transparency">Transparency</option>
              <option val="Fairness">Fairness</option>
              <option val="Accountability">Accountability</option>
              <option val="Ethics">Ethics</option>
              <option val="Explainability">Explainability</option>
            </select>
          </div>
          <hr style={{ border: "3px solid #ccc" }}></hr>

          <table className="styled-table" style={{ maxWidth: "90%" }}>
            <thead>
              <tr>
                <th>Process Issue</th>
                <th>Coding Issue</th>
                <th>Resource Issue</th>
                <th>Infrastructure Issue</th>
                <th>Model Issue</th>
                <th>Performance Issue</th>
                <th>Data Issue</th>
                <th>Resolution</th>
                <th>Issue Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="processissue"
                    value={formData.processissue || ""}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="codingissue"
                    value={formData.codingissue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="resourceissue"
                    value={formData.resourceissue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="infrastructureissue"
                    value={formData.infrastructureissue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="modelissue"
                    value={formData.modelissue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="performanceissue"
                    value={formData.performanceissue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="dataissue"
                    value={formData.dataissue}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
                <td>
                  <textarea
                    rows="2"
                    cols="20"
                    style={{
                      fontFamily: "Poppins",
                      marginTop: "5px",
                      marginLeft: "5px",
                      width: "95%",
                    }}
                    name="resolution"
                    value={formData.resolution}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>

                <td>
                  <input
                    style={{
                      fontFamily: "Poppins",

                      fontSize: "16px",
                      marginTop: "6px",
                      width: "200px",
                      height: "35px",
                      borderRadius: "3px",
                    }}
                    type="date"
                    name="issuedate"
                    value={formData.issuedate}
                    onChange={(e) => handleInputChange(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Update</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Issue;
