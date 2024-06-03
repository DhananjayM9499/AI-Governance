import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";
import { toast } from "react-toastify";

const IssueTable = () => {
  const location = useLocation();
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
  const [data, setData] = useState([]);
  const { algorithminventoryid } = useParams();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const loadData = async () => {
    try {
      const response = await axios.get(
        API.GET_AIISSUE_API(algorithminventoryid)
      );
      const sortedData = response.data.sort(
        (a, b) => b.projectid - a.projectid
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [algorithminventoryid]);

  const deleteIssue = async (issueid, e) => {
    e.stopPropagation(); // Stop event propagation to prevent triggering other events

    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(API.DELETE_ISSUE_API(issueid));

        if (response.status === 200) {
          toast.success("Issue Deleted Successfully");
          loadData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error("Cannot delete Issue as there are associates present.");
        } else {
          console.log(error);
          toast.error("An error occurred while deleting Issue.");
        }
      }
    }
  };
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const response = await axios.post(
        API.ADD_ISSUE_API(algorithminventoryid),
        formData
      );
      if (response.status === 200) {
        toast.success("Data added successfully");
        loadData();
        setShowAddForm(false); // Hide the add form after successful submission
        setFormData(initialState); // Reset form data to initial state
      }
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div>
      <Header />
      <hr></hr>
      <div>
        <h1 style={{ fontFamily: "Poppins" }}>Issue Management </h1>
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
                  <strong>Responsibility Group : </strong>{" "}
                  {formData.responsibilitygroup}
                </p>
              </div>
              <div>
                <p>
                  <strong>Object Type : </strong> {formData.objecttype}
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
          </div>
          {/* Project Details */}
        </div>
        <div style={{ marginTop: "7px" }}>
          <Link to={`/fishbone/${algorithminventoryid}`}>
            <button className="btn btn-edit">Ishikawa Diagram</button>{" "}
          </Link>
        </div>
        <table
          className="styled-table"
          style={{ marginTop: "10px", maxWidth: "80%" }}
        >
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>No.</th>
              <th style={{ textAlign: "center" }}>Problem Type</th>
              <th style={{ textAlign: "center" }}>Process Issue</th>
              <th style={{ textAlign: "center" }}>Coding Issue</th>
              <th style={{ textAlign: "center" }}>Resource Issue</th>
              <th style={{ textAlign: "center" }}>Infrastructure Issue</th>
              <th style={{ textAlign: "center" }}>Model Issue</th>
              <th style={{ textAlign: "center" }}>Performance Issue</th>
              <th style={{ textAlign: "center" }}>Data Issue</th>
              <th style={{ textAlign: "center" }}>Resolution</th>
              <th style={{ textAlign: "center" }}>Issue Date</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.issuename || "-"}</td>
                  <td>{item.processissue || "-"}</td>
                  <td>{item.codingissue || "-"}</td>
                  <td>{item.resourceissue || "-"}</td>
                  <td>{item.infrastructureissue || "-"}</td>{" "}
                  <td>{item.modelissue || "-"} </td>
                  <td>{item.performanceissue || "-"}</td>
                  <td>{item.dataissue || "-"}</td>
                  <td>{item.resolution || "-"}</td>
                  <td>{formatDate(item.issuedate) || "-"}</td>
                  <td>
                    <Link
                      to={`/issue/${item.issueid}/${algorithminventoryid}?organization=${data[0].organization}&responsibilitycenter=${data[0].responsibilitycenter}&responsibilitygroup=${data[0].responsibilitygroup}&projectname=${data[0].projectname}&projectcode=${data[0].projectcode}&codename=${data[0].codename}&objecttype=${data[0].objecttype}&object=${data[0].object}&theme=${data[0].themename}`}
                    >
                      <button className="btn btn-edit">Edit</button>{" "}
                    </Link>
                    <button
                      className="btn btn-delete"
                      onClick={(e) => deleteIssue(item.issueid, e)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          className="btn btn-add"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Hide Issue Form" : "Add Issue"}
        </button>
        {showAddForm && (
          <form onSubmit={handleSubmit}>
            <table className="styled-table" style={{ maxWidth: "90%" }}>
              <thead>
                <tr>
                  <th>Problem Type</th>
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
                    <label htmlFor="issuename"></label>
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
                      <option val="Code Vulnerability">
                        Code Vulnerability
                      </option>
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
                      name="processissue"
                      value={formData.processissue}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button className="btn btn-submit" type="submit">
              Submit
            </button>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default IssueTable;
