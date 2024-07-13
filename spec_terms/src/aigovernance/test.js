// import React, { useState, useEffect } from "react";
// import {
//   TbBorderCorners,
//   TbArrowsMinimize,
//   TbChevronsDown,
// } from "react-icons/tb";
// import { SiGooglemessages } from "react-icons/si";
// import { GoSync } from "react-icons/go";
// import axios from "axios";

// function Test() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [popupSize, setPopupSize] = useState({
//     width: "400px",
//     height: "700px",
//   });
//   const [messages, setMessages] = useState([
//     {
//       text: "Hi, I am here to help you. How can I assist you today?",
//       sender: "bot",
//     },
//   ]);
//   const [showresearchdescription, setShowresearchdescription] = useState(false);
//   const [researchdescription, setresearchdescription] = useState(null);
//   const [description, setDescription] = useState("");
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [researchTitleResponse, setResearchTitleResponse] = useState("");

//   useEffect(() => {
//     // Scroll to the bottom of the message container when messages change
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     const messageContainer = document.getElementById("message-container");
//     if (messageContainer) {
//       messageContainer.scrollTop = messageContainer.scrollHeight;
//     }
//   };

//   const togglePopup = () => {
//     setShowPopup(!showPopup);
//     setIsFullScreen(false);
//   };

//   const resizePopup = () => {
//     if (!isFullScreen) {
//       if (popupSize.width === "400px") {
//         setPopupSize({ width: "800px", height: "700px" });
//       } else {
//         setPopupSize({ width: "400px", height: "700px" });
//       }
//     }
//   };

//   const toggleFullScreen = () => {
//     if (!isFullScreen) {
//       setPopupSize({ width: "100%", height: "100%" });
//     } else {
//       setPopupSize({ width: "400px", height: "700px" });
//     }
//     setIsFullScreen(!isFullScreen);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setIsFullScreen(false);
//   };

//   const handleRefresh = () => {
//     // Reset the chatbot state
//     setMessages([
//       {
//         text: "Hi, I am here to help you. How can I assist you today?",
//         sender: "bot",
//       },
//     ]);
//     setShowresearchdescription(false);
//     setresearchdescription("");
//     setResearchTitleResponse("");
//     setDescription("");
//   };

//   const handleResearchTitleClick = () => {
//     setPrompt(`Give me atleast 5 research titles for ${description}`);
//     quantile(prompt);
//     console.log("Handling click for Research Title");
//   };

//   const handleResearchObjectivesClick = () => {
//     setPrompt(
//       `Give me 5 research objectives for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Research Objectives");
//   };

//   const handleIntroductionClick = () => {
//     setPrompt(
//       `Give me 5 Introduction for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Introduction");
//   };

//   const handleAbstractionClick = () => {
//     setPrompt(
//       `Give me 5 Abstraction for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Abstraction");
//   };

//   const handleBibliographyClick = () => {
//     setPrompt(
//       `Give me 5 bibiliography for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Bibliography");
//   };

//   const handleMethodologyClick = () => {
//     setPrompt(
//       `Give me 5 research mothodology for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Methodology");
//   };

//   const handleHypothesisClick = () => {
//     setPrompt(
//       `Give me 5 research hypothesis for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Hypothesis");
//   };

//   const handleQuestionaryonClick = () => {
//     setPrompt(
//       `Give me likert scale Questionnarie for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Questionaryon");
//   };

//   const handledatasetClick = () => {
//     setPrompt(
//       `Give me sample datasets for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for dataset");
//   };

//   const handlestatisticalClick = () => {
//     setPrompt(
//       `Give me statistical tests for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for statistical");
//   };

//   const handleInferencesClick = () => {
//     setPrompt(
//       `Give me inferences for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Inferences");
//   };

//   const handleConclusionClick = () => {
//     setPrompt(
//       `Give me conclusion for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for Conclusion");
//   };

//   const handleIEEEClick = () => {
//     setPrompt(
//       `Give me IEEE format paper for the following description ${description}`
//     );
//     quantile(prompt);
//     console.log("Handling click for IEEE");
//   };

//   const quantile = async (prompt) => {
//     const url = `https://quantileapibeta.online/call_cascading?prompt=${encodeURIComponent(
//       prompt
//     )}&max_tokens=500`;
//     const apiKey = "quant-3rzCLlkmjyamQWB4oW1jF";

//     try {
//       const response = await fetch(url, {
//         method: "GET",
//         headers: {
//           accept: "application/json",
//           "quant-api-key": apiKey,
          
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();
//       setResearchTitleResponse(data.content?.[0]?.text);
//       console.log("Data from API:", data);

//       // Add further processing or state updates based on the fetched data
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       // Handle errors gracefully, e.g., display an error message to the user
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-end items-end h-screen p-4">
//         {!showPopup && (
//           <button
//             onClick={togglePopup}
//             className="bg-[orange] hover:bg-[orange] text-white hover:text-[black] font-[30px] py-2 px-4 rounded"
//           >
//             <SiGooglemessages />
//           </button>
//         )}
//         <div>
//           {showPopup && (
//             <div
//               className={`fixed top-0 right-0 rounded-[10px] shadow-md border-2 border-black`}
//               style={{
//                 width: popupSize.width,
//                 height: popupSize.height,
//                 backgroundColor: "white",
//                 overflow: "auto",
//               }}
//             >
//               <div className="flex justify-between items-center p-4 rounded-[10px] bg-blue-800 text-white">
//                 <div>
//                   <h2 className="text-lg font-bold">Virtual CHATBOT</h2>
//                 </div>
//                 <div className="flex space-x-10">
//                   <button onClick={resizePopup}>
//                     {/* <TbBorderCorners /> */}
//                   </button>
//                   <button onClick={toggleFullScreen}>
//                     {isFullScreen ? <TbArrowsMinimize /> : <TbBorderCorners />}
//                   </button>
//                   <button onClick={closePopup} className="font-bold rounded">
//                     <TbChevronsDown />
//                   </button>
//                 </div>
//                 <div
//                   className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 h-7 px-2 py-2"
//                   onClick={handleRefresh}
//                 >
//                   <GoSync />
//                 </div>
//               </div>

//               <div
//                 id="message-container"
//                 className="overflow-y-auto max-h-[600px]"
//               >
//                 {messages.map((message, index) => (
//                   <div
//                     key={index}
//                     className={`text-${
//                       message.sender === "bot" ? "left" : "right"
//                     } py-1 px-2 m-2 bg-gray-200 rounded-md inline-block`}
//                   >
//                     {message.text}
//                   </div>
//                 ))}
//               </div>

//               <div className="p-4">
//                 <label
//                   htmlFor="researchdescription"
//                   className="block font-bold mb-2"
//                 >
//                   Research Description
//                 </label>
//                 <textarea
//                   id="researchdescription"
//                   className="w-full h-32 p-2 border border-gray-300 rounded-md"
//                   placeholder="Type your message..."
//                   onChange={(e) => setDescription(e.target.value)}
//                   value={description}
//                   name="researchdescription"
//                   type="text"
//                 />

//                 <div className="mt-4 space-y-2">
//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleResearchTitleClick("Research Title")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Research Title
//                     </button>
//                     {researchTitleResponse && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{researchTitleResponse}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() =>
//                         handleResearchObjectivesClick("Research Objectives")
//                       }
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Research Objectives
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleIntroductionClick("Introduction")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Introduction
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleAbstractionClick("Abstraction")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Abstraction
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleBibliographyClick("Bibliography")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Bibliography
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() =>
//                         handleMethodologyClick("Research Methodology")
//                       }
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Research Methodology
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleHypothesisClick("Hypothesis")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Hypothesis
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() =>
//                         handleQuestionaryonClick("Likert Scale Questionary")
//                       }
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Likert Scale Questionnarie
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handledatasetClick("Sample dataset")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Sample dataset
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() =>
//                         handlestatisticalClick("Conduct statistical test")
//                       }
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Conduct statistical test
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleInferencesClick("Inferences")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Inferences
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleConclusionClick("Conclusion")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       Conclusion
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>

//                   <div className="button-wrapper">
//                     <button
//                       onClick={() => handleIEEEClick("IEEE format paper")}
//                       className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                     >
//                       IEEE format paper
//                     </button>
//                     {response && (
//                       <div className="mt-4 bg-gray-100 p-4 rounded-md">
//                         <p>Response:</p>
//                         <p>{response}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex justify-center">
//                   <button className="bg-black text-white font-semibold rounded-md px-4 py-2 mt-2">
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Test;
// import React, { useState, useEffect } from "react";
// import {
//   TbBorderCorners,
//   TbArrowsMinimize,
//   TbChevronsDown,
// } from "react-icons/tb";
// import { SiGooglemessages } from "react-icons/si";
// import { GoSync } from "react-icons/go";
// import axios from "axios";

// function Test() {
//   const [showPopup, setShowPopup] = useState(false);
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [popupSize, setPopupSize] = useState({
//     width: "400px",
//     height: "700px",
//   });
//   const [messages, setMessages] = useState([
//     {
//       text: "Hi, I am here to help you. How can I assist you today?",
//       sender: "bot",
//     },
//   ]);
//   const [description, setDescription] = useState("");
//   const [researchTitles, setResearchTitles] = useState([]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     const messageContainer = document.getElementById("message-container");
//     if (messageContainer) {
//       messageContainer.scrollTop = messageContainer.scrollHeight;
//     }
//   };

//   const togglePopup = () => {
//     setShowPopup(!showPopup);
//     setIsFullScreen(false);
//   };

//   const resizePopup = () => {
//     if (!isFullScreen) {
//       if (popupSize.width === "400px") {
//         setPopupSize({ width: "800px", height: "700px" });
//       } else {
//         setPopupSize({ width: "400px", height: "700px" });
//       }
//     }
//   };

//   const toggleFullScreen = () => {
//     if (!isFullScreen) {
//       setPopupSize({ width: "100%", height: "100%" });
//     } else {
//       setPopupSize({ width: "400px", height: "700px" });
//     }
//     setIsFullScreen(!isFullScreen);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setIsFullScreen(false);
//   };

//   const handleRefresh = () => {
//     setMessages([
//       {
//         text: "Hi, I am here to help you. How can I assist you today?",
//         sender: "bot",
//       },
//     ]);
//     setResearchTitles([]);
//     setDescription("");
//   };

//   const handleResearchTitleClick = () => {
//     const hardcodedResponse = `Here are 5 potential research title ideas for water waste management:\n\n1. Evaluation of Greywater Recycling Systems for Household Reuse\n\n2. Assessing the Effectiveness of Constructed Wetlands for Wastewater Treatment\n\n3. Water Auditing to Identify Conservation Opportunities in Commercial Buildings\n\n4. Quantifying Microplastic Pollution from Textile Washing to Inform Mitigation Strategies\n\n5. Modeling Stormwater Capture and Reuse Systems for Irrigation and Groundwater Recharge\n\nI tried to provide a range of ideas from household greywater reuse to wetlands applications to commercial water auditing and microplastics research to stormwater capture systems. Let me know if you would like me to elaborate on any of the topics or provide additional suggestions for water waste management research. There are many possibilities from technology evaluations to surveys and modeling based studies. Please feel free to specify any details that would help further guide the research title ideas.`;
//     const titles = hardcodedResponse
//       .split("\n")
//       .filter((line) => /^\d+\.\s/.test(line))
//       .map((line) => line.replace(/^\d+\.\s/, ""));
//     setResearchTitles(titles);
//   };

//   return (
//     <div>
//       <div className="flex justify-end items-end h-screen p-4">
//         {!showPopup && (
//           <button
//             onClick={togglePopup}
//             className="bg-[orange] hover:bg-[orange] text-white hover:text-[black] font-[30px] py-2 px-4 rounded"
//           >
//             <SiGooglemessages />
//           </button>
//         )}
//         {showPopup && (
//           <div
//             className={`fixed top-0 right-0 rounded-[10px] shadow-md border-2 border-black`}
//             style={{
//               width: popupSize.width,
//               height: popupSize.height,
//               backgroundColor: "white",
//               overflow: "auto",
//             }}
//           >
//             <div className="flex justify-between items-center p-4 rounded-[10px] bg-blue-800 text-white">
//               <div>
//                 <h2 className="text-lg font-bold">Virtual CHATBOT</h2>
//               </div>
//               <div className="flex space-x-10">
//                 <button onClick={resizePopup}>
//                   {/* <TbBorderCorners /> */}
//                 </button>
//                 <button onClick={toggleFullScreen}>
//                   {isFullScreen ? <TbArrowsMinimize /> : <TbBorderCorners />}
//                 </button>
//                 <button onClick={closePopup} className="font-bold rounded">
//                   <TbChevronsDown />
//                 </button>
//               </div>
//               <div
//                 className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 h-7 px-2 py-2"
//                 onClick={handleRefresh}
//               >
//                 <GoSync />
//               </div>
//             </div>

//             <div id="message-container" className="overflow-y-auto max-h-[600px]">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`text-${message.sender === "bot" ? "left" : "right"} py-1 px-2 m-2 bg-gray-200 rounded-md inline-block`}
//                 >
//                   {message.text}
//                 </div>
//               ))}
//             </div>

//             <div className="p-4">
//               <label htmlFor="researchdescription" className="block font-bold mb-2">
//                 Research Description
//               </label>
//               <textarea
//                 id="researchdescription"
//                 className="w-full h-32 p-2 border border-gray-300 rounded-md"
//                 placeholder="Type your message..."
//                 onChange={(e) => setDescription(e.target.value)}
//                 value={description}
//                 name="researchdescription"
//                 type="text"
//               />

//               <div className="mt-4">
//                 <button
//                   onClick={handleResearchTitleClick}
//                   className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
//                 >
//                   Research Title
//                 </button>
//                 {researchTitles.length > 0 && (
//                   <div className="mt-4 bg-gray-100 p-4 rounded-md ">
//                     <p>Research Titles:</p>
//                     <div className="flex flex-col space-y-2">
//                       {researchTitles.map((title, index) => (
//                         <label key={index} className="flex items-center space-x-2 block">
//                           <input type="radio" name="researchTitle" value={title} className="form-radio" />
//                           <span>{title}</span> <br></br>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Test;


import React, { useState, useEffect } from "react";
import {
  TbBorderCorners,
  TbArrowsMinimize,
  TbChevronsDown,
} from "react-icons/tb";
import { SiGooglemessages } from "react-icons/si";
import { GoSync } from "react-icons/go";
import axios from "axios";

function Test() {
  const [showPopup, setShowPopup] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [popupSize, setPopupSize] = useState({
    width: "400px",
    height: "700px",
  });
  const [messages, setMessages] = useState([
    {
      text: "Hi, I am here to help you. How can I assist you today?",
      sender: "bot",
    },
  ]);
  const [description, setDescription] = useState("");
  const [researchTitles, setResearchTitles] = useState([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setIsFullScreen(false);
  };

  const resizePopup = () => {
    if (!isFullScreen) {
      if (popupSize.width === "400px") {
        setPopupSize({ width: "800px", height: "700px" });
      } else {
        setPopupSize({ width: "400px", height: "700px" });
      }
    }
  };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      setPopupSize({ width: "100%", height: "100%" });
    } else {
      setPopupSize({ width: "400px", height: "700px" });
    }
    setIsFullScreen(!isFullScreen);
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsFullScreen(false);
  };

  const handleRefresh = () => {
    setMessages([
      {
        text: "Hi, I am here to help you. How can I assist you today?",
        sender: "bot",
      },
    ]);
    setResearchTitles([]);
    setDescription("");
  };

  const handleResearchTitleClick = async () => {
    const prompt = `Give me atleast 5 research titles for ${description}`;
    await fetchResearchTitles(prompt);
  };

  const fetchResearchTitles = async (prompt) => {
    const url = `https://quantileapibeta.online/call_cascading?prompt=${encodeURIComponent(prompt)}&max_tokens=500`;
    const apiKey = "quant-3rzCLlkmjyamQWB4oW1jF";

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "quant-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const contentText = data.content?.[0]?.text || data.choices?.[0]?.message.content || "";
      const titles = contentText
        .split("\n")
        .filter((line) => /^\d+\.\s/.test(line))
        .map((line) => line.replace(/^\d+\.\s/, ""));

      setResearchTitles(titles);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-end items-end h-screen p-4">
        {!showPopup && (
          <button
            onClick={togglePopup}
            className="bg-[orange] hover:bg-[orange] text-white hover:text-[black] font-[30px] py-2 px-4 rounded"
          >
            <SiGooglemessages />
          </button>
        )}
        {showPopup && (
          <div
            className={`fixed top-0 right-0 rounded-[10px] shadow-md border-2 border-black`}
            style={{
              width: popupSize.width,
              height: popupSize.height,
              backgroundColor: "white",
              overflow: "auto",
            }}
          >
            <div className="flex justify-between items-center p-4 rounded-[10px] bg-blue-800 text-white">
              <div>
                <h2 className="text-lg font-bold">Virtual CHATBOT</h2>
              </div>
              <div className="flex space-x-10">
                <button onClick={resizePopup}>
                  {/* <TbBorderCorners /> */}
                </button>
                <button onClick={toggleFullScreen}>
                  {isFullScreen ? <TbArrowsMinimize /> : <TbBorderCorners />}
                </button>
                <button onClick={closePopup} className="font-bold rounded">
                  <TbChevronsDown />
                </button>
              </div>
              <div
                className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 h-7 px-2 py-2"
                onClick={handleRefresh}
              >
                <GoSync />
              </div>
            </div>

            <div id="message-container" className="overflow-y-auto max-h-[600px]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`text-${message.sender === "bot" ? "left" : "right"} py-1 px-2 m-2 bg-gray-200 rounded-md inline-block`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="p-4">
              <label htmlFor="researchdescription" className="block font-bold mb-2">
                Research Description
              </label>
              <textarea
                id="researchdescription"
                className="w-full h-32 p-2 border border-gray-300 rounded-md"
                placeholder="Type your message..."
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                name="researchdescription"
                type="text"
              />

              <div className="mt-4">
                <button
                  onClick={handleResearchTitleClick}
                  className="bg-blue-800 text-white font-semibold rounded-md px-4 py-2 w-full"
                >
                  Research Title
                </button>
                {researchTitles.length > 0 && (
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <p>Research Titles:</p>
                    <div className="flex flex-col space-y-2">
                      {researchTitles.map((title, index) => (
                        <label key={index} className="flex items-center space-x-2 block">
                          <input type="radio" name="researchTitle" value={title} className="form-radio" />
                          <span>{title}</span> <br></br>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Test;
