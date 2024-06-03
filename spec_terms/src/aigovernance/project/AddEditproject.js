import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import * as API from "../endpoint";
import Header from "../pages/header";
import Footer from "../pages/footer";
const initialState = {
  projectname: "",
  responsibilitygroup: "",
  responsibilitycenter: "",
  fromdate: "",
  todate: "",
  projecttype: "",
  resourcename: "",
  designation: "",
};
const AddEditproject = () => {
  const [state, setState] = useState(initialState);
  const [respGroup, setRespGroup] = useState([]);
  const [respCenter, setRespCenter] = useState([]);
  const [resource, setResource] = useState([]);
  const {
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    fromdate,
    todate,
    projecttype,
    resourcename,
    designation,
  } = state;

  const navigate = useNavigate();

  const { projectid, companyid } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const respGroupData = await axios.get(API.GET_RESPONSIBILITY_GROUP);
        setRespGroup(respGroupData.data);

        const respCenterData = await axios.get(API.GET_RESPONSIBILITY_CENTER);
        setRespCenter(respCenterData.data);

        const resourceData = await axios.get(API.GET_RESOURCE_API);
        setResource(resourceData.data);
        if (projectid && companyid) {
          const projectData = await axios.get(
            API.GET_COMPANY_PROJECT(projectid, companyid)
          );
          setState({ ...projectData.data[0] });
        } else {
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors appropriately, e.g., set an error state or show a message to the user
      }
    };

    fetchData();
  }, [projectid, companyid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectname || !fromdate || !todate) {
      toast.error("please provide the Input");
    } else {
      if (!projectid) {
        axios
          .post(API.ADD_PROJECT_API(companyid), {
            projectname,
            responsibilitygroup,
            responsibilitycenter,
            fromdate,
            todate,
            projecttype,
            resourcename,
            designation,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Project Added");
      } else {
        axios
          .put(API.UPDATE_COMPANY_PROJECT(projectid, companyid), {
            projectname,
            responsibilitygroup,
            responsibilitycenter,
            fromdate,
            todate,
            projecttype,
            resourcename,
            designation,
          })
          .then(() => {
            setState(initialState);
          })
          .catch((err) => toast.error(err.response.data));
        toast.success("Project Details Updated");
      }
      setTimeout(() => navigate(`/project/${companyid}`), 500);
    }
  };

  return (
    <div style={{ fontFamily: "Poppins" }}>
      <Header />
      <h1>Project Description</h1>
      <div style={{ marginTop: "5px", marginBottom: "3cm" }}>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "auto",
            padding: "5px",
            maxWidth: "400px",
            alignContent: "center",
          }}
          onSubmit={handleSubmit}
        >
          <label htmlFor="projectname">Project Name</label>
          <input
            style={{
              fontFamily: "Poppins",
            }}
            type="text"
            id="projectname"
            name="projectname"
            placeholder=""
            onChange={handleInputChange}
            value={projectname || ""}
          />
          <label> Responsibilty group:</label>
          <select
            style={{ fontFamily: "Poppins" }}
            id="responsibilitygroup"
            name="responsibilitygroup"
            value={responsibilitygroup || ""}
            onChange={handleInputChange}
          >
            <option value="">Responsibilty Group</option>
            {respGroup.map((respgroup) => (
              <option
                key={respgroup.responsibilityid}
                value={respgroup.responsibilitytype}
              >
                {respgroup.responsibilitytype}
              </option>
            ))}
          </select>
          <label> Responsibilty Center:</label>
          <select
            style={{ fontFamily: "Poppins" }}
            id="responsibilitycenter"
            name="responsibilitycenter"
            value={responsibilitycenter || ""}
            onChange={handleInputChange}
          >
            <option value="">Responsibilty Center</option>
            {respCenter.map((respcenter) => (
              <option
                key={respcenter.responsibilitynameid}
                value={respcenter.responsibilitytype}
              >
                {respcenter.responsibilitytype}
              </option>
            ))}
          </select>
          <label htmlFor="fromdate">From Date : </label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            style={{
              fontfamily: "Poppins",
              fontSize: "20px",
              margin: "6px",
              width: "200px",
              height: "40px",
            }}
            type="date"
            id="fromdate"
            name="fromdate"
            placeholder=""
            onChange={handleInputChange}
            value={fromdate || ""}
          />
          <br />
          <br />
          &nbsp;&nbsp; &nbsp;<label htmlFor="todate">To Date : </label>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <input
            style={{
              fontfamily: "Poppins",
              fontSize: "20px",
              margin: "6px",
              width: "200px",
              height: "40px",
            }}
            type="date"
            id="todate"
            name="todate"
            placeholder=""
            onChange={handleInputChange}
            value={todate || ""}
          />
          <br />
          <br />
          <div>
            <label>Project Type : </label>
            <select
              style={{ fontFamily: "Poppins" }}
              id="projecttype"
              name="projecttype"
              value={projecttype || ""}
              onChange={handleInputChange}
            >
              <option value="">Select Project Type</option>
              <option value="Service">Service</option>
              <option value="Project ">Project</option>
            </select>
          </div>
          <br />
          <br />
          <input type="submit" value={projectid ? "Update" : "Save"} />
          <Link to={`/project/${companyid}`}>
            <div className="btn btn-edit">GO Back</div>
          </Link>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddEditproject;
