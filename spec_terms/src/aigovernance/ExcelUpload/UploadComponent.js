// UploadComponent.jsx
import React, { useState } from "react";
import axios from "axios";
import "../governancecontrol/ExcelUploaderPopup.css";
import * as API from "../endpoint";
import sampleFile from "./themeactivitysample.csv"; // Import the sample Excel file

const UploadComponent = ({ onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(API.UPLOAD_THEME_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully!");
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownloadSample = () => {
    // Create a link element, set its href to the imported sample file URL, and trigger a click to download
    const link = document.createElement("a");
    link.href = sampleFile;
    link.download = "sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h1>Theme Activity Upload</h1>
        <input type="file" onChange={handleFileChange} />
        <button className="btn btn-add" onClick={handleUpload}>
          Upload
        </button>
        <button className="btn btn-close" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-download" onClick={handleDownloadSample}>
          Download Sample
        </button>
      </div>
    </div>
  );
};

export default UploadComponent;
