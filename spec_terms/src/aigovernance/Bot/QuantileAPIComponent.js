import React, { useState } from "react";
import axios from "axios";

function QuantileAPIImageGeneretion() {
  const [prompt, setPrompt] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://staging.apilayer.valuevalidator.com/qai-api/generate_image/",
        { prompt: "Lotus" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setImageURL(response.data.image_url);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Image Generator</h2>
      <div>
        <label htmlFor="prompt">Enter Prompt:</label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <button onClick={handleGenerateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {imageURL && (
        <div>
          <h3>Generated Image</h3>
          <img src={imageURL} alt="Generated" />
        </div>
      )}
    </div>
  );
}

export default QuantileAPIImageGeneretion;
