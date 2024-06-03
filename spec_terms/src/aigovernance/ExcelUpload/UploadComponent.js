// UploadComponent.jsx
import React, { useState } from "react";
import axios from "axios";
import "../governancecontrol/ExcelUploaderPopup.css";

const UploadComponent = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post("http://localhost:5011/uploadtheme", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <input type="file" onChange={handleFileChange} />
        <button className="btn btn-add" onClick={handleUpload}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadComponent;
