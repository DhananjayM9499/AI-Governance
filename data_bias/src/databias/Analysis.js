import React, { useState } from "react";
import axios from "axios";
import "./Analysis.css"; // Import CSS for styling
import Header from "./Header";

function Analysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:8000/analyze/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setAnalysisResult(response.data);
      } catch (error) {
        console.error("Error uploading and analyzing CSV:", error);
        setAnalysisResult({ error: "An error occurred during analysis." });
      }
    } else {
      alert("Please select a CSV file to upload.");
    }
  };

  return (
    <div>
      <Header />
      <div>
        <h1>Data Bias Test</h1>
        <label className="file-input-label" htmlFor="fileInput">
          Choose File:
        </label>
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          onChange={handleFileInputChange}
        />
        <button onClick={handleFileUpload}>Upload and Analyze CSV</button>
        {analysisResult && (
          <div>
            <h2 className="test-results-header">Test Results</h2>
            <table className="csv-table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Bias Analysis</th>
                  <th>Max Percentage</th>
                  <th>Max Value</th>
                  <th>Fairness Score</th>
                  <th>Classification Ranges</th>{" "}
                  {/* Display Classification Ranges */}
                </tr>
              </thead>
              <tbody>
                {Object.keys(analysisResult).map((column) => (
                  <tr key={column}>
                    <td>{column}</td>
                    <td>{analysisResult[column]["Bias Analysis"]}</td>
                    <td>{analysisResult[column]["Max Percentage"]}</td>
                    <td>{analysisResult[column]["Max Value"]}</td>
                    <td>{analysisResult[column]["Fairness Score"]}</td>
                    <td>
                      {JSON.stringify(
                        analysisResult[column]["Classification Ranges"]
                      )}
                    </td>{" "}
                    {/* Display Classification Ranges */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analysis;
