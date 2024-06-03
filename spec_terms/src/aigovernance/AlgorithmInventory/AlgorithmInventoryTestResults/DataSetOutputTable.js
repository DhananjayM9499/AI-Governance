import React from "react";
import Modal from "react-modal";
import { CSVLink } from "react-csv";

const DataSetOutputTable = ({ isOpen, onClose, data }) => {
  // Define the headers for the CSV file
  const headers = [
    { label: "Field Name", key: "fieldName" },
    { label: "Bias Analysis", key: "biasAnalysis" },
    { label: "Max Percentage", key: "maxPercentage" },
    { label: "Max Value", key: "maxValue" },
    { label: "Fairness Score", key: "fairnessScore" },
    { label: "Explicit Fairness Formula", key: "explicitFairnessFormula" },
  ];
  //console.log("TBDT", data);
  // Prepare data for CSV
  const csvData = data
    ? Object.keys(data).map((fieldName) => ({
        fieldName,
        biasAnalysis: data[fieldName]?.["Bias Analysis"] ?? "N/A",
        maxPercentage: data[fieldName]?.["Max Percentage"] ?? "N/A",
        maxValue: data[fieldName]?.["Max Value"] ?? "N/A",
        fairnessScore: data[fieldName]?.["Fairness Score"] ?? "N/A",
        explicitFairnessFormula:
          data[fieldName]?.["Explicit Fairness Formula"] ?? "N/A",
      }))
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="DataSet Test Output"
      ariaHideApp={false} // Add this line if you see a warning in the console
    >
      <h2>DataSet Output</h2>
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
        {data && Object.keys(data).length > 0 && (
          <CSVLink
            data={csvData}
            headers={headers}
            filename="Dataset_bias_report.csv"
            className="btn btn-edit"
          >
            Save as CSV
          </CSVLink>
        )}
      </div>
      {data && Object.keys(data).length > 0 ? (
        <table
          className="styled-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Field Name</th>
              <th>Bias Analysis</th>
              <th>Max Percentage</th>
              <th>Max Value</th>
              <th>Fairness Score</th>
              <th>Explicit Fairness Formula</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((fieldName, index) => (
              <tr key={index}>
                <td>{fieldName}</td>
                <td>{data[fieldName]?.["Bias Analysis"] ?? "N/A"}</td>
                <td>{data[fieldName]?.["Max Percentage"] ?? "N/A"}</td>
                <td>{data[fieldName]?.["Max Value"] ?? "N/A"}</td>
                <td>{data[fieldName]?.["Fairness Score"] ?? "N/A"}</td>
                <td>
                  {data[fieldName]?.["Explicit Fairness Formula"] ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data to display</p>
      )}
    </Modal>
  );
};

export default DataSetOutputTable;
