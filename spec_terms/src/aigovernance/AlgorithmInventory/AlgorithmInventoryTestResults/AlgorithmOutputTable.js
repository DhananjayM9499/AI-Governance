import React from "react";
import Modal from "react-modal";
import { CSVLink } from "react-csv";

const AlgorithmOutputTable = ({ isOpen, onClose, data }) => {
  const headers = [
    { label: "File Name", key: "file_name" },
    { label: "Line No", key: "line_no" },
    { label: "Bias Type", key: "bias_type" },
    { label: "Potential Bias", key: "potential_bias" },
    { label: "Algorithm Package Term", key: "algorithm_package_term" },
  ];

  // Ensure data is always an array of objects
  const formattedData = Array.isArray(data) ? data : [];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Algorithm Test Output"
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
      <h1
        style={{ textAlign: "center", marginTop: "2px", marginBottom: "20px" }}
      >
        <label htmlFor="objecttype">Algorithm Bias</label>
      </h1>
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

        <CSVLink
          data={formattedData}
          headers={headers}
          filename="algorithm_bias_report.csv"
          className="btn btn-edit"
        >
          Save as CSV
        </CSVLink>
      </div>
      {formattedData.length > 0 ? (
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
            {formattedData.map((item, index) => (
              <tr key={index}>
                <td>{item.file_name}</td>
                <td>{item.line_no}</td>
                <td>{item.bias_type}</td>
                <td>{item.potential_bias}</td>
                <td>{item.algorithm_package_term}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>No data available</p>
      )}
    </Modal>
  );
};

export default AlgorithmOutputTable;
