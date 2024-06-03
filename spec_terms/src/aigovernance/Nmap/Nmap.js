import React, { useState } from "react";
import axios from "axios";
import * as API from "../endpoint";
function Nmap() {
  const [ipAddress, setIpAddress] = useState("");
  const [openPorts, setOpenPorts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API.GET_NMAP_DETAILS, {
        ip: ipAddress,
      });
      setOpenPorts(response.data.openPorts);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Nmap Port Scanner</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter IP Address:
          <input
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        </label>
        <button type="submit">Scan Ports</button>
      </form>
      {openPorts.length > 0 && (
        <div>
          <h2>Open Ports:</h2>
          <ul>
            {openPorts.map((port) => (
              <li key={port}>{port}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Nmap;
