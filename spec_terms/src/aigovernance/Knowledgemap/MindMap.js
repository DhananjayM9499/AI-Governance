import React, { useState } from "react";
import Tree from "react-d3-tree";
import Header from "../pages/header";
import Footer from "../pages/footer";




const transformData = (gdprData) => {
    // Initialize categories object with empty arrays
    const categories = gdprData.reduce(
      (acc, item) => {
        // Determine category based on status
        const status = item["status"];
  
        if (status === "Pass") {
          acc.strength.push(item);
        } else if (status === "Fail") {
          acc.opportunities.push(item);
        }
  
        return acc;
      },
      { strength: [], opportunities: [] }
    );
  
    return {
      name: "EU GDPR Compliance Knowledge Map",
      children: [
        {
          name: "Strength",
          children: categories.strength.map((item) => ({
            name: extractNumber(item["article_no"]), // Displaying terms
            articleNo: item["article_no"], // Displaying article number
            file: item["file_name"], // Displaying file name
          })),
        },
        {
          name: "Opportunities",
          children: categories.opportunities.map((item) => ({
            name:  extractNumber(item["article_no"]), // Displaying terms
            articleNo: item["article_no"], // Displaying article number
            file: item["file_name"], // Displaying file name
            // attributes: {
            //     Terms: item.Terms,
            //     Data: item.Data,}
          })),
        },
      ],
    };
  };
  
  // Function to extract article number from the full URL
  const extractNumber = (url) => {
    if (!url) return ""; // Handle case where URL is empty or undefined
    const articleMatch = url.match(/\/art-(\d+)/); // Regex to match article number
    const recitalMatch = url.match(/\/recitals\/no-(\d+)/); // Regex to match recital number
  
    if (articleMatch) {
      return `GDPR Article ${articleMatch[1]}`; // Extracted article number
    } else if (recitalMatch) {
      return `GDPR Recital ${recitalMatch[1]}`; // Extracted recital number
    } else {
      return ""; // Return empty string if neither match
    }
  };
  
  // Function to detect type (Article or Recital)
  const detectType = (url) => {
    if (!url) return ""; // Handle case where URL is empty or undefined
    if (url.includes("/art-")) {
      return "Article";
    } else if (url.includes("/recitals/no-")) {
      return "Recital";
    } else {
      return ""; // Return empty string if neither type detected
    }
  };
  

const MindMap = () => {
  //const [gdprData, setGdprData] = useState(gdprData);

  const gdprData = [
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-6-gdpr/$GDPR Article 6",
      "terms": "Lawful processing, data processed, legally",
      "status": "Pass",
      "data": [
        "provide your personal information in response to a search warrant to other legally valid inquiry or ",
        "We only keep your personal  information as long as it is operationally or legally necessary. After "
      ]
    },
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-12-gdpr/$GDPR Article 12-14",
      "terms": "Transparency, clear information, data processing",
      "status": "Fail",
      "data": []
    },
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/recitals/no-83/$GDPR Recital 83",
      "terms": "Encryption, sensitive information, Regular security assessments, penetration testing",
      "status": "Fail",
      "data": []
    },
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-7-gdpr/$GDPR Article 7(3)",
      "terms": "Ability, withdraw, remove consent, any time",
      "status": "Pass",
      "data": [
        "withdraw your consent at any time. However, in some cases, withdrawing consent will mean that ",
        "over such websites, and therefore we have no responsibility or liability for the manner in which the ",
        "can unsubscribe at any time by clicking the “unsubscribe” link included at the bottom of each ",
        "withdraw your consent at any time. However, in some cases, withdrawing consent will mean that "
      ]
    },
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-32-gdpr/$GDPR Article 32",
      "terms": "Security measures, Encrypted data, protect personal data",
      "status": "Fail",
      "data": []
    },
   
   
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-9-gdpr/$GDPR Article 9",
      "terms": "Secure photo, video sharing mechanisms",
      "status": "Fail",
      "data": []
    },
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/recitals/no-30/$GDPR Recital 30",
      "terms": "Clear, transparent cookie policies",
      "status": "Fail",
      "data": []
    },
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-5-gdpr/$GDPR Article 5(2)",
      "terms": "Accountability, implementing measures, compliance",
      "status": "Pass",
      "data": [
        "made available) to our affiliates and business partners to meet our legal and compliance ",
        "Legal and Compliance: We and our Canadian, U.S., and other foreign service providers may "
      ]
    },
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-8-gdpr/$GDPR Article 8",
      "terms": "Respecting individual liberty, autonomy",
      "status": "Fail",
      "data": []
    },
  
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/art-16-gdpr/$GDPR Article 16-17",
      "terms": "Right, rectify, erase, delete personal data",
      "status": "Pass",
      "data": [
        "Services are right for your organization and the intended purposes, and to customize your user ",
        "Subject to applicable law and your location, you may have the right to access, update or correct , ",
        "on your consent as a lawful basis to process your personal information, you have the right to ",
        "Data subject requests, including what data subject rights you may be entitled to, with respect to "
      ]
    },
    
    
    {
      "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_26/18_46_35//Cohere DPP.pdf",
      "article_no": "https://gdpr-info.eu/recitals/no-32/$GDPR Recital 32",
      "terms": "Mechanism, obtaining, managing cookie consent",
      "status": "Pass",
      "data": [
        "above, including by providing and obtaining all necessary notices and consents. Information we "
      ]
    },]
  const [treeData, setTreeData] = useState(transformData(gdprData));
  const handleDataUpload = (jsonData) => {
    // setGdprData(jsonData);
    setTreeData(transformData(jsonData));
  };

  const treeProps = {
    data: treeData,
    orientation: "horizontal",
    translate: { x: 50, y: 50 },
  };

  return (
    <div>
      <Header />
      <h1>Data Privacy Compliance Test</h1>
      {/* <FileUploadComponent onDataUpload={handleDataUpload} /> */}
      <div style={{ width: "100%", height: "calc(100vh - 100px)" }}>
        <Tree {...treeProps} />
      </div>
      <Footer />
    </div>
  );
};

export default MindMap;

