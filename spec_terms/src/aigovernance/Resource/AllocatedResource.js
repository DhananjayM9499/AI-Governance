import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";

const AllocatedResource = () => {
  const [company, setCompany] = useState({});
  const [project, setProject] = useState({});
  const [resourceName, setResourceName] = useState([]);

  const { companyid, projectid } = useParams();
  const fetchData = async () => {
    try {
      const [companyResponse, projectResponse, allocatedResourceResponse] =
        await Promise.all([
          axios.get(API.GET_SPECIFIC_COMPANY(companyid)),
          axios.get(API.GET_SPECIFIC_PROJECT(projectid)),
          axios.get(API.GET_ALLOCATEDRESOURCE_API(projectid)),
        ]);

      setCompany(companyResponse.data[0]);
      setProject(projectResponse.data[0]);

      const resourceIds = allocatedResourceResponse.data.map(
        (resource) => resource.resourceid
      );

      const resourceDetails = await Promise.all(
        resourceIds.map((resourceid) =>
          axios.get(API.GET_RESOURCEMASTER_API(resourceid))
        )
      );

      const resourceNameData = resourceDetails.map((response) => response.data);
      setResourceName(resourceNameData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [projectid, companyid]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const handleDeleteResource = async (resourceid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(
          API.DELETE_ALLOCATEDRESOURCE_API(resourceid)
        );
        if (response.status === 200) {
          toast.success("Resource Removed Successfully");
          fetchData();
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot Remove Resource as there are associates present."
          );
        } else {
          console.error("Error removing resource:", error);
          toast.error("An error occurred while removing Resource");
        }
      }
    }
  };

  return (
    <div>
      <Header />
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
            <div
              style={{
                border: "3px solid #ccc",
                padding: "5px",
                flex: 1,
                display: "flex",
              }}
            >
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
                <div>
                  <p>Contact Person : {company.contactname}</p>
                  <p>Contact Email : {company.contactemail}</p>
                  <p>Contact phone : {company.contactphone}</p>
                </div>
              </div>
              <div
                style={{
                  width: "10px",
                  background: "#ccc",
                  alignContent: "end",
                }}
              ></div>
              <div style={{ flex: 1, paddingLeft: "20px", textAlign: "left" }}>
                <h2>Project Details</h2>
                <div>
                  <div
                    style={{ flex: 1, paddingLeft: "20px", textAlign: "left" }}
                  >
                    <div>
                      <p>Project Name : {project.projectname}</p>
                      <p>Start Date : {formatDate(project.fromdate)}</p>
                      <p>End Date : {formatDate(project.todate)}</p>
                      <p>
                        Responsibility Center : {project.responsibilitycenter}
                      </p>
                      <p>
                        Responsibility Group : {project.responsibilitygroup}
                      </p>
                    </div>
                  </div>
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
        )}
      </div>

      <div>
        <Link to={{ pathname: `/Viewproject/${companyid}/${projectid}` }}>
          <button className="btn btn-contact">Add Resource</button>
        </Link>
      </div>
      <table className="styled-table" style={{ maxWidth: "100%" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Resource No.</th>
            <th style={{ textAlign: "center" }}>Resource Name</th>
            <th style={{ textAlign: "center" }}>Designation</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {resourceName.map((resource, index) => (
            <tr key={index + 1}>
              <th scope="row">{index + 1}</th>
              <td>{resource.resourcename}</td>
              <td>{resource.designation}</td>
              <td>
                <button
                  className="btn btn-edit"
                  onClick={() => handleDeleteResource(resource.resourceid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Footer />
    </div>
  );
};

export default AllocatedResource;
