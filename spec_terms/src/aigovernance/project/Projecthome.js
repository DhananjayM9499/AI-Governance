import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";

const Projecthome = () => {
  const [project, setProjects] = useState([]);
  const [company, setCompany] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { companyid } = useParams();

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const responseCompany = await axios.get(
          API.GET_SPECIFIC_COMPANY(companyid)
        );
        setCompany(responseCompany.data);

        // Fetch projects associated with the company
        const responseProjects = await axios.get(
          API.GET_COMPANYSPECIFIC_PROJECT(companyid)
        );
        // After fetching and sorting projects
        // After fetching and sorting projects
        const sortedProjects = responseProjects.data.sort(
          (a, b) => b.projectid - a.projectid
        );

        // Check if there are projects
        if (sortedProjects.length > 0) {
          const firstProjectId = sortedProjects[0].projectid;

          // Set projects to state
          setProjects(sortedProjects);

          // Fetch evidence for the first project

          // Set evidence state based on the response

          // Use hasEvidenceData in conditional rendering or other logic
          // ...
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanyData();
  }, [companyid]);

  const deleteProject = async (projectid) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(API.DELETE_PROJECT_API(projectid));
        toast.success("Project Deleted Successfully");

        // Fetch updated projects after deletion
        const responseProjects = await axios.get(
          API.GET_COMPANYSPECIFIC_PROJECT(companyid)
        );
        setProjects(responseProjects.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const indexOfLastTerm = currentPage * itemsPerPage;
  const indexOfFirstTerm = indexOfLastTerm - itemsPerPage;
  const currentProject = project.slice(indexOfFirstTerm, indexOfLastTerm);

  const totalPages = Math.ceil(project.length / itemsPerPage);

  return (
    <div>
      <Header />

      <div>
        <div>
          <div style={{ fontFamily: "Poppins" }}>
            {company.map((company) => (
              <center key={company.companyid}>
                <h1 key={company.companyid}>
                  Project Details of : {company.organization}
                </h1>
              </center>
            ))}
          </div>
          <div className="container">
            <div style={{ marginTop: "0" }}>
              <center>
                <Link to={`/addproject/${companyid}`}>
                  <button className="btn btn-contact">Project</button>
                </Link>
              </center>
              <table className="styled-table" style={{ maxWidth: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Project No.</th>
                    <th style={{ textAlign: "center" }}>Project Name</th>
                    <th style={{ textAlign: "center" }}>
                      Responsibility Center
                    </th>
                    <th style={{ textAlign: "center" }}>
                      Responsibility Group
                    </th>

                    <th style={{ textAlign: "center" }}>Start Date</th>
                    <th style={{ textAlign: "center" }}>End Date</th>
                    <th style={{ textAlign: "center" }}>Project Type</th>

                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProject.map((project, index) => (
                    <tr key={project.projectid}>
                      <th scope="row">{indexOfFirstTerm + index + 1}</th>
                      <td>{project.projectname}</td>
                      <td>{project.responsibilitycenter}</td>
                      <td>{project.responsibilitygroup}</td>

                      <td>{formatDate(project.fromdate)}</td>
                      <td>{formatDate(project.todate)}</td>
                      <td>{project.projecttype}</td>

                      <td>
                        <Link
                          to={`/projectedit/${project.companyid}/${project.projectid}`}
                        >
                          <button className="btn btn-edit">Edit</button>
                        </Link>
                        <Link
                          to={`/resourcelist/${project.companyid}/${project.projectid}`}
                        >
                          <button className="btn btn-edit">Resources</button>
                        </Link>
                        <button
                          className="btn btn-delete"
                          onClick={() => deleteProject(project.projectid)}
                        >
                          Delete
                        </button>
                        {/* Conditional rendering for Evidence link */}

                        <Link
                          to={`/evidenceList/${project.projectid}/${companyid}`}
                        >
                          <button className="btn btn-view">
                            Evidence Based Governance
                          </button>
                        </Link>
                        <Link
                          to={`/GovEvidenceList/${project.projectid}/${companyid}`}
                        >
                          <button className="btn btn-view">
                            Governance Based Evidence
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
            <br />

            <div style={{ marginTop: "1px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <Link to={"/aigovernance"}>
              <div className="btn btn-edit">GO Back</div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Projecthome;
