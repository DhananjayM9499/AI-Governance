import React, { useState, useEffect, useRef } from "react";
import { GoScreenFull } from "react-icons/go";
import { GoScreenNormal } from "react-icons/go";
import { GoX } from "react-icons/go";
import { GoSync } from "react-icons/go";
import { SiGooglemessages } from "react-icons/si";
import axios from "axios";
import * as API from "../endpoint";
const ChatBoat = () => {
  const [minimized, setMinimized] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [maximizeButtonVisible, setMaximizeButtonVisible] = useState(true);
  const [minimizeButtonVisible, setMinimizeButtonVisible] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const togglePopup = () => {
    setShowPopup(!showPopup);
    setIsFullScreen(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() !== "") {
      setMessages([...messages, { text: inputText, sender: "user" }]);
      setInputText("");
    }
  };

  const handleButtonClick = async (buttonText) => {
    if (buttonText === "Awareness") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <div className="pt-2">
                <button
                  onClick={() => handleButtonClick("Data Privacy")}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                >
                  Data Privacy
                </button>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => handleButtonClick("Cyber Security")}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                >
                  Cyber Security
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleButtonClick("AI Regulations")}
                  className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
                >
                  AI Regulations
                </button>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "Data Privacy") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <div>
                {" "}
                <a
                  href="https://staging.reguvista.valuevalidator.com/singapore"
                  className="text-blue-800 hover:underline"
                >
                  Singapore Data Privacy Act
                </a>{" "}
              </div>
              <div>
                {" "}
                <a
                  href="https://staging.reguvista.valuevalidator.com/europe"
                  className="text-blue-800 hover:underline"
                >
                  Europe Data Privacy Act
                </a>{" "}
              </div>
              <div>
                {" "}
                <a
                  href="https://staging.reguvista.valuevalidator.com/uk"
                  className="text-blue-800 hover:underline"
                >
                  UK Data Privacy Act
                </a>{" "}
              </div>
              <div>
                {" "}
                <a
                  href="https://staging.reguvista.valuevalidator.com/canada"
                  className="text-blue-800 hover:underline"
                >
                  Canada Data Privacy Act
                </a>{" "}
              </div>
              <div>
                {" "}
                <a
                  href="https://staging.reguvista.valuevalidator.com/usa"
                  className="text-blue-800 hover:underline"
                >
                  USA Data Privacy Act
                </a>{" "}
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "AI Regulations") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <a
                href="https://docs.google.com/document/d/1NSEnwIpGcHk7By6u0oBaHp79G5tx7dCZOWCf3NarHfE/edit?usp=drive_link"
                className="text-blue-800 hover:underline"
              >
                NIST AI Risk Management Framework Playbook
              </a>
              <a
                href="https://staging.reguvista.valuevalidator.com/gdpr"
                className="text-blue-800 hover:underline"
              >
                EU GDPR Terms
              </a>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "FAQs") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <a
                href="https://staging.reguvista.valuevalidator.com/faqs"
                className="text-blue-800 hover:underline"
              >
                FrequentlyAskedQuestions
              </a>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "Regulatory Insights") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <div className="pt-2">
                <button
                  onClick={() => handleButtonClick("USA")}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                >
                  USA
                </button>
              </div>
              <div>
                <button
                  onClick={() => handleButtonClick("Global Insights")}
                  className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
                >
                  Global Insights
                </button>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "USA") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <p className="text-gray-500">
                Here are all related links of USA:
              </p>

              <div>
                {" "}
                <a
                  href="https://lookerstudio.google.com/reporting/65a85092-ab87-408a-9149-5f0c8a3a3a2b/page/3QyZD"
                  className="text-blue-800 hover:underline"
                >
                  USA - AI, Cyber Security and Data Privacy Legislative Insights
                </a>
              </div>
              <div>
                {" "}
                <a
                  href="https://lookerstudio.google.com/reporting/e0d78101-9b3b-4f09-88c6-aa9858de321a/page/tnmZD"
                  className="text-blue-800 hover:underline"
                >
                  GDPR Penalty Dashboard
                </a>
              </div>
              <div>
                {" "}
                <a
                  href="https://lookerstudio.google.com/u/0/reporting/53f75a39-1379-4dc9-b643-6034ddf8c8b0/page/qxObD"
                  className="text-blue-800 hover:underline"
                >
                  Global AI Legislation Focus Area
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/reporting/5d4b1a7d-9300-42e0-939b-aee7829f6ad9/page/JCTbD"
                  className="text-blue-800 hover:underline"
                >
                  A.I. Legislation Bill Status Updates
                </a>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "AI Regulations") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <a
                href="https://docs.google.com/document/d/1NSEnwIpGcHk7By6u0oBaHp79G5tx7dCZOWCf3NarHfE/edit?usp=drive_link"
                className="text-blue-800 hover:underline"
              >
                NIST AI Risk Management Framework Playbook
              </a>
              <a
                href="https://staging.reguvista.valuevalidator.com/gdpr"
                className="text-blue-800 hover:underline"
              >
                EU GDPR Terms
              </a>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "Compliance Test") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <p>Here is the Capitol Tunnel URL. Please click on it:</p>
              <div className="pt-4">
                <a
                  href="https://staging.reguvista.valuevalidator.com/"
                  className="text-blue-800 hover:underline"
                >
                  CapitolTunnels.com
                </a>
              </div>
              <div className="pt-4">
                <a
                  href="https://staging.reguvista.valuevalidator.com/complianceReports"
                  className="text-blue-800 hover:underline"
                >
                  CamplianceReoprts
                </a>
              </div>
            </div>
          ),
          sender: "bot",
        },
        {
          text: (
            <div>
              <p>Compliance Test URL Login </p>
              <div className="pt-4">
                <a
                  href="https://staging.reguvista.valuevalidator.com/login"
                  className="text-blue-800 hover:underline"
                >
                  Login Here thruogh username_password
                </a>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "AI Governance") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <p>Here is the Capitol Tunnel URL. Please click on it:</p>
              <div className="pt-4">
                <a
                  href="https://staging.reguvista.valuevalidator.com/"
                  className="text-blue-800 hover:underline"
                >
                  CapitolTunnels.com
                </a>
              </div>
              <div className="pt-4">
                <a
                  href="https://staging.reguvista.valuevalidator.com/aiGovernanceReports"
                  className="text-blue-800 hover:underline"
                >
                  GovernanceReport
                </a>
              </div>
            </div>
          ),
          sender: "bot",
        },
        {
          text: (
            <div>
              <p>AI Governance URL Login </p>
              <div className="pt-4">
                <a
                  href="https://staging.reguvista.valuevalidator.com/login"
                  className="text-blue-800 hover:underline"
                >
                  Login Here thruogh username_password
                </a>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "Global Insights") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <p className="text-gray-500">Here are all related links:</p>

              <div>
                <a
                  href="https://lookerstudio.google.com/s/pvzlkb7Tkss"
                  className="text-blue-800 hover:underline"
                >
                  Global AI Legislation, Data Privacy, Cyber Security Latest
                  Updates
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/jRVrFsRjVpI"
                  className="text-blue-800 hover:underline"
                >
                  Global Legislative AI, Data Privacy and Cyber Security PDF
                  Data Library
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/tuiatHYXZtQ"
                  className="text-blue-800 hover:underline"
                >
                  USA - AI, Cyber Security and Data Privacy Legislative Insights
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/okJ-PX_NbH4"
                  className="text-blue-800 hover:underline"
                >
                  GDPR Penalty Dashboard
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/qY9HFEbfKxI"
                  className="text-blue-800 hover:underline"
                >
                  Global AI Legislation Focus area
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/o0UGgLltwFw"
                  className="text-blue-800 hover:underline"
                >
                  A.I. Legislation Bill Status Updates
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/thPdZ_qbbt0"
                  className="text-blue-800 hover:underline"
                >
                  Web Scrap Data Analysis
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/lcyB_gZZxUo"
                  className="text-blue-800 hover:underline"
                >
                  Committees Insights
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/n1DyKPZezvE"
                  className="text-blue-800 hover:underline"
                >
                  Congress
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/iy1prZJncWU"
                  className="text-blue-800 hover:underline"
                >
                  EU Legislative Title Insights
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/nRgdKLRa5E"
                  className="text-blue-800 hover:underline"
                >
                  EU Legislative Dashboard
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/jqpxx6XPAr0"
                  className="text-blue-800 hover:underline"
                >
                  Top 10 Sponsors Dashboard
                </a>
              </div>
              <div>
                <a
                  href="https://lookerstudio.google.com/s/vEmgQ8wOjuY"
                  className="text-blue-800 hover:underline"
                >
                  USA Legislative Data Wordcloud Analytics
                </a>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "Network Security Testing") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <div className="pt-2">
                <button
                  onClick={() => handleButtonClick("Ports")}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                >
                  Ports
                </button>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);
    } else if (buttonText === "Ports") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: buttonText, sender: "user" },
        {
          text: (
            <div>
              <div className="pt-2">
                <button
                  onClick={() => handleButtonClick("Single IP")}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                >
                  Single IP
                </button>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => handleButtonClick("IP Range")}
                  className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                >
                  IP Range
                </button>
              </div>
            </div>
          ),
          sender: "bot",
        },
      ]);

      const handleButtonClick = (buttonText) => {
        if (buttonText === "Single IP") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: buttonText, sender: "user" },
            {
              text: (
                <div>
                  <div className="pt-4">
                    <div className="pt-2">
                      <input
                        id="ipAddressInput"
                        type="text"
                        placeholder="IP Address"
                        className="border border-gray-300 px-2 py-1 rounded-md mr-2"
                      />
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => handleButtonClick("IP check")}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                      >
                        IP check
                      </button>
                    </div>
                    {/* <div className="pt-2">
                      <input
                        type="text"
                        placeholder="outputline"
                        className="border border-gray-300 px-2 py-1 rounded-md mr-2"
                      />
                    </div> */}
                  </div>
                </div>
              ),
              sender: "bot",
            },
          ]);
        } else if (buttonText === "IP Range") {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: buttonText, sender: "user" },
            {
              text: (
                <div>
                  <div>
                    <p className="text-gray-500">IP Range:</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Start IP"
                      className="border border-gray-300 px-2 py-1 rounded-md mr-2"
                    />
                  </div>
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="End IP"
                      className="border border-gray-300 px-2 py-1 rounded-md mr-2"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => handleButtonClick("IP check")}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                    >
                      IP check
                    </button>
                  </div>
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="outputline"
                      className="border border-gray-300 px-2 py-1 rounded-md mr-2"
                    />
                  </div>
                </div>
              ),
              sender: "bot",
            },
          ]);
        } else if (buttonText === "IP check") {
          // Perform IP check and display output
          const ip = document.getElementById("ipAddressInput").value;
          if (ip) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Loading...", sender: "bot" }, // Display loading message
            ]);
            runNmap(ip)
              .then((openPorts) => {
                console.log(ip);
                console.log("Result response:");
                if (result && result.openPorts) {
                  const openPortsList = result.join(", ");
                  console.log(openPortsList);
                  const outputLine = `Open ports for IP address ${ip}: ${openPortsList}`;
                  setMessages((prevMessages) => [
                    ...prevMessages.filter((msg) => msg.text !== "Loading..."), // Remove loading message
                    { text: outputLine, sender: "bot" },
                  ]);
                } else {
                  throw new Error("Invalid response received from the server");
                }
              })
              .catch((error) => {
                // Handle error if runNmap fails
                setMessages((prevMessages) => [
                  ...prevMessages.filter((msg) => msg.text !== "Loading..."), // Remove loading message
                ]);
              });
          } else {
            // Handle case where no IP address is provided
            alert("Please enter an IP address.");
          }
        }
      };
    }
  };

  const handleMinimize = () => {
    setMinimized(true);
    setMinimizeButtonVisible(false);
    setMaximizeButtonVisible(true);
  };
  const handleMaximize = () => {
    setMinimized(false);
    setMinimizeButtonVisible(true);
    setMaximizeButtonVisible(false);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial bot message with buttons
    setMessages([
      {
        text: "Hi, I am here to help you. How can I assist you today?",
        sender: "bot",
      },
      {
        text: (
          <div>
            <button
              onClick={() => handleButtonClick("Regulatory Insights")}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            >
              Regulatory Insights
            </button>
            <button
              onClick={() => handleButtonClick("Compliance Test")}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            >
              Compliance Test
            </button>
            <button
              onClick={() => handleButtonClick("AI Governance")}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            >
              AI Governance
            </button>
            <button
              onClick={() => handleButtonClick("Awareness")}
              className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
            >
              Awareness
            </button>
            <button
              onClick={() => handleButtonClick("FAQs")}
              className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
            >
              FAQs
            </button>
            <button
              onClick={() => handleButtonClick("Network Security Testing")}
              className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
            >
              Netword Security Testing
            </button>
          </div>
        ),
        sender: "bot",
      },
    ]);
  }, []);

  const initialBotMessage = () => {
    setMessages([
      {
        text: "Hi, I am here to help you. How can I assist you today?",
        sender: "bot",
      },
      {
        text: (
          <div>
            <button
              onClick={() => handleButtonClick("Regulatory Insights")}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            >
              Regulatory Insights
            </button>
            <button
              onClick={() => handleButtonClick("Compliance Test")}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            >
              Compliance Test
            </button>
            <button
              onClick={() => handleButtonClick("AI Governance")}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            >
              AI Governance
            </button>
            <button
              onClick={() => handleButtonClick("Awareness")}
              className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
            >
              Awareness
            </button>
            <button
              onClick={() => handleButtonClick("FAQs")}
              className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
            >
              FAQs
            </button>
            <button
              onClick={() => handleButtonClick("Network Security Testing")}
              className="bg-blue-500 mt-2 text-white px-2 py-1 rounded-md ml-2"
            >
              Network Security Testing
            </button>
          </div>
        ),
        sender: "bot",
      },
    ]);
  };

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1].sender === "user"
    ) {
      // Simulate bot response after 1 second
      setTimeout(() => {
        setMessages([
          ...messages,
          { text: "I received your message.", sender: "bot" },
        ]);
      }, 1000);
    }
  }, [messages]);

  const handleRefresh = () => {
    // Add your refresh logic here
    setMessages([]);
    initialBotMessage();
    console.log("Refresh button clicked");
  };
  // const navigate = useNavigate(); // Initialize useHistory hook

  const handleClose = () => {
    console.log("Close button clicked");
    // navigate("/home"); // Navigate to the home page
  };

  const runNmap = async (ip) => {
    try {
      const response = await axios.post(API.GET_NMAP_DETAILS, { ip: ip });
      const openPorts = response.data.openPorts;
      const outputLine = `Open ports for IP address ${ip}: ${openPorts.join(
        ", "
      )}`;
      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.text !== "Loading..."), // Remove loading message
        { text: outputLine, sender: "bot" },
      ]);
      setError(null); // Reset error state if successful
    } catch (error) {
      // Handle errors
      setError("Error fetching data: " + error.message);
      setResult(null); // Reset result state
    }
  };

  return (
    <>
      <div>
        <div></div>
        {!showPopup && (
          <button
            onClick={togglePopup}
            className="bg-[blue] hover:bg-[blue] text-white hover:text-[black] font-[30px] py-2 px-4 rounded"
          >
            <SiGooglemessages />
          </button>
        )}
        {showPopup && <div></div>}
        <div className={`fixed top-4 right-4  ${minimized ? "hidden" : ""}`}>
          <div className="bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px] overflow-y-auto">
            <div className="flex flex-col space-y-1.5 pb-6 pt-[30px]">
              <h2 className="font-bold text-lg tracking-tight bg-blue-800  p-2 rounded text-white">
                Virtual Assistant(ChatBot)
              </h2>
              <p className="text-sm text-[#6b7280] leading-3 bg-grey-200 p-2 rounded">
                WELCOME TO AI GOVERNANCE BOT
              </p>
            </div>

            <div className="absolute top-2 right-2 flex flex-row items-center justify-center p-1 gap-3">
              {minimizeButtonVisible && (
                <div
                  className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 bg-blue-800 hover:bg-blue-200 h-7 px-2 py-2 "
                  onClick={handleMinimize}
                >
                  <GoScreenNormal />
                </div>
              )}
              {maximizeButtonVisible && (
                <div className="text-white hover:text-red text-[15px] pr-2">
                  <GoScreenFull onClick={handleMaximize} />
                </div>
              )}
              <div
                className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 bg-blue-800 hover:bg-blue-200 h-7 px-2 py-2 "
                onClick={handleClose}
              >
                <GoX />
              </div>
              <div
                className="text-white hover:text-red text-[15px] pr-2 rounded-md disabled:pointer-events-none disabled:opacity-30 bg-blue-800 hover:bg-blue-200 h-7 px-2 py-2 "
                onClick={handleRefresh}
              >
                <GoSync />
              </div>
            </div>

            <div className="pr-4">
              {/* Display messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 my-4 text-gray-600 text-sm ${
                    message.sender === "user" ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`py-2 px-4 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-800 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="absolute bottom-0 left-0 w-full flex items-center justify-center space-x-2"
            >
              <input
                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                placeholder="Type your message"
                value={inputText}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-blue-800 hover:bg-blue-900 h-10 px-4 py-2"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default ChatBoat;
