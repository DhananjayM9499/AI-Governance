import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../endpoint";
import Header from "../pages/header";
import Footer from "../pages/footer";

const initialState = {
  projectname: "",
  auditors: "",
  auditees: "",
  auditscope: "",
  auditdate: "",
};

const AddEditprojectAudit = () => {
  const [state, setState] = useState(initialState);
  const [projectNames, setProjectNames] = useState([]);
  const { projectname, auditors, auditees, auditscope, auditdate } = state;
  const { auditid, projectid, companyid, resultid } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert date format if the input is for "auditdate"
    const formattedValue =
      name === "auditdate"
        ? new Date(value).toISOString().split("T")[0]
        : value;

    setState({ ...state, [name]: formattedValue });
  };
  useEffect(() => {
    if (auditid) {
      try {
        axios.get(API.GET_SPECIFIC_AUDITPLAN(auditid)).then((resp) => {
          const { auditdate, ...restData } = resp.data[0];
          const formattedAuditDate = auditdate
            ? new Date(auditdate).toISOString().split("T")[0]
            : "";
          setState({ ...restData, auditdate: formattedAuditDate });
        });
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    }
    if (!companyid || !projectid) {
      axios
        .get(API.GET_PROJECTNAME_API)
        .then((response) => {
          setProjectNames(response.data); // Assuming the API returns an array of project names and IDs
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching Project Names:",
            error
          );
        });
    } else {
      axios
        .get(API.GET_SPECIFIC_PROJECTNAME(projectid))
        .then((response) => {
          setProjectNames(response.data); // Assuming the API returns an array of project names and IDs
        })
        .catch((error) => {
          console.error(
            "An error occurred while fetching Project Names:",
            error
          );
        });
    }
  }, [auditid, projectid, companyid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectname || !auditors || !auditees || !auditscope || !auditdate) {
      toast.error("please provide the Input");
    } else {
      if (!auditid) {
        if (companyid && resultid) {
          axios
            .post(API.ADD_AUDITPLAN_API(projectid, companyid, resultid), {
              projectname,
              auditors,
              auditees,
              auditscope,
              auditdate,
            })
            .then(() => {
              setState(initialState);
            })
            .catch((err) => toast.error(err.response.data));
          toast.success("Project Added");
        } else {
          axios
            .post(API.ADD_DIRECT_AUDIT, {
              projectname,
              auditors,
              auditees,
              auditscope,
              auditdate,
              projectid,
              companyid,
            })
            .then(() => {
              setState(initialState);
            })
            .catch((err) => toast.error(err.response.data));
          toast.success("Project Added");
        }
      } else {
        axios
          .put(API.UPDATE_AUDITPLAN_API(auditid), {
            projectname,
            auditors,
            auditees,
            auditscope,
            auditdate,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Project Details Updated");
      }
      {
        resultid
          ? setTimeout(
              () =>
                navigate(`/projectaudit/${projectid}/${companyid}/${resultid}`),
              500
            )
          : setTimeout(() => navigate(`/directprojectaudit`), 500);
      }
    }
  };

  return (
    <div>
      <Header />
      <h1>Project Governance Audit Plans</h1>
      <div style={{ marginTop: "20px" }}>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "auto",
            padding: "10px",
            maxWidth: "400px",
            alignContent: "center",
          }}
          onSubmit={handleSubmit}
        >
          <br />
          <label htmlFor="projectname">Project Name: </label>
          <select
            style={{ fontFamily: "Poppins" }}
            id="projectname"
            name="projectname"
            value={projectname || ""}
            onChange={handleInputChange}
          >
            <option value="">Select Project Name</option>
            {projectNames.map((project) => (
              <option key={project.id} value={project.projectname}>
                {project.projectname}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="auditors">Auditors: </label>
          <input
            style={{
              fontFamily: "Poppins",
            }}
            type="text"
            id="auditors"
            name="auditors"
            placeholder="Auditors"
            onChange={handleInputChange}
            value={auditors || ""}
          />
          <br />
          <label htmlFor="auditees">Auditees: </label>
          <input
            style={{
              fontFamily: "Poppins",
            }}
            type="text"
            id="auditees"
            name="auditees"
            placeholder="Auditees"
            onChange={handleInputChange}
            value={auditees || ""}
          />
          <br />
          <label htmlFor="auditscope">Audit Scope: </label>
          <input
            style={{
              fontFamily: "Poppins",
            }}
            type="text"
            id="auditscope"
            name="auditscope"
            placeholder="Audit Scope"
            onChange={handleInputChange}
            value={auditscope || ""}
          />
          <br />
          <label htmlFor="auditdate">Audit Date: </label>
          <input
            style={{
              fontFamily: "Poppins",
              margin: "auto",
              padding: "10px",
              maxWidth: "400px",
              alignContent: "center",
            }}
            type="date"
            id="auditdate"
            name="auditdate"
            placeholder=""
            onChange={handleInputChange}
            value={auditdate || ""}
          />
          <br />
          <br />
          <input type="submit" value={auditid ? "Update" : "Save"} />
          <Link to={`/projectaudit/${projectid}/${companyid}`}>
            <button className="btn btn-edit">Go back</button>
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AddEditprojectAudit;
