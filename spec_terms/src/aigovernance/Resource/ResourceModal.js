import React, { useState, useEffect } from "react";
import axios from "axios";
import * as API from "../endpoint";
import { useParams } from "react-router-dom";

const ResourceModal = ({ isOpen, onClose }) => {
  const [resources, setResources] = useState([]);
  // Add state to track selected resources
  const [selectedResources, setSelectedResources] = useState([]);
  const { projectid } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resourceData = await axios.get(API.GET_RESOURCE_API);
        setResources(resourceData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (e) => {
    const resourceName = e.target.value;
    if (e.target.checked) {
      setSelectedResources([...selectedResources, resourceName]);
    } else {
      setSelectedResources(
        selectedResources.filter((resource) => resource !== resourceName)
      );
    }
  };

  const handleAllocateClick = async () => {
    try {
      // Assuming you have an API endpoint for adding resource allocation
      const addAllocationResponse = await axios.post(
        API.ALLOCATE_RESOURCE_API,
        {
          projectid: projectid, // Assuming projectId is available in the scope
          resourceid: selectedResources.map((resource) => resource.id),
        }
      );

      console.log("Add allocation response:", addAllocationResponse.data);

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error adding allocation:", error);
    }
  };

  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Resource Allocation</h2>
        <table className="styled-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.resourcename}</td>
                <td>{resource.designation}</td>
                <td>{resource.status}</td>
                <td>
                  <input
                    type="checkbox"
                    value={resource.resourcename}
                    onChange={handleCheckboxChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAllocateClick}>Allocate</button>
      </div>
    </div>
  );
};

export default ResourceModal;
