import React, { useState } from "react";
import axios from "axios";

const AnthropogenicAPIComponent = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://quantileapibeta.online/generate_anthropic_response",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "quant-api-key": "quant-3rzCLlkmjyamQWB4oW1jF",
          },
        }
      );

      setResponse(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Anthropogenic API Integration</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AnthropogenicAPIComponent;
