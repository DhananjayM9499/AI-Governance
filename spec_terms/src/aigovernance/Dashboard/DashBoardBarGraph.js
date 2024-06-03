import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js';
import * as API from "../endpoint";

const DashBoardBarGraph = ({ data }) => {
  const chartRef = useRef(null); // Reference to the Chart instance

  useEffect(() => {
    if (chartRef.current !== null) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Risk Count',
          data: data.values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Store the new chart instance
    chartRef.current = newChart;

    // Cleanup on unmount
    return () => {
      if (chartRef.current !== null) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  const handleTableRowClick1 = async (item) => {
    try {
      const queryParams = {
        organization: item.organization,
        responsibilitygroup: item.responsibilitygroup,
        responsibilitycenter: item.responsibilitycenter,
      };

      const response = await axios.get(API.GET_RISK_API, { params: queryParams });
      const labels = response.data.map((risk) => risk.riskname);
      const values = response.data.map((risk) => risk.count);

      // Update the chart directly within the useEffect
      if (chartRef.current !== null) {
        chartRef.current.data.labels = labels;
        chartRef.current.data.datasets[0].data = values;
        chartRef.current.update();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <canvas id="myChart"></canvas>
      {/* Rest of your JSX... */}
    </div>
  );
};

export default DashBoardBarGraph;
