import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";

const initialState = {
  assessmentreferencelink: "",
  assessmentremark: "",
  assessmentupload: "",
  assessmentstatus: "",
  assessmentscore: null,
};

const AssesmentList = () => {
  const [state, setState] = useState(initialState);
  const [company, setCompany] = useState({});
  const [project, setProject] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [assessmentList, setAssessmentList] = useState([]);
  const [governance, setGovernance] = useState([]);

  const { projectid, companyid, resultid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await axios.get(
          API.GET_SPECIFIC_COMPANY(companyid)
        );
        setCompany({ ...companyResponse.data[0] });

        const projectResponse = await axios.get(
          API.GET_SPECIFIC_PROJECT(projectid)
        );
        setProject({ ...projectResponse.data[0] });

        const governanceResponse = await axios.get(
          API.GET_SPECIFIC_EVIDENCE(resultid)
        );
        setGovernance([...governanceResponse.data]);

        const assessmentResponse = await axios.get(
          API.GET_PROJECT_ASSESSMENTS(resultid)
        );

        // Filter out items where assessmentreferencelink is null
        const filteredData = assessmentResponse.data.filter(
          (item) => item.assessmentreferencelink !== null
        );

        setAssessmentList(filteredData);
        console.log("data :", filteredData);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, [resultid, companyid, projectid]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assessmentList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteAssessment = async (resultid) => {
    if (window.confirm("Are you sure?")) {
      try {
        const response = await axios.delete(API.DELETE_EVIDENCE_API(resultid));
        if (response.status === 200) {
          toast.success("Evidence Deleted Successfully");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(
            "Cannot delete Evidence as there are associates present."
          );
        } else {
          console.error(error);
          toast.error("An error occurred while deleting Evidence.");
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      assessmentreferencelink,
      assessmentremark,
      assessmentupload,
      assessmentstatus,
      assessmentscore,
    } = state;

    if (
      !assessmentreferencelink ||
      !assessmentremark ||
      !assessmentupload ||
      !assessmentstatus ||
      !assessmentscore
    ) {
      toast.error("Please provide all the input fields.");
    } else {
      const url = resultid
        ? `https://staging.apilayer.valuevalidator.com/node-api/addassessment/${resultid}`
        : API.UPDATE_ASSESSMENTS_API(resultid);

      axios
        .put(url, {
          assessmentreferencelink,
          assessmentremark,
          assessmentupload,
          assessmentstatus,
          assessmentscore,
        })
        .then(() => {
          setState(initialState);
          toast.success(
            resultid ? "Audit result added" : "Audit Results Updated"
          );
          setTimeout(
            () => navigate(`/assessmentList/${projectid}/${resultid}`),
            500
          );
        })
        .catch((err) => toast.error(err.response.data));
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: "flex", marginTop: "10px", font: "Poppins" }}>
        <div
          style={{
            border: "3px solid #ccc",
            padding: "5px",
            flex: 1,
            display: "flex",
          }}
        >
          <div style={{ flex: 1, marginRight: "50px", textAlign: "left" }}>
            <h2>{company.organization}</h2>
            <div>
              <p>Contact Person : {company.contactname}</p>
              <p>Contact Email : {company.contactemail}</p>
              <p>Contact phone : {company.contactphone}</p>
            </div>
          </div>
          <div
            style={{ width: "10px", background: "#ccc", alignContent: "end" }}
          ></div>
          <div style={{ flex: 1, paddingLeft: "20px", textAlign: "left" }}>
            <h2>Project Details</h2>
            <div>
              <p>Project Name : {project.projectname}</p>
              <p>Start Date : {formatDate(project.fromdate)}</p>
              <p>End Date : {formatDate(project.todate)}</p>
            </div>
          </div>
          <div
            style={{ width: "10px", background: "#ccc", alignContent: "end" }}
          ></div>
        </div>
      </div>

      <div style={{ marginTop: "5px", padding: "20px" }}>
        <form
          style={{ fontFamily: "Poppins", margin: "0px" }}
          onSubmit={handleSubmit}
        >
          <div style={{ marginBottom: "20px" }}>
            <DetailsForm
              governance={governance.length > 0 ? governance[0] : {}}
            />
          </div>
          <div>
            <Link
              to={{
                pathname: `/assessment/${projectid}/${companyid}`,
                state: { governanceDetails: governance },
              }}
            >
              <button
                style={{ alignContent: "center" }}
                className="btn btn-contact"
              >
                Add Assessment
              </button>
            </Link>
            {assessmentList.length > 0 ? (
              <table className="styled-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>No.</th>
                    <th style={{ textAlign: "center" }}>
                      Assessment Reference link
                    </th>
                    <th style={{ textAlign: "center" }}>Assessment Remark</th>
                    <th style={{ textAlign: "center" }}>Assessment Upload</th>
                    <th style={{ textAlign: "center" }}>Assessment Status</th>
                    <th style={{ textAlign: "center" }}>Assessment Score</th>

                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentList && assessmentList.length > 0
                    ? currentItems.map((item, index) => (
                        <tr key={item.id}>
                          <th scope="row">{index + indexOfFirstItem + 1}</th>
                          <td>{item.assessmentreferencelink}</td>
                          <td>{item.assessmentremark}</td>
                          <td>{item.assessmentstatus}</td>
                          <td>{item.assessmentupload}</td>
                          <td>{item.assessmentscore}</td>

                          <td>
                            <Link
                              to={`/assessmentEdit/${projectid}/${companyid}/${resultid}`}
                            >
                              <button className="btn btn-edit">Edit</button>
                            </Link>
                            <button
                              className="btn btn-delete"
                              onClick={() => deleteAssessment(item.resultid)}
                            >
                              Delete
                            </button>
                            <Link
                              to={`/projectaudit/${projectid}/${companyid}/${resultid}`}
                            >
                              <button className="btn btn-edit">
                                Audit Plan
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    : Array.from({ length: itemsPerPage }).map((_, index) => (
                        <tr key={index}>
                          <th scope="row">{index + indexOfFirstItem + 1}</th>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      ))}
                </tbody>
              </table>
            ) : (
              <p>
                No evidence available. Add evidence using the "Add Assessment"
                button above.
              </p>
            )}
          </div>
          <div className="pagination">
            {Array.from({
              length: Math.ceil(governance.length / itemsPerPage),
            }).map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div>
            <input type="submit" value={resultid ? "Save" : "Save"} />
            <Link to={`/assessmentList/${projectid}/${companyid}/${resultid}`}>
              <input
                style={{
                  fontFamily: "Poppins",
                  backgroundColor: "#3386ff",
                  width: "100px",
                }}
                type="button"
                value="Go back"
              />
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

const DetailsForm = ({ governance }) => {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr",
          gap: "40px",
        }}
      >
        <div>
          <label>Governance Group :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="groupid"
            name="groupid"
            value={governance.groupname}
            readOnly
          />
          <br />
        </div>
        <div>
          <label>Governance Thrust Area :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="thrustarea"
            name="thrustarea"
            value={governance.thrustarea}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="controlid">Control Name:</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="controlid"
            name="controlid"
            value={governance.controlname}
            readOnly
          />
        </div>
        <div>
          <label>Control Weight : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="controlwt"
            name="controlwt"
            value={governance.controlwt}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="subcontrolid">Sub-Control Name:</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="subcontrolid"
            name="subcontrolid"
            value={governance.subcontrolname}
            readOnly
          />
        </div>
        <div>
          <label>Sub-Control Weight : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="subcontrolwt"
            name="subcontrolwt"
            value={governance.subcontrolwt}
            readOnly
          />
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
          <label>Evidence Link :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="evidencereferencelink"
            name="evidencereferencelink"
            value={governance.evidencereferencelink}
            readOnly
          />
          <br />
        </div>
        <div>
          <label>Evidence Remark :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="evidenceremark"
            name="evidenceremark"
            value={governance.evidenceremark}
            readOnly
          />
        </div>
        <div>
          <label>Evidence Upload :</label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="evidenceupload"
            name="evidenceupload"
            value={governance.evidenceupload}
            readOnly
          />
        </div>
        <div>
          <label>Evidence Status : </label>
          <input
            style={{ fontFamily: "Poppins", backgroundColor: "#eee" }}
            type="text"
            id="evidencestatus"
            name="evidencestatus"
            value={governance.evidencestatus}
            readOnly
          />
        </div>
      </div>
      <hr style={{ margin: "30px 0px ", border: "3px solid #ccc" }} />
    </div>
  );
};

export default AssesmentList;
