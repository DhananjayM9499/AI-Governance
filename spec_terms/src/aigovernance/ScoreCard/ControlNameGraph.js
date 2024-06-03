// // ControlNameGraph.js
// import React, { useEffect, useState, useRef } from 'react';
// import Chart from 'chart.js/auto';
// import * as API from '../endpoint';
// import axios from 'axios';

// const ControlNameGraph = ({ thrustArea }) => {
//   const [data, setData] = useState([]);
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(API.CONTROLNAMEGRAPH_GOVERNANCE_API(thrustArea));
//         setData(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//   }, [thrustArea]);

//   useEffect(() => {
//     if (data.length > 0) {
//       if (chartRef.current) {
//         chartRef.current.destroy();
//       }

//       // Extract data for controlname and corresponding scores
//       const labels = data.map(entry => entry.controlname);
//       const scores = data.map(entry => entry.score);

//       const ctx = document.getElementById('controlNameGraph').getContext('2d');
//       chartRef.current = new Chart(ctx, {
//         type: 'bar',
//         data: {
//           labels: labels,
//           datasets: [
//             {
//               label: 'Control Name Score',
//               backgroundColor: '#ffcccb',
//               borderColor: '#ffcccb',
//               borderWidth: 1,
//               data: scores,
//             },
//           ],
//         },
//         options: {
//           scales: {
//             x: {
//               center: 'center',
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

//   return (
//     <center>
//       <div style={{
//         height: "300px",
//         width: "85%",
//         margin: "auto",
//       }}>
//         <h1 style={{ textAlign: "center" }}>Control Name Score</h1>
//         <canvas id="controlNameGraph"></canvas>
//       </div>
//     </center>
//   );
// };

// export default ControlNameGraph;


































// ControlNameGraph.js
import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import * as API from '../endpoint';

const ControlNameGraph = ({ thrustArea }) => {
  const [data, setData] = useState([]);
  const [subgraphData, setSubgraphData] = useState([]);
  const chartRef = useRef(null);
  const controlNameGraphId = 'controlNameGraph';
  const subControlNameGraphId = 'subControlNameGraph';

  const fetchData = async () => {
    try {
      const response = await axios.get(API.CONTROLNAMEGRAPH_GOVERNANCE_API(thrustArea));
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubgraphData = async (clickedControlName) => {
    try {
      const response = await axios.get(API.SUBCONTROLNAMEGRAPH_GOVERNANCE_API(clickedControlName));
      setSubgraphData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderControlNameGraph = () => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const labels = data.map(entry => entry.controlname);
    const scores = data.map(entry => entry.score);

    const ctx = document.getElementById(controlNameGraphId).getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Control Name Score',
            backgroundColor: '#ffcccb',
            borderColor: '#ffcccb',
            borderWidth: 1,
            data: scores,
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
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedControlName = labels[elements[0].index];
            fetchSubgraphData(clickedControlName);
          }
        },
      },
    });
  };

  const renderSubControlNameGraph = () => {
    if (subgraphData.length > 0) {
      const subgraphLabels = subgraphData.map(entry => entry.subcontrolname);
      const subgraphScores = subgraphData.map(entry => entry.subscore);

      const subgraphCtx = document.getElementById(subControlNameGraphId).getContext('2d');
      new Chart(subgraphCtx, {
        type: 'bar',
        data: {
          labels: subgraphLabels,
          datasets: [
            {
              label: 'Subcontrol Name Score',
              backgroundColor: '#ffcccb',
              borderColor: '#ffcccb',
              borderWidth: 1,
              data: subgraphScores,
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
        },
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [thrustArea]);

  useEffect(() => {
    if (data.length > 0) {
      renderControlNameGraph();
    }
  }, [data]);

  useEffect(() => {
    renderSubControlNameGraph();
  }, [subgraphData]);

  return (
    <center>
      <div style={{
        height: "300px",
        width: "85%",
        margin: "auto",
      }}>
        <h1 style={{ textAlign: "center" }}>Control Name Score</h1>
        <canvas id={controlNameGraphId}></canvas>
        <h1 style={{ textAlign: "center" }}>Subcontrol Name Score</h1>
        <canvas id={subControlNameGraphId}></canvas>
      </div>
    </center>
  );
};

export default ControlNameGraph;

