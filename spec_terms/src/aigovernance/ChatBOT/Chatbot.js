import React, { useState } from "react";
import Header from "../pages/header";
import Footer from "../pages/footer";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// CircularIndeterminate component for loading
export function CircularIndeterminate() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

// CascadingCallComponent
const CascadingCallComponent = () => {
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setMessage(prompt);
    setLoading(true);
    setError(null);

    // Update URL to use HTTPS
    const url = `https://quantileapibeta.online/call_cascading?prompt=${encodeURIComponent(
      prompt
    )}&max_tokens=800`;
    const apiKey = "quant-3rzCLlkmjyamQWB4oW1jF";

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "quant-api-key": apiKey,
        },
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch response. Please try again later.");
    } finally {
      setLoading(false);
    }

    setPrompt("");
  };

  return (
    <div>
      <Header />
      <div>
        <h1 style={{ fontSize: "2em" }}>
          <b>Darśanika (|| दर्शनिक ||)</b>
        </h1>
        <form
          style={{
            fontFamily: "Poppins",
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center",
          }}
          onSubmit={handleSubmit}
        >
          <label style={{ fontSize: "1em" }}>
            Ask anything here...
            <input
              type="text"
              value={prompt}
              placeholder="Chat with me..."
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <br />
          {loading ? (
            <CircularProgress />
          ) : (
            <button className="btn btn-edit" type="submit" disabled={loading}>
              Submit
            </button>
          )}
        </form>
        {response && !loading && (
          <div style={{ marginBottom: "3cm" }}>
            <h2>Response Box</h2>
            <p>
              <b>YOU:</b> {message} .
            </p>
            <p style={{ padding: "1cm", alignContent: "left" }}>
              <b>Response:</b>{" "}
              {response.choices?.[0]?.message.content ||
                response.content?.[0]?.text ||
                "No response available"}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CascadingCallComponent;
