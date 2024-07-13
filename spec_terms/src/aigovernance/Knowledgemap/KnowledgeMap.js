// // Import necessary modules and components
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import "./KnowledgeMap.css";
// import * as API from "../endpoint";
// import Header from "../pages/header";
// import Footer from "../pages/footer";

// const KnowledgeMap = () => {
//   // State variables for data loading, error handling, filtering
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState("");
//   const [filterValue, setFilterValue] = useState("");

//   // Fetch data on component mount
//   useEffect(() => {
//     axios
//       .get(API.GET_CONTROL_API)
//       .then((response) => {
//         setData(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

//   // Memoized label for filtering
//   const labelValue = useMemo(() => {
//     const filterLabels = {
//       groupname: "Group Name",
//       thrustarea: "Thrust Area",
//       controlname: "Control Name",
//       subcontrolname: "Subcontrol Name",
//       evidence: "Evidence",
//     };
//     return filterLabels[filter] || "";
//   }, [filter]);

//   // Function to group data based on groupname, thrustarea, controls, subcontrols
//   const groupData = (data) => {
//     return data.reduce((acc, item) => {
//       if (!acc[item.groupname]) {
//         acc[item.groupname] = {
//           groupname: item.groupname,
//           thrustareas: [],
//         };
//       }

//       const thrustArea = acc[item.groupname].thrustareas.find(
//         (area) => area.thrustarea === item.thrustarea
//       );

//       if (!thrustArea) {
//         acc[item.groupname].thrustareas.push({
//           thrustarea: item.thrustarea,
//           controls: [
//             {
//               controlname: item.controlname,
//               controlwt: item.controlwt,
//               subcontrols: [
//                 {
//                   subcontrolname: item.subcontrolname,
//                   subcontrolwt: item.subcontrolwt,
//                   evidence: item.evidence,
//                 },
//               ],
//             },
//           ],
//         });
//       } else {
//         const control = thrustArea.controls.find(
//           (control) => control.controlname === item.controlname
//         );

//         if (!control) {
//           thrustArea.controls.push({
//             controlname: item.controlname,
//             controlwt: item.controlwt,
//             subcontrols: [
//               {
//                 subcontrolname: item.subcontrolname,
//                 subcontrolwt: item.subcontrolwt,
//                 evidence: item.evidence,
//               },
//             ],
//           });
//         } else {
//           control.subcontrols.push({
//             subcontrolname: item.subcontrolname,
//             subcontrolwt: item.subcontrolwt,
//             evidence: item.evidence,
//           });
//         }
//       }

//       return acc;
//     }, {});
//   };

//   // Memoized data for controls based on grouped data
//   const controlData = useMemo(() => {
//     const groupedData = groupData(data);
//     return Object.values(groupedData);
//   }, [data]);

//   // Function to filter data based on selected filter and filter value
//   const filterData = (data) => {
//     if (!filter || !filterValue) return data;
//     const filterLowerCase = filterValue.toLowerCase();

//     return data
//       .map((entry) => {
//         if (
//           filter === "groupname" &&
//           entry.groupname.toLowerCase().includes(filterLowerCase)
//         ) {
//           return entry;
//         }

//         const filteredThrustAreas = entry.thrustareas
//           .map((area) => {
//             if (
//               filter === "thrustarea" &&
//               area.thrustarea.toLowerCase().includes(filterLowerCase)
//             ) {
//               return area;
//             }

//             const filteredControls = area.controls
//               .map((control) => {
//                 if (
//                   filter === "controlname" &&
//                   control.controlname.toLowerCase().includes(filterLowerCase)
//                 ) {
//                   return control;
//                 }

//                 const filteredSubcontrols = control.subcontrols.filter(
//                   (sub) => {
//                     if (
//                       filter === "subcontrolname" &&
//                       sub.subcontrolname.toLowerCase().includes(filterLowerCase)
//                     ) {
//                       return true;
//                     }
//                     if (
//                       filter === "evidence" &&
//                       sub.evidence.toLowerCase().includes(filterLowerCase)
//                     ) {
//                       return true;
//                     }
//                     return false;
//                   }
//                 );

//                 if (filteredSubcontrols.length > 0) {
//                   return { ...control, subcontrols: filteredSubcontrols };
//                 }

//                 return null;
//               })
//               .filter(Boolean);

//             if (filteredControls.length > 0) {
//               return { ...area, controls: filteredControls };
//             }

//             return null;
//           })
//           .filter(Boolean);

//         if (filteredThrustAreas.length > 0) {
//           return { ...entry, thrustareas: filteredThrustAreas };
//         }

//         return null;
//       })
//       .filter(Boolean);
//   };

//   // Memoized filtered data based on controlData, filter, and filterValue
//   const filteredData = useMemo(
//     () => filterData(controlData),
//     [controlData, filter, filterValue]
//   );

//   // Function to highlight text matching the keyword
//   const highlightText = (text, keyword) => {
//     if (!keyword) return text;
//     const regex = new RegExp(`(${keyword})`, "gi");
//     return text.split(regex).map((part, index) =>
//       regex.test(part) ? <mark key={index}>{part}</mark> : part
//     );
//   };

//   // Return JSX with filtered and highlighted data
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error loading data: {error.message}</p>;

//   return (
//     <div>
//       <Header />
//       <div style={{ marginTop: "10px", marginBottom: "3cm", textAlign: "left" }}>
//         <div className="container">
//           <FilterComponent
//             filter={filter}
//             setFilter={setFilter}
//             labelValue={labelValue}
//             filterValue={filterValue}
//             setFilterValue={setFilterValue}
//           />
//           <DataTree
//             data={filteredData}
//             filterValue={filterValue}
//             highlightText={highlightText}
//           />
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// // Filter component to select filter options and input filter value
// const FilterComponent = ({
//   filter,
//   setFilter,
//   labelValue,
//   filterValue,
//   setFilterValue,
// }) => (
//   <div style={{ marginTop: "10px", marginBottom: "3cm", textAlign: "left" }}>
//     <div className="filter" style={{ textAlign: "left", marginLeft: "2cm" }}>
//       <label>Map by : </label>
//       <select
//         value={filter}
//         style={{ maxWidth: "6cm", fontFamily: "Poppins" }}
//         onChange={(e) => setFilter(e.target.value)}
//       >
//         <option value="">None</option>
//         <option value="groupname">Group Name</option>
//         <option value="thrustarea">Thrust Area</option>
//         <option value="controlname">Control Name</option>
//         <option value="subcontrolname">Subcontrol Name</option>
//         <option value="evidence">Evidence</option>
//       </select>
//     </div>
//     <div style={{ textAlign: "left", marginLeft: "2cm" }}>
//       <label>{labelValue || "Field"} : </label>
//       <input
//         style={{ maxWidth: "6cm", fontFamily: "Poppins" }}
//         type="text"
//         placeholder="Enter filter value"
//         value={filterValue}
//         onChange={(e) => setFilterValue(e.target.value)}
//       />
//     </div>
//   </div>
// );

// // Component to render the hierarchical data tree with highlighted search text
// const DataTree = ({ data, filterValue, highlightText }) => (
//   <div className="tree" style={{ textAlign: "left" }}>
//     <ul>
//       {data.map((entry, index) => (
//         <li key={index}>
//           <h1>
//             <b>Group Name: </b>
//             {highlightText(entry.groupname, filterValue)}
//           </h1>
//           <ul>
//             {entry.thrustareas.map((area, areaIndex) => (
//               <li key={areaIndex}>
//                 <h2>
//                   <b>Thrust Area: </b>
//                   {highlightText(area.thrustarea, filterValue)}
//                 </h2>
//                 <ul>
//                   {area.controls.map((control, controlIndex) => (
//                     <li key={controlIndex}>
//                       <h3>
//                         <b>Control Name: </b>
//                         {highlightText(control.controlname, filterValue)}{" "}
//                         (Weight: {control.controlwt})
//                       </h3>
//                       <ul>
//                         {control.subcontrols.map((subcontrol, subIndex) => (
//                           <li key={subIndex}>
//                             <h4>
//                               <b>Sub-Control Name: </b>
//                               {highlightText(
//                                 subcontrol.subcontrolname,
//                                 filterValue
//                               )}{" "}
//                               (Weight: {subcontrol.subcontrolwt})
//                             </h4>
//                             <ul>
//                               <li>
//                                 <p style={{ color: "#3386ff" }}>
//                                   <b>Evidence: </b>
//                                   {highlightText(
//                                     subcontrol.evidence,
//                                     filterValue
//                                   )}
//                                 </p>
//                               </li>
//                             </ul>
//                           </li>
//                         ))}
//                       </ul>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         </li>
//       ))}
//     </ul>
//   </div>
// );

// export default KnowledgeMap;



// Import necessary modules and components
// Import necessary modules and components
import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import "./KnowledgeMap.css";
import * as API from "../endpoint";
import Header from "../pages/header";
import Footer from "../pages/footer";

const KnowledgeMap = () => {
  // State variables for data loading, error handling, filtering
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [searchResultsCount, setSearchResultsCount] = useState(0);

  // Ref to store highlighted elements for navigation
  const highlightedElementsRef = useRef([]);

  // Fetch data on component mount
  useEffect(() => {
    axios
      .get(API.GET_CONTROL_API)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Memoized label for filtering
  const labelValue = useMemo(() => {
    const filterLabels = {
      groupname: "Group Name",
      thrustarea: "Thrust Area",
      controlname: "Control Name",
      subcontrolname: "Subcontrol Name",
      evidence: "Evidence",
    };
    return filterLabels[filter] || "";
  }, [filter]);

  // Function to group data based on groupname, thrustarea, controls, subcontrols
  const groupData = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.groupname]) {
        acc[item.groupname] = {
          groupname: item.groupname,
          thrustareas: [],
        };
      }

      const thrustArea = acc[item.groupname].thrustareas.find(
        (area) => area.thrustarea === item.thrustarea
      );

      if (!thrustArea) {
        acc[item.groupname].thrustareas.push({
          thrustarea: item.thrustarea,
          controls: [
            {
              controlname: item.controlname,
              controlwt: item.controlwt,
              subcontrols: [
                {
                  subcontrolname: item.subcontrolname,
                  subcontrolwt: item.subcontrolwt,
                  evidence: item.evidence,
                },
              ],
            },
          ],
        });
      } else {
        const control = thrustArea.controls.find(
          (control) => control.controlname === item.controlname
        );

        if (!control) {
          thrustArea.controls.push({
            controlname: item.controlname,
            controlwt: item.controlwt,
            subcontrols: [
              {
                subcontrolname: item.subcontrolname,
                subcontrolwt: item.subcontrolwt,
                evidence: item.evidence,
              },
            ],
          });
        } else {
          control.subcontrols.push({
            subcontrolname: item.subcontrolname,
            subcontrolwt: item.subcontrolwt,
            evidence: item.evidence,
          });
        }
      }

      return acc;
    }, {});
  };

  // Memoized data for controls based on grouped data
  const controlData = useMemo(() => {
    const groupedData = groupData(data);
    return Object.values(groupedData);
  }, [data]);

  // Function to filter data based on selected filter and filter value
  const filterData = (data) => {
    if (!filter || !filterValue) return data;
    const filterLowerCase = filterValue.toLowerCase();

    return data
      .map((entry) => {
        if (
          filter === "groupname" &&
          entry.groupname.toLowerCase().includes(filterLowerCase)
        ) {
          return entry;
        }

        const filteredThrustAreas = entry.thrustareas
          .map((area) => {
            if (
              filter === "thrustarea" &&
              area.thrustarea.toLowerCase().includes(filterLowerCase)
            ) {
              return area;
            }

            const filteredControls = area.controls
              .map((control) => {
                if (
                  filter === "controlname" &&
                  control.controlname.toLowerCase().includes(filterLowerCase)
                ) {
                  return control;
                }

                const filteredSubcontrols = control.subcontrols.filter(
                  (sub) => {
                    if (
                      filter === "subcontrolname" &&
                      sub.subcontrolname.toLowerCase().includes(filterLowerCase)
                    ) {
                      return true;
                    }
                    if (
                      filter === "evidence" &&
                      sub.evidence.toLowerCase().includes(filterLowerCase)
                    ) {
                      return true;
                    }
                    return false;
                  }
                );

                if (filteredSubcontrols.length > 0) {
                  return { ...control, subcontrols: filteredSubcontrols };
                }

                return null;
              })
              .filter(Boolean);

            if (filteredControls.length > 0) {
              return { ...area, controls: filteredControls };
            }

            return null;
          })
          .filter(Boolean);

        if (filteredThrustAreas.length > 0) {
          return { ...entry, thrustareas: filteredThrustAreas };
        }

        return null;
      })
      .filter(Boolean);
  };

  // Memoized filtered data based on controlData, filter, and filterValue
  const filteredData = useMemo(
    () => filterData(controlData),
    [controlData, filter, filterValue]
  );

  // Function to highlight text matching the keyword
  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? <mark key={index}>{part}</mark> : part
    );
  };

  // Function to navigate through highlighted elements
  const navigateHighlights = (direction) => {
    if (highlightedElementsRef.current.length === 0) return;

    let newIndex = highlightedIndex;
    const totalHighlights = highlightedElementsRef.current.length;

    if (direction === "next") {
      newIndex = (newIndex + 1) % totalHighlights;
    } else if (direction === "prev") {
      newIndex = (newIndex - 1 + totalHighlights) % totalHighlights;
    }

    setHighlightedIndex(newIndex);
    highlightedElementsRef.current[newIndex].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Effect to update search results count on filter or filterValue change
  useEffect(() => {
    const countHighlights = () => {
      const highlights = document.querySelectorAll("mark");
      setSearchResultsCount(highlights.length);

      // Store references to highlighted elements
      highlightedElementsRef.current = Array.from(highlights);
    };

    countHighlights();
    setHighlightedIndex(0); // Reset index on new search
  }, [filter, filterValue, filteredData]);

  // Return JSX with filtered and highlighted data, navigation controls, and search results count
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div>
      <Header />
      <div style={{ marginTop: "10px", marginBottom: "3cm", textAlign: "left" }}>
        <div className="container">
          <FilterComponent
            filter={filter}
            setFilter={setFilter}
            labelValue={labelValue}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          />
          <div className="floating-buttons">
            <p>Search results: {searchResultsCount}</p>
            <button style={{fontFamily:"Poppins"}} onClick={() => navigateHighlights("prev")}>Previous</button>
            <button style={{fontFamily:"Poppins"}} onClick={() => navigateHighlights("next")}>Next</button>
          </div>
          <DataTree
            data={filteredData}
            filterValue={filterValue}
            highlightText={highlightText}
            highlightedIndex={highlightedIndex}
            highlightedElementsRef={highlightedElementsRef}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Filter component to select filter options and input filter value
const FilterComponent = ({
  filter,
  setFilter,
  labelValue,
  filterValue,
  setFilterValue,
}) => (
  <div style={{ marginTop: "10px", marginBottom: "3cm", textAlign: "left" }}>
    <div className="filter" style={{ textAlign: "left", marginLeft: "2cm" }}>
      <label>Map by : </label>
      <select
        value={filter}
        style={{ maxWidth: "6cm", fontFamily: "Poppins" }}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">None</option>
        <option value="groupname">Group Name</option>
        <option value="thrustarea">Thrust Area</option>
        <option value="controlname">Control Name</option>
        <option value="subcontrolname">Subcontrol Name</option>
        <option value="evidence">Evidence</option>
      </select>
    </div>
    <div style={{ textAlign: "left", marginLeft: "2cm" }}>
      <label>{labelValue || "Field"} : </label>
      <input
        style={{ maxWidth: "6cm", fontFamily: "Poppins" }}
        type="text"
        placeholder="Enter filter value"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
    </div>
  </div>
);

// Component to render nested data structure with highlighting
const DataTree = ({
  data,
  filterValue,
  highlightText,
  highlightedIndex,
  highlightedElementsRef,
}) => (
  <div className="tree" style={{ textAlign: "left" }}>
    <ul>
      {data.map((entry, index) => (
        <li key={index}>
          <h1>
            <b>Group Name: </b>
            {highlightText(entry.groupname, filterValue)}
          </h1>
          <ul>
            {entry.thrustareas.map((area, areaIndex) => (
              <li key={areaIndex}>
                <h2>
                  <b>Thrust Area: </b>
                  {highlightText(area.thrustarea, filterValue)}
                </h2>
                <ul>
                  {area.controls.map((control, controlIndex) => (
                    <li key={controlIndex}>
                      <h3>
                        <b>Control Name: </b>
                        {highlightText(control.controlname, filterValue)}{" "}
                        (Weight: {control.controlwt})
                      </h3>
                      <ul>
                        {control.subcontrols.map((subcontrol, subIndex) => (
                          <li key={subIndex}>
                            <h4>
                              <b>Sub-Control Name: </b>
                              {highlightText(
                                subcontrol.subcontrolname,
                                filterValue
                              )}{" "}
                              (Weight: {subcontrol.subcontrolwt})
                            </h4>
                            <ul>
                              <li>
                                <p style={{ color: "#3386ff" }}>
                                  <b>Evidence: </b>
                                  {highlightText(
                                    subcontrol.evidence,
                                    filterValue
                                  )}
                                </p>
                              </li>
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
);

export default KnowledgeMap;
