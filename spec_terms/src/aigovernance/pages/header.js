import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import logo from "./logo.png";

const Header = () => {
  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Capitol Tunnels.io" />
        </Link>
      </div>
      <div class="dropdown" style={{ marginRight: "200px" }}>
        <button class="dropbtn">
          Menu
          <i class="fa fa-caret-down"></i>
        </button>
        <div class="dropdown-content">
          <ul>
            <li>
              <a href="/aigovernance">AI Governance</a>
            </li>
            <li>
              <a href="/projects">Projects</a>
            </li>

            <li>
              <a href="/directprojectaudit">Audit Plan</a>
            </li>
            <li>
              <a href="/algorithminventory">Algorithm Inventory</a>
            </li>
            <li>
              <a href="/scorecard">Score Card</a>
            </li>
            <li>
              <a href="/datalineage">Data Lineage</a>
            </li>
            <li>
              <a href="/knowledge-map">Knowledge Map</a>
            </li>
            <li>
              <a href="/mindmap">Mind Map</a>
            </li>
            <li>
              <a href="#">{"<"}AI </a>
              <ul>
                <li>
                  <a href="/chatbot">Darśanika {" (Chat Bot)"} </a>
                </li>
                <li>
                  <a href="/imageGen">Rekhachitra {" (Image Generator)"} </a>
                </li>
                <li>
                  <a href="/pdfBot">PDF Chat </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">{"<"}Master </a>
              <ul>
                <li>
                  <a href="#">{"<"}Governance</a>
                  <ul>
                    <li>
                      <a href="/governanceGroup">Governance Group</a>
                    </li>
                    <li>
                      <a href="/thrustarea">Thrust Area</a>
                    </li>
                    <li>
                      <a href="/governancesubcontrol">Governance Control</a>
                    </li>
                    <li>
                      <a href="/governancecontrol">Governance Sub-Control</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">{"<"}Theme Activity Master</a>
                  <ul>
                    <li>
                      <a href="/activitygroup">Activity Group</a>
                    </li>
                    <li>
                      <a href="/themeactivity">Theme Activity</a>
                    </li>
                    <li>
                      <a href="/projectPhase">Project Phase</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <a href="/vendormaster">Stake Holder Master</a>
                </li>
                <li>
                  <a href="/technology">Technology Master</a>
                </li>
                <li>
                  <a href="/vulnerability">Vulnerabilities</a>
                </li>
                <li>
                  <a href="/resource">Resources</a>
                </li>
                <li>
                  <a href="/dataset">Data Set</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
