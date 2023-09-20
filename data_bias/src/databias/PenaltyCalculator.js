import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";

function PenaltyCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [numViolations, setNumViolations] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null); // Added error state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Clear previous error, if any
      setError(null);

      const response = await axios.post(
        "http://localhost:8000/calculate_penalty/",
        {
          annual_usd: parseFloat(annualRevenue),
          num_violations: parseInt(numViolations),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      setResults(response.data);
    } catch (error) {
      console.error("Error calculating penalties:", error);
      setError("Error calculating penalties. Please check your inputs."); // Set error message
    }
  };

  return (
    <div>
      <Header />
      <div>
        <h1>Data Privacy Penalty Calculator</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="annualRevenue" className="file-input-label">
            Annual Revenue (USD):
          </label>
          <input
            type="number"
            id="annualRevenue"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
            required
          />
          M $
          <br />
          <br />
          <label htmlFor="numViolations" className="file-input-label">
            Number of Violations:
          </label>
          <input
            type="number"
            id="numViolations"
            value={numViolations}
            onChange={(e) => setNumViolations(e.target.value)}
            required
          />
          <br />
          <br />
          <button type="submit">Calculate Penalty</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {results && (
          <div>
            <h2 className="test-results-header">Results:</h2>
            <p>
              Cumulative Fine Amount (USD):{" "}
              {results["Cumulative Fine Amount (USD)"]}
            </p>
            <table className="csv-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Data Privacy Regulation</th>
                  <th>Penalty</th>
                  <th>Currency</th>
                </tr>
              </thead>
              <tbody>
                {results.Countries.map((countryResult, index) => (
                  <tr key={index}>
                    <td>{countryResult.Country}</td>
                    <td>{countryResult["Data Privacy Regulation"]}</td>
                    <td>{countryResult.Penalty}</td>
                    <td>{countryResult.Currency}</td>
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

export default PenaltyCalculator;
