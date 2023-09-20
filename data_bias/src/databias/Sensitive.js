import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";

function Sensitive() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post(
        "http://localhost:8000/identify_sensitive_columns/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("Error occurred while processing the file. Please try again.");
      setResult(null);
    }
  };

  const renderTable = (data) => {
    return (
      <table className="csv-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Recommendations</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).map((category) => (
            <tr key={category}>
              <td>
                <strong>{category}</strong>
              </td>
              <td>
                {Array.isArray(data[category]) ? (
                  data[category].join(", ")
                ) : (
                  <ul>
                    {Object.keys(data[category]).map((key) => (
                      <li key={key}>
                        <strong>{key}:</strong>{" "}
                        {Array.isArray(data[category][key])
                          ? data[category][key].join(", ")
                          : data[category][key]}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <Header />
      <div>
        <h2>Sensitive Columns Identification</h2>
        <div>
          <label className="file-input-label">Upload CSV File:</label>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </div>
        <div>
          <button onClick={handleFileUpload}>Identify Sensitive Columns</button>
        </div>
        {error && <div className="error">{error}</div>}
        {result && (
          <div className="result">
            <h3>Results:</h3>
            {renderTable(result)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sensitive;
