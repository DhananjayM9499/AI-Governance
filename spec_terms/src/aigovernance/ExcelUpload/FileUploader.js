import React, { useState } from "react";
import axios from "axios";
import "../governancecontrol/ExcelUploaderPopup.css";
import * as API from "../endpoint";
import sampleFile from "./sample.csv"; // Import the sample Excel file

const FileUploader = ({ onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(API.UPLOAD_CONTROL_API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully!");
      onClose(); // Close the popup after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
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
        <h1>Governance file upload</h1>
        <input type="file" onChange={handleFileChange} />
        <button className="btn btn-add" onClick={handleSubmit}>
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

export default FileUploader;
