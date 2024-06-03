import React from "react";
import Modal from "react-modal";
import { CSVLink } from "react-csv";

const PrivacyDataOutput = ({ isOpen, onClose, data }) => {
  // Define headers for the CSV file
  const headers = [
    { label: "Category", key: "category" },
    { label: "Item", key: "item" },
    { label: "Detail", key: "detail" },
  ];

  // Prepare data for CSV
  const csvData = [];
  if (data && typeof data === "object") {
    Object.entries(data).forEach(([category, items]) => {
      if (category !== "Recommendations") {
        if (Array.isArray(items)) {
          items.forEach((item) => {
            csvData.push({ category, item, detail: "" });
          });
        }
      } else {
        if (typeof items === "object") {
          Object.entries(items).forEach(([item, detail]) => {
            csvData.push({ category, item, detail });
          });
        }
      }
    });
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Privacy Data Output"
      ariaHideApp={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "80%",
          maxHeight: "80%",
          overflow: "auto",
          padding: "20px",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
      }}
    >
      <h2
        style={{ textAlign: "center", marginTop: "10px", marginBottom: "20px" }}
      >
        Data Privacy Analysis
      </h2>
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
        {csvData.length > 0 && (
          <CSVLink
            data={csvData}
            headers={headers}
            filename="privacy_data_analysis.csv"
            className="btn btn-edit"
          >
            Save as CSV
          </CSVLink>
        )}
      </div>
      {data ? (
        <div>
          {Object.entries(data).map(([category, items], index) => (
            <div key={index}>
              <h2>{category}</h2>
              {category !== "Recommendations" ? (
                <ul>
                  {Array.isArray(items) ? (
                    items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item || "N/A"}</li>
                    ))
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              ) : (
                <ul>
                  {typeof items === "object" ? (
                    Object.entries(items).map(
                      ([item, recommendation], recIndex) => (
                        <li key={recIndex}>
                          <strong>{item || "N/A"}:</strong>{" "}
                          {recommendation || "N/A"}
                        </li>
                      )
                    )
                  ) : (
                    <li>N/A</li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No Data Available</p>
      )}
    </Modal>
  );
};

export default PrivacyDataOutput;
