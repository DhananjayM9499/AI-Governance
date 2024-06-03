import React, { useState, useEffect } from "react";
import axios from "axios";
import FishboneChart from "../fishbone/index";
import Header from "../pages/header";
import Footer from "../pages/footer";
import * as API from "../endpoint";
import { useParams, Link } from "react-router-dom";

const FishBone = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status
  const { algorithminventoryid } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          API.GET_AIISSUE_API(algorithminventoryid)
        );
        const formattedData = convertToDesiredFormat(response.data);
        setData(formattedData);

        if (algorithminventoryid) {
          const resp = await axios.get(
            API.GET_ALGORITHMINVENTORY_BYID(algorithminventoryid)
          );
          setFormData({ ...resp.data[0] });
        }

        setLoading(false); // Data loading completed, set loading to false
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false); // In case of error, still set loading to false
      }
    };

    fetchData();
  }, [algorithminventoryid]);

  // Function to convert tableData into the desired format
  const convertToDesiredFormat = (responseData) => {
    const result = {};

    responseData.forEach((entry) => {
      const {
        processissue,
        codingissue,
        resourceissue,
        infrastructureissue,
        modelissue,
        performanceissue,
        securityissue,
        dataissue,
        issuename,
      } = entry;

      const topic = issuename || "Unknown Topic";

      const categories = [
        { name: "Process Issue", value: processissue },
        { name: "Coding Issue", value: codingissue },
        { name: "Resource Issue", value: resourceissue },
        { name: "Infrastructure Issue", value: infrastructureissue },
        { name: "Model Issue", value: modelissue },
        { name: "Performance Issue", value: performanceissue },
        { name: "Security Issue", value: securityissue },
        { name: "Data Issue", value: dataissue },
      ];

      if (!result[topic]) {
        result[topic] = {};
      }

      categories.forEach((category) => {
        const categoryName = category.name.trim();
        const categoryValue = category.value;

        if (categoryValue != null && categoryValue.trim() !== "") {
          if (!result[topic][categoryName]) {
            result[topic][categoryName] = [];
          }
          result[topic][categoryName].push(`• ${categoryValue}`);
        }
      });
    });

    return result;
  };

  if (loading) {
    // Display loading indicator while data is being fetched
    return <div>Loading...</div>;
  }
  console.log(data);
  return (
    <div>
      <Header />
      <div>
        <div>
          <hr></hr>
          <h1>Ishikawa Diagram</h1>
          <div
            style={{
              border: "3px solid #ccc",
              padding: "5px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr ",
                gap: "40px",
              }}
            >
              <div>
                {" "}
                <p>
                  <strong>Organization : </strong> {formData.organization}
                </p>
              </div>
              <div>
                <p>
                  <strong>Responsibility Center : </strong>{" "}
                  {formData.responsibilitycenter}
                </p>
              </div>
              <div>
                <p>
                  <strong>Responsibility Group : </strong>{" "}
                  {formData.responsibilitygroup}
                </p>
              </div>
              <div>
                <p>
                  <strong>Object Type : </strong> {formData.objecttype}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr ",
                gap: "40px",
              }}
            >
              <div>
                {" "}
                <p>
                  <strong>Object : </strong> {formData.object}
                </p>
              </div>
              <div>
                <p>
                  <strong>Project : </strong>
                  {formData.projectname}
                </p>
              </div>
              <div>
                <p>
                  <strong>Project Code : </strong>
                  {formData.projectcode}
                </p>
              </div>
              <div>
                <p>
                  <strong>Code Name : </strong>
                  {formData.codename}
                </p>
              </div>
            </div>

            {/* Vertical partition */}
            <div
              style={{
                width: "10px",
                background: "#ccc",
                alignContent: "end",
              }}
            ></div>
          </div>
        </div>
        <div
          style={{
            marginTop: "2cm",
            marginLeft: "2cm",
            maxWidth: "90%",
          }}
        >
          <FishboneChart
            data={data}
            algorithminventoryid={algorithminventoryid}
          />
        </div>
        <div style={{ marginTop: "2cm", marginBottom: "3cm" }}>
          <Link to={`/algorithminventory`}>
            <button className="btn btn-edit">Go Back</button>{" "}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FishBone;
