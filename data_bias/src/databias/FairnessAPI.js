import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./Analysis.css"; // Import your CSS file

function FairnessAPI() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8000/calculate_fairness_metrics/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResponse(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="App">
        <h1 className="test-results-header">
          Fairness Matrics Calculation Tool
        </h1>
        <div>
          <label>Upload csv file only : </label>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <br />
          <button onClick={handleUpload}>Upload</button>
        </div>

        {response && (
          <div>
            <h2 className="test-results-header">Result:</h2>
            <table className="csv-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(response).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{JSON.stringify(value, null, 2)}</td>
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

export default FairnessAPI;
