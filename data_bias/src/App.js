import React from "react";
import "./App.css";
import Analysis from "./databias/Analysis";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sensitive from "./databias/Sensitive";
import FairnessAPI from "./databias/FairnessAPI";
import PenaltyCalculator from "./databias/PenaltyCalculator";
import AlgorithmAccuracy from "./databias/AlgorithmAccuracy";
import HomePage from "./databias/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/analysis" element={<Analysis />} />
            <Route exact path="/sensitive" element={<Sensitive />} />
            <Route exact path="/fairnessAPI" element={<FairnessAPI />} />
            <Route
              exact
              path="/penaltycalculator"
              element={<PenaltyCalculator />}
            />
            <Route exact path="/algoaccuracy" element={<AlgorithmAccuracy />} />
            {/* Add more routes if needed */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}
export default App;
