import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import * as API from "../endpoint";
import Footer from "../pages/footer";
import Header from "../pages/header";
const localizer = momentLocalizer(moment);

const Gantt = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API
        const response = await axios.get(API.GET_CHECKLIST_API);
        const data = response.data;

        // Map data to tasks format expected by Calendar component
        const formattedTasks = data.flatMap((item) => [
          {
            id: item.checklistid + "_planned",
            title: item.activity + " (Planned)",
            start: new Date(item.planstartdate),
            end: new Date(item.planenddate),
            type: "planned",
          },
          {
            id: item.checklistid + "_actual",
            title: item.activity + " (Actual)",
            start: item.actualstartdate ? new Date(item.actualstartdate) : null,
            end: item.actualenddate ? new Date(item.actualenddate) : null,
            type: "actual",
          },
        ]);

        // Filter out events with null dates
        const validTasks = formattedTasks.filter(
          (task) => task.start && task.end
        );

        // Set tasks state
        setTasks(validTasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call fetchData function
    fetchData();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <Header />
      <div>
        <div className="chart">
          <h1>Gantt Chart</h1>
          <Calendar
            localizer={localizer}
            events={tasks}
            startAccessor="start"
            endAccessor="end"
            views={["month", "week", "day"]}
            defaultView="month"
            eventPropGetter={(event) => {
              const plannedStyle = {
                backgroundColor: "#8ec3eb",
                color: "Black",
              };
              const actualStyle = {
                backgroundColor: "#3386ff",
                color: "white",
              };

              return {
                style: event.type === "actual" ? actualStyle : plannedStyle,
              };
            }}
            style={{
              height: 600,
              backgroundColor: "#f2f2f9",
              border: "0px",
              borderRadius: "3px",
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gantt;
