import React from "react";
import Header from "./pages/header";
import Footer from "./pages/footer";
import "./main.css"; // Import your CSS styles

function Main() {
  return (
    <div>
      <Header />
      <div>Main Content</div>
      <Footer />
    </div>
  );
}

export default Main;
