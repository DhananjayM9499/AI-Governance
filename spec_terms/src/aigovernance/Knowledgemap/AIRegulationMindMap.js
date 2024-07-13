import React, { useState } from "react";
import Tree from "react-d3-tree";
import Header from "../pages/header";
import Footer from "../pages/footer";

const transformData = (gdprData) => {
    const categories = gdprData.reduce(
      (acc, item) => {
        const status = item["status"].trim().toLowerCase(); // Trim and convert to lowercase for consistency
  
        if (status === "pass") {
          acc.strength.push(item);
        } else if (status === "fail") {
          acc.opportunities.push(item);
        }
  
        return acc;
      },
      { strength: [], opportunities: [] }
    );
  
    return {
      name: "EU GDPR Compliance Knowledge Map",
      children: [
        {
          name: "Strength",
          children: categories.strength.map((item) => ({
            name: item["checklist_points"],
          })),
        },
        {
          name: "Opportunities",
          children: categories.opportunities.map((item) => ({
            name: item["checklist_points"],
          })),
        },
      ],
    };
  };


  

const AIRegulationMindMap = () => {
  //const [gdprData, setGdprData] = useState(gdprData);

  const gdprData = [
   
    
    
    {
        "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_28/05_28_52//Cohere DPP.pdf",
        "checklist_points": "Regular Internal Audits and Review",
        "terms": "Regular, Internal, Audits, Review",
        "description": "",
        "status": "Fail",
        "data": [
            "collect, use, retain or store non-personal customer data, please review our Data Usage Policy. ",
            "customers, we encourage you to first contact the customer directly and/or review their applicable ",
            "encourage you to periodically review this page to ensure that you are familiar with those changes. "
        ]
    },
    {
        "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_28/05_28_52//Cohere DPP.pdf",
        "checklist_points": "Secure Data Storage and Encryption",
        "terms": "Secure, Data, Storage, Encryption",
        "description": "",
        "status": "Pass",
        "data": [
            "collect, use, retain or store non-personal customer data, please review our Data Usage Policy. ",
            "services, such as cloud computing, data storage, publishing, and analytics. Our service providers ",
            "technologies (which we collectively refer to as \"cookies\"). A cookie is a tiny element of data that ",
            "search terms, and other engagement data) in order to evaluate, derive insights from, and improve ",
            "information about Google Analytics or to prevent the storage and processing of this data (including ",
            "information on Google Analytics’ data privacy and security at the following links: ",
            "Data subject requests, including what data subject rights you may be entitled to, with respect to ",
            "service providers treat your personal information, or to make data subject requests , please ",
            "services, such as cloud computing, data storage, publishing, and analytics. Our service providers ",
            "information about Google Analytics or to prevent the storage and processing of this data (including ",
            "organizations that operate such linked websites may collect, use or disclose, secure and otherwise "
        ]
    },
   
    {
        "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_28/05_28_52//Cohere DPP.pdf",
        "checklist_points": "Governance Framework and Oversight",
        "terms": "Governance, Framework, Oversight",
        "description": "",
        "status": "Fail",
        "data": []
    },
    
   
   
    {
        "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_28/05_28_52//Cohere DPP.pdf",
        "checklist_points": "Regular Security Audits and Updates",
        "terms": "Regular, Security, Audits, Updates",
        "description": "",
        "status": "Pass",
        "data": [
            "information on Google Analytics’ data privacy and security at the following links: "
        ]
    },
    {
        "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_28/05_28_52//Cohere DPP.pdf",
        "checklist_points": "Data Minimization and Purpose Limitation",
        "terms": "Data, Minimization, Purpose, Limitation",
        "description": "",
        "status": "Pass",
        "data": [
            "collect, use, retain or store non-personal customer data, please review our Data Usage Policy. ",
            "services, such as cloud computing, data storage, publishing, and analytics. Our service providers ",
            "technologies (which we collectively refer to as \"cookies\"). A cookie is a tiny element of data that ",
            "search terms, and other engagement data) in order to evaluate, derive insights from, and improve ",
            "information about Google Analytics or to prevent the storage and processing of this data (including ",
            "information on Google Analytics’ data privacy and security at the following links: ",
            "Data subject requests, including what data subject rights you may be entitled to, with respect to ",
            "service providers treat your personal information, or to make data subject requests , please ",
            "collecting, using, or disclosing personal information through the Services for the purposes set out ",
            "understand the purposes for which you are seeking to use the Services, to assess whether the ",
            "Services are right for your organization and the intended purposes, and to customize your user ",
            "related materials). We use this information for the purpose of processing, evaluating, and ",
            "as references you list, for the same purpose. ",
            "order, or to another organization for the purposes of investigating a breach of an agreement or ",
            "information set out below. We may request certain personal information for the purpose of "
        ]
    },
    {
        "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_28/05_28_52//Cohere DPP.pdf",
        "checklist_points": "Transparency in Decision-Making",
        "terms": "Transparency, Decision-Making",
        "description": "",
        "status": "Fail",
        "data": []
    },
    {
        "file_name": "/opt/ai-legislation/home/AI/GDPR/INPUT/2024_06_28/05_28_52//Cohere DPP.pdf",
        "checklist_points": "External Audits and Third-Party Assessments",
        "terms": "External, Audits, Third-Party, Assessments",
        "description": "",
        "status": "Pass",
        "data": [
            "features. We also use third-party tools that use cookies and other technologies to collect ",
            "operate. We provide links to third-party websites as a convenience to the user. These links are not "
        ]
    },]
    const [treeData, setTreeData] = useState(transformData(gdprData));

    const handleDataUpload = (jsonData) => {
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
        <h1>AI Regulation Compliance Test</h1>
        {/* <FileUploadComponent onDataUpload={handleDataUpload} /> */}
        <div style={{ width: "100%", height: "calc(100vh - 100px)" }}>
          <Tree {...treeProps} />
        </div>
        <Footer />
      </div>
    );
  };
  
  export default AIRegulationMindMap;

