import React from "react";
import Modal from "react-modal";
import { CSVLink } from "react-csv";

const CodeVulnerabilityOutput = ({ isOpen, onClose, data }) => {
  // Define headers for the CSV file
  const headers = [
    { label: "File Name", key: "file_name" },
    { label: "Line No", key: "line_no" },
    { label: "Bias Type", key: "bias_type" },
    { label: "Potential Bias", key: "potential_bias" },
    { label: "Algorithm Package Term", key: "algorithm_package_term" },
  ];

  // Ensure data is an array of objects or an empty array
  const csvData = Array.isArray(data) ? data : [];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Code Vulnerability"
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "80%",
          maxHeight: "80%",
          overflow: "auto",
          padding: "20px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
      }}
    >
      <h2 style={{ textAlign: "center", margin: "10px 0 20px" }}>
        Code Vulnerability
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <button className="btn btn-edit" onClick={onClose}>
          Close
        </button>
        {csvData.length > 0 && (
          <CSVLink
            data={csvData}
            headers={headers}
            filename="code_vulnerability_report.csv"
            className="btn btn-edit"
          >
            Save as CSV
          </CSVLink>
        )}
      </div>
      {csvData.length > 0 ? (
        <table
          className="styled-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>File Name</th>
              <th>Line No</th>
              <th>Bias Type</th>
              <th>Potential Bias</th>
              <th>Algorithm Package Term</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((item, index) => (
              <tr key={index}>
                <td>{item.file_name || "N/A"}</td>
                <td>{item.line_no || "N/A"}</td>
                <td>{item.bias_type || "N/A"}</td>
                <td>{item.potential_bias || "N/A"}</td>
                <td>{item.algorithm_package_term || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No Vulnerabilities Found</p>
      )}
    </Modal>
  );
};

export default CodeVulnerabilityOutput;
