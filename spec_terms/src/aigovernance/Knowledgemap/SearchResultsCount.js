import React from "react";

const SearchResultsCount = ({ count, scrollToResult }) => {
  const handleScroll = (direction) => {
    // Assuming scrollToResult accepts the index to scroll to
    // Implement logic to scroll up or down based on direction
    // For example, scrollToResult(index) can be adjusted based on direction
    // Up direction: scrollToResult(currentIndex - 1)
    // Down direction: scrollToResult(currentIndex + 1)
    // Ensure to handle boundary conditions to prevent scrolling out of bounds
  };

  return (
    <div style={{ textAlign: "left", marginLeft: "2cm", marginTop: "10px" }}>
      <p>Number of results: {count}</p>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          <button onClick={() => scrollToResult(index)}>
            Go to Result {index + 1}
          </button>
        </div>
      ))}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => handleScroll("up")}>Up</button>
        <button onClick={() => handleScroll("down")}>Down</button>
      </div>
    </div>
  );
};

export default SearchResultsCount;
