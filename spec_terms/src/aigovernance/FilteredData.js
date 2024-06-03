import React, { useState } from "react";
import * as API from "./endpoint";

function FilteredData() {
  const [organization, setorganization] = useState("");
  const [projectname, setProjectname] = useState("");
  const [responsibilitygroup, setResponsibilitygroup] = useState("");
  const [responsibilitycenter, setResponsibilitycenter] = useState("");
  const [objecttype, setObjecttype] = useState("");
  const [objectcode, setObjectcode] = useState("");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        API.GET_DATA_LINEAGE(
          organization,
          projectname,
          responsibilitygroup,
          responsibilitycenter,
          objecttype,
          objectcode
        )
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="organization">Company Name:</label>
        <input
          type="text"
          id="organization"
          value={organization}
          onChange={(e) => setorganization(e.target.value)}
        />

        <label htmlFor="projectname">Project Name:</label>
        <input
          type="text"
          id="projectname"
          value={projectname}
          onChange={(e) => setProjectname(e.target.value)}
        />

        <label htmlFor="responsibilitygroup">Responsibility Group:</label>
        <input
          type="text"
          id="responsibilitygroup"
          value={responsibilitygroup}
          onChange={(e) => setResponsibilitygroup(e.target.value)}
        />

        <label htmlFor="responsibilitycenter">Responsibility Center:</label>
        <input
          type="text"
          id="responsibilitycenter"
          value={responsibilitycenter}
          onChange={(e) => setResponsibilitycenter(e.target.value)}
        />

        <label htmlFor="objecttype">Object Type:</label>
        <input
          type="text"
          id="objecttype"
          value={objecttype}
          onChange={(e) => setObjecttype(e.target.value)}
        />

        <label htmlFor="objectcode">Object Code:</label>
        <input
          type="text"
          id="objectcode"
          value={objectcode}
          onChange={(e) => setObjectcode(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Project Name</th>
            <th>Responsibility Group</th>
            <th>Responsibility Center</th>
            <th>Object Type</th>
            <th>Object Code</th>
            {/* Add more headers as needed */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.organization}</td>
              <td>{row.projectname}</td>
              <td>{row.responsibilitygroup}</td>
              <td>{row.responsibilitycenter}</td>
              <td>{row.objecttype}</td>
              <td>{row.objectcode}</td>
              {/* Add more cells for other columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilteredData;
