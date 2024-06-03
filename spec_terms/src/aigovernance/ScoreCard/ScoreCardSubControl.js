// import React, { useEffect, useState, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import * as API from '../endpoint';
// import axios from 'axios';

// const ScorecardBarGraph = () => {
//   const [data, setData] = useState([]);
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(API.GET_MULTIPLEGRAPH_API);
//         setData(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     // Check if data is available before rendering the chart
//     if (data.length > 0) {
//       // Destroy the existing chart if it exists
//       if (chartRef.current) {
//         chartRef.current.destroy();
//       }

//       // Extract data for thrustarea, assessmentscore, auditscore, and evidenceremark
//       const labels = data.map(entry => entry.thrustarea);
//       const assessmentscores = data.map(entry => entry.assessmentscore);
//       const auditscores = data.map(entry => entry.auditscore);
//       const evidenceremarks = data.map(entry => countWords(entry.evidenceremark)); // Count words

//       // Create a bar chart using Chart.js
//       const ctx = document.getElementById('multipleBarGraph').getContext('2d');
//       chartRef.current = new Chart(ctx, {
//         type: 'bar',
//         data: {
//           labels: labels,
//           datasets: [
//             {
//               label: 'Evidence Remark (Word Count)', // Updated label
//               backgroundColor: '#d0efff',
//               borderColor: '#d0efff',
//               borderWidth: 1,
//               data: evidenceremarks,
//             }, 
         
//             {
//               label: 'Assessment Score',
//               backgroundColor: '#187bcd',
//               borderColor: 'rgba(75, 192, 192, 1)',
//               borderWidth: 1,
//               data: assessmentscores,
//             },
//             {
//               label: 'Audit Score',
//               backgroundColor: '#03254c',
//               borderColor: 'rgba(255, 99, 132, 1)',
//               borderWidth: 1,
//               data: auditscores,
//             }
           
//           ],
//         },
//         options: {
//           scales: {
//             x: {
//               center: 'center', // Center the graph on the x-axis
//             },
//             y: {
//               beginAtZero: true,
//             },
//           },
//           plugins: {
//             legend: {
//               display: true,
//               position: 'top',
//             },
//           },
//         },
//       });
//     }
//   }, [data]);

//   // Function to count words in a string
//   const countWords = (text) => {
//     const words = text.split(/\s+/);
//     return words.length;
//   };

//   return (
//     <center><div style={{
//       height: "300px",
//       width: "85%",
//       margin: "auto",
//     }}>
//       <h1 style={{ textAlign: "center" }}> Assessment & Audit Score</h1>
//       <canvas id="multipleBarGraph"></canvas>
//     </div></center>
//   );
// };

// export default ScorecardBarGraph;









/// ScorecardBarGraph.js
import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import * as API from '../endpoint';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import SubControlGraph from './SubControlGraph'; // Import the new component

const ScoreCardSubControl = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const [selectedThrustArea, setSelectedThrustArea] = useState(null);
  const navigate = useNavigate(); 

  const handleBarClick = (event, elements) => {
    if (elements && elements.length > 0) {
      const clickedIndex = elements[0].index;
      const thrustArea = data[clickedIndex].thrustarea;
      setSelectedThrustArea(thrustArea);

      navigate(`/controlName/${thrustArea}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API.GET_MULTIPLEGRAPH_API);
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const labels = data.map(entry => entry.thrustarea);
      const assessmentscores = data.map(entry => entry.assessmentscore);
      const auditscores = data.map(entry => entry.auditscore);
      const evidenceremarks = data.map(entry => countWords(entry.evidenceremark));

      const ctx = document.getElementById('multipleBarGraph').getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Evidence Remark (Word Count)',
              backgroundColor: '#d0efff',
              borderColor: '#d0efff',
              borderWidth: 1,
              data: evidenceremarks,
            },
            {
              label: 'Assessment Score',
              backgroundColor: '#187bcd',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              data: assessmentscores,
            },
            {
              label: 'Audit Score',
              backgroundColor: '#03254c',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              data: auditscores,
            },
          ],
        },
        options: {
          scales: {
            x: {
              center: 'center',
            },
            y: {
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          onClick: handleBarClick,
        },
      });
    }
  }, [data]);

  const countWords = (text) => {
    const words = text.split(/\s+/);
    return words.length;
  };

  return (
    <center>
      <div style={{
        height: "300px",
        width: "85%",
        margin: "auto",
      }}>
        <h1 style={{ textAlign: "center" }}>Assessment & Audit Score</h1>
        <canvas id="multipleBarGraph"></canvas>
      </div>
      {/* Remove this block since navigation is handled in handleBarClick */}
      {/* {selectedThrustArea && (
        <ControlNameGraph thrustArea={selectedThrustArea} />
      )} */}
    </center>
  );
};

export default ScoreCardSubControl;
