import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import * as API from "../endpoint";
import { useParams, useNavigate } from "react-router-dom";
import "./Algorithminventorygraph.css";
import Header from "../pages/header";
import Footer from "../pages/footer";

const Algorithminventorygraph = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectcode } = useParams();
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const response = await axios.get(
        API.GET_ALGORITHMINVENTORY_PROJECTCODE(projectcode)
      );
      if (Array.isArray(response.data)) {
        const organizedData = response.data.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        setData(organizedData);
      } else {
        console.error(
          "Data received from the API is not an array:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleNodeClick = (chartContext, config) => {
    const attribute = chartContext.opts.series[config.seriesIndex].name;
    console.log("Clicked on node of attribute:", attribute, projectcode);
    navigate("/aichecklist", { state: { attribute, projectcode } });
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
      const attributes = [
        "reliability",
        "privacy",
        "bias",
        "security",
        "performance",
        "robustness",
        "transparency",
        "fairness",
        "accountability",
        "ethics",
        "explainability",
        "resilience",
      ];

      const chartPromises = attributes.map(async (attribute) => {
        try {
          const response = await axios.get(
            API.GET_GRAPH_ALGORITHMINVENTORY(projectcode)
          );
          const data = response.data;
          if (!data || !data.length) {
            console.error(`Data not available for attribute ${attribute}`);
            return null;
          }

          const capitalizedAttribute =
            attribute.charAt(0).toUpperCase() + attribute.slice(1);
          const seriesData = data.map((dataset, index) => ({
            x: index + 1,
            y: parseInt(dataset[attribute], 10),
            marker: { size: index === 0 ? 4 : 8 },
          }));

          return {
            options: {
              chart: {
                type: "stepline",
                height: 150,
                events: {
                  dataPointSelection: (event, chartContext, config) => {
                    const data =
                      chartContext.opts.series[config.seriesIndex].name;
                    setTimeout(() => {
                      console.log(
                        "Clicked on node of attribute:",
                        attribute,
                        projectcode
                      );
                      navigate(`/aichecklist`, {
                        state: { attribute, projectcode },
                      });
                    }, 10);
                  },
                },
              },
              stroke: { curve: "smooth" },
              dataLabels: { enabled: false },
              title: { text: capitalizedAttribute, align: "left" },
              markers: {
                size: 8,
                hover: { sizeOffset: 4 },
              },
              xaxis: { min: 0, max: data.length + 1 },
              yaxis: { min: 0, max: 5 },
              tooltip: {
                shared: false,
                intersect: true,
              },
            },
            series: [{ name: attribute, data: seriesData }],
          };
        } catch (error) {
          console.error(
            `Error fetching data for attribute ${attribute}:`,
            error
          );
          return null;
        }
      });

      try {
        const chartData = await Promise.all(chartPromises);
        setChartData(chartData.filter((chart) => chart !== null));
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectcode]);

  const rows = Math.ceil(chartData.length / 3);

  return (
    <div>
      <Header />
      <div>
        <div style={{ margin: "20px" }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>No</th>
                <th style={{ textAlign: "center" }}>Organization</th>
                <th style={{ textAlign: "center" }}>Responsibility Group</th>
                <th style={{ textAlign: "center" }}>Responsibility Center</th>
                <th style={{ textAlign: "center" }}>Project Name</th>
                <th style={{ textAlign: "center" }}>Project Code</th>
                <th style={{ textAlign: "center" }}>Code Name</th>
                <th style={{ textAlign: "center" }}>Assessment Date</th>
                <th style={{ textAlign: "center" }}>Audit Date</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(data)
                .slice(0, 1)
                .map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.organization}</td>
                    <td>{item.responsibilitygroup}</td>
                    <td>{item.responsibilitycenter}</td>
                    <td>{item.projectname}</td>
                    <td>{item.projectcode}</td>
                    <td>{item.codename}</td>
                    <td>{formatDate(item.assessmentdate)}</td>
                    <td>{formatDate(item.auditdate)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="app">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid-container">
              {[...Array(rows)].map((_, rowIndex) => (
                <div key={rowIndex} className="grid-row">
                  {chartData
                    .slice(rowIndex * 3, (rowIndex + 1) * 3)
                    .map((chart, index) => (
                      <div key={index} className="mixed-chart">
                        <Chart
                          options={chart.options}
                          series={chart.series}
                          height={350}
                          width={400}
                        />
                      </div>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Algorithminventorygraph;
