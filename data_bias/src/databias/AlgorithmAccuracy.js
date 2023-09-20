import React, { useState } from "react";
import Header from "./Header";
function AlgorithmAccuracy() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAnalysisStarted(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/analyze_accuracy/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header /> {/* Include the Header component */}
      <div>
        <h1>Algorithm Accuracy Analysis Tool</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Upload a File to Test Accuracy :
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
          </label>
          <br />
          <br />
          <button type="submit" disabled={!file || loading}>
            Analyze
          </button>
        </form>

        {analysisStarted && (
          <div>
            <h2>Analysis Results:</h2>
            {loading ? (
              <p>Analyzing...</p>
            ) : results && results.length > 0 ? (
              <table className="csv-table">
                <thead>
                  <tr>
                    <th>Algorithm Name</th>
                    <th>Dataset</th>
                    <th>Variable</th>
                    <th>Accuracy</th>
                    <th>Reliability</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, index) =>
                    item.Results.map((resultItem, resultIndex) => (
                      <tr key={index + "-" + resultIndex}>
                        <td>{item["Algorithm Name"]}</td>
                        <td>{item.Dataset}</td>
                        <td>{resultItem.Variable}</td>
                        <td>{resultItem.Accuracy}</td>
                        <td>{resultItem.Reliability}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <p>No results to display.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlgorithmAccuracy;
