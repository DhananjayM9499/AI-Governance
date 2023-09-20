import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import "./Header.css"; // Import your CSS file for styling

const Header = () => {
  return (
    <header className="header">
      {" "}
      {/* Add a className to apply CSS styles */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Capitol Tunnels.io" />
        </Link>
      </div>
      <nav>
        <Link to="/analysis">Bias Analysis</Link>
        <Link to="/sensitive">Data Sensitivity</Link>
        <Link to="/fairnessAPI">Fairness Matrices</Link>
        <Link to="/algoaccuracy">Algorithm Accuracy</Link>
        <Link to="/penaltycalculator">Penalty Calculator</Link>
      </nav>
    </header>
  );
};

export default Header;
