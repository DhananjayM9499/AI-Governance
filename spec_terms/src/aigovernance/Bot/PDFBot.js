// import React, { useState } from "react";
// import Header from "../pages/header";
// import Footer from "../pages/footer";
// import { CircularProgress, Box } from "@mui/material"; // Import CircularProgress and Box from Material-UI
// import axios from "axios";
// export function CircularIndeterminate() {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "3cm",
//       }}
//     >
//       <CircularProgress />
//     </Box>
//   );
// }

// const RagChatComponent = () => {
//   const [db_name, setDbName] = useState("");
//   const [pdf_file, setPdfFile] = useState(null);
//   const [description, setDescription] = useState("");
//   const [question, setQuestion] = useState("");
//   const [response, setResponse] = useState("");

//   const base_url = "https://quantileapibeta.online";
//   const api_key = "quant-3rzCLlkmjyamQWB4oW1jF";

//   const ragDataUpload = async () => {
//     const url = `${base_url}/rag_data_upload`;

//     const formData = new FormData();
//     formData.append("db_name", db_name);
//     formData.append("pdf_file", pdf_file);

//     try {
//       const response = await axios.post(url, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           "quant-api-key": api_key,
//         },
//         params: {
//           chunk_size: 100,
//           chunk_overlap: 10,
//           embedding_model: "text-embedding-3-small",
//         },
//       });
//       console.log(response.data);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//     }
//   };

//   const ragChat = async () => {
//     const url = `${base_url}/rag_assistant`;

//     const params = {
//       db_name: db_name,
//       description: description,
//       question: question,
//       embedding_model: "text-embedding-3-small",
//       inference_model: "gpt-3.5-turbo-0125",
//       temperature: 0,
//       max_token: 500,
//       k: 1,
//     };

//     try {
//       const response = await axios.get(url, {
//         headers: {
//           "quant-api-key": api_key,
//         },
//         params: params,
//       });
//       setResponse(response.data);
//     } catch (error) {
//       console.error("Error fetching chat response:", error);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={db_name}
//         placeholder="Set DB Name"
//         onChange={(e) => setDbName(e.target.value)}
//       />
//       <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} />
//       <button onClick={ragDataUpload}>Upload PDF</button>

//       <input
//         type="text"
//         value={description}
//         placeholder="Response Type"
//         onChange={(e) => setDescription(e.target.value)}
//       />
//       <input
//         type="text"
//         value={question}
//         placeholder="Question"
//         onChange={(e) => setQuestion(e.target.value)}
//       />
//       <button onClick={ragChat}>Send Chat</button>

//       {response && (
//         <div>
//           <p>Response:</p>
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RagChatComponent;
import React, { useState } from "react";
import axios from "axios";

function RagChatComponent() {
  const [db_name, setDbName] = useState("");
  const [pdf_file, setPdfFile] = useState(null);
  const [description, setDescription] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  const base_url = "https://quantileapibeta.online";
  const api_key = "quant-3rzCLlkmjyamQWB4oW1jF";

  const ragDataUpload = async () => {
    const url = `${base_url}/rag_data_upload`;

    const formData = new FormData();
    // formData.append("db_name", db_name);
    formData.append("pdf_file", pdf_file);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "quant-api-key": api_key,
        },
        params: {
          db_name: "myresume",
          pdf_file: formData.pdf_file,
          chunk_size: 100,
          chunk_overlap: 10,
          embedding_model: "text-embedding-3-small",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const ragChat = async () => {
    const url = `${base_url}/rag_assistant`;

    const params = {
      db_name: "myresume",
      description: description,
      question: question,
      embedding_model: "text-embedding-3-small",
      inference_model: "gpt-3.5-turbo-0125",
      temperature: 0,
    };

    try {
      const response = await axios.get(url, {
        headers: {
          "quant-api-key": api_key,
        },
        params: params,
      });
      setResponse(response.data);
    } catch (error) {
      console.error("Error fetching chat response:", error);
    }
  };

  return (
    <div>
      {/* <input
        type="text"
        placeholder="DB name"
        value={db_name}
        onChange={(e) => setDbName(e.target.value)}
      /> */}
      <input
        type="file"
        placeholder="file"
        onChange={(e) => setPdfFile(e.target.files[0])}
      />
      <button onClick={ragDataUpload}>Upload PDF</button>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={ragChat}>Send Chat</button>

      {response && (
        <div>
          <p>Response:</p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default RagChatComponent;
