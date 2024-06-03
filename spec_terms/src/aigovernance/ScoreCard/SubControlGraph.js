// ControlNameGraph.js
import React, { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import * as API from '../endpoint';
import axios from 'axios';

const SubControlGraph = ({ thrustArea }) => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API.CONTROLNAMEGRAPH_GOVERNANCE_API(thrustArea));
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [thrustArea]);

  useEffect(() => {
    if (data.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      // Extract data for controlname and corresponding scores
      const labels = data.map(entry => entry.controlname);
      const scores = data.map(entry => entry.score);

      const ctx = document.getElementById('controlNameGraph').getContext('2d');
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
        },
      });
    }
  }, [data]);

  return (
    <center>
      <div style={{
        height: "300px",
        width: "85%",
        margin: "auto",
      }}>
        <h1 style={{ textAlign: "center" }}>Control Name Score</h1>
        <canvas id="controlNameGraph"></canvas>
      </div>
    </center>
  );
};

export default SubControlGraph;
