const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
//const mysql = require("mysql2");
const pg = require("pg");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "Danny@1252",
//   database: "term_set",
// });
const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "termset",
  password: "crud",
  port: 5432,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For viewing term set Home.js
// app.get("/api/get", (req, res) => {
//   const sqlGet = "SELECT * FROM termset";
//   db.query(sqlGet, (error, result) => {
//     res.send(result);
//   });
// });
app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM termset";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//for adding the term Set
// app.get("/api/get", (req, res) => {
//   const sqlGet = "SELECT * FROM termset";
//   db.query(sqlGet, (error, result) => {
//     res.send(result);
//   });
// });
app.post("/api/post", (req, res) => {
  const { termsetname } = req.body;
  const sqlInsert = "INSERT INTO termset (termsetname) VALUES ($1)"; // Use $1 for parameterized query
  const values = [termsetname];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting term set:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Term set inserted successfully" });
    }
  });
});

//for adding a new Term
// app.post("/api/post/term/:termsetid", (req, res) => {
//   const { termname } = req.body;
//   const { termsetid } = req.params;
//   const sqlInsert = " INSERT INTO term (termname, termsetid) VALUES (?, ?)";
//   db.query(sqlInsert, [termname, termsetid], (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//   });
// });
app.post("/api/post/term/:termsetid", (req, res) => {
  const { termname } = req.body;
  const { termsetid } = req.params;
  const sqlInsert = "INSERT INTO term (termname, termsetid) VALUES ($1, $2)";
  db.query(sqlInsert, [termname, termsetid], (error, result) => {
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ message: "Term inserted successfully" });
    }
  });
});

//for deleting the term set
// app.delete("/api/remove/:termsetid", (req, res) => {
//   const { termsetid } = req.params;
//   const sqlCheckTerms =
//     "SELECT COUNT(*) AS termCount FROM term WHERE termsetid = ?";
//   db.query(sqlCheckTerms, termsetid, (error, result) => {
//     if (error) {
//       console.log(error);
//       return res.status(500).send("An error occurred while checking terms.");
//     }

//     const termCount = result[0].termCount;

//     if (termCount > 0) {
//       return res
//         .status(400)
//         .send("Cannot delete term set with associated terms.");
//     }

//     const sqlRemove = "DELETE FROM termset WHERE termsetid = ?";
//     db.query(sqlRemove, termsetid, (error, result) => {
//       if (error) {
//         console.log(error);
//         return res
//           .status(500)
//           .send("An error occurred while deleting term set.");
//       }

//       res.send("Term set deleted successfully.");
//     });
//   });
// });

app.delete("/api/remove/:termsetid", (req, res) => {
  const { termsetid } = req.params;
  const sqlCheckTerms =
    "SELECT COUNT(*) AS termCount FROM term WHERE termsetid = $1";
  const sqlRemove = "DELETE FROM termset WHERE termsetid = $1";

  db.query(sqlCheckTerms, [termsetid], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("An error occurred while checking terms.");
    }

    const termCount = result.rows[0].termCount;

    if (termCount > 0) {
      return res
        .status(400)
        .send("Cannot delete term set with associated terms.");
    }

    db.query(sqlRemove, [termsetid], (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while deleting term set.");
      }

      res.send("Term set deleted successfully.");
    });
  });
});

//for deleting the term
// app.delete("/api/remove/term/:termid", (req, res) => {
//   const { termid } = req.params;
//   const sqlRemove = "DELETE FROM term WHERE termid = ?";
//   db.query(sqlRemove, termid, (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//     res.send(result);
//   });
// });
app.delete("/api/remove/term/:termid", (req, res) => {
  const { termid } = req.params;
  const sqlRemove = "DELETE FROM term WHERE termid = $1";

  db.query(sqlRemove, [termid], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("An error occurred while deleting the term.");
    }

    res.send("Term deleted successfully.");
  });
});

//for viewing the specific term set
// app.get("/api/get/:termsetid", (req, res) => {
//   const { termsetid } = req.params;
//   const sqlGet = "SELECT * FROM termset WHERE termsetid = ?";
//   db.query(sqlGet, termsetid, (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//     res.send(result);
//   });
// });
app.get("/api/get/:termsetid", async (req, res) => {
  try {
    const { termsetid } = req.params;
    const sqlGet = "SELECT * FROM termset WHERE termsetid = $1";

    const result = await db.query(sqlGet, [termsetid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the term set.");
  }
});

// for viewing the list of term
// app.get("/api/get/term/:termsetid", (req, res) => {
//   const { termsetid } = req.params;
//   const sqlGet = "SELECT * FROM term WHERE termsetid = ?";
//   db.query(sqlGet, termsetid, (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//     res.send(result);
//   });
// });
app.get("/api/get/term/:termsetid", (req, res) => {
  const { termsetid } = req.params;
  const sqlGet = "SELECT * FROM term WHERE termsetid = $1";

  db.query(sqlGet, [termsetid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the terms.");
    }

    res.send(result.rows);
  });
});

//viewing the specific term
// app.get("/api/get/term/:termid/:termsetid", (req, res) => {
//   try {
//     const { termid, termsetid } = req.params;
//     const sqlGet = "SELECT * FROM term WHERE termid=? AND termsetid = ?";

//     db.query(sqlGet, [termid, termsetid], (error, result) => {
//       if (error) {
//         console.error(error);
//         return res
//           .status(500)
//           .send("An error occurred while fetching the term.");
//       }

//       if (result.length === 0) {
//         return res.status(404).send("Term not found.");
//       }

//       res.send(result);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("An error occurred on the server.");
//   }
// });
app.get("/api/get/term/:termid/:termsetid", (req, res) => {
  const { termid, termsetid } = req.params;
  const sqlGet = "SELECT * FROM term WHERE termid = $1 AND termsetid = $2";

  db.query(sqlGet, [termid, termsetid], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching the term.");
    }

    if (result.rows.length === 0) {
      return res.status(404).send("Term not found.");
    }

    res.send(result.rows);
  });
});

//for editing the termset
// app.put("/api/update/:termsetid", (req, res) => {
//   const { termsetid } = req.params;
//   const { termsetname } = req.body;
//   const sqlUpdate = "UPDATE termset SET termsetname = ? WHERE termsetid = ?";
//   db.query(sqlUpdate, [termsetname, termsetid], (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//     res.send(result);
//   });
// });
app.put("/api/update/:termsetid", (req, res) => {
  const { termsetid } = req.params;
  const { termsetname } = req.body;
  const sqlUpdate = "UPDATE termset SET termsetname = $1 WHERE termsetid = $2";

  db.query(sqlUpdate, [termsetname, termsetid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating the term set.");
    }

    res.send("Term set updated successfully.");
  });
});

//for editing the terms
// app.put("/api/update/term/:termid/:termsetid", (req, res) => {
//   const { termid, termsetid } = req.params;
//   const { termname } = req.body;
//   const sqlUpdateTerms =
//     "UPDATE term SET termname = ? WHERE termid = ? AND termsetid = ?";

//   db.query(sqlUpdateTerms, [termname, termid, termsetid], (error, result) => {
//     if (error) {
//       console.log(error);
//     }
//     res.send(result);
//   });
// });

app.put("/api/update/term/:termid/:termsetid", (req, res) => {
  const { termid, termsetid } = req.params;
  const { termname } = req.body;
  const sqlUpdateTerms =
    "UPDATE term SET termname = $1 WHERE termid = $2 AND termsetid = $3";

  db.query(sqlUpdateTerms, [termname, termid, termsetid], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("An error occurred while updating the term.");
    }

    res.send("Term updated successfully.");
  });
});

/*****************Project Phase APIs*********************************************** */

//for getting the project phase
app.get("/get/api/projectphase", (req, res) => {
  const sqlGet = "SELECT * FROM projectphase";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//for deleting the project phase
app.delete("/remove/api/projectphase/:phaseid", (req, res) => {
  const { phaseid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS phaseCount FROM projectphase WHERE phaseid = $1";
  const sqlRemove = "DELETE FROM projectphase WHERE phaseid = $1";

  db.query(sqlCheckPhase, [phaseid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while checking project Phases.");
    }

    const phaseCount = result.rows[0].phaseCount;

    if (phaseCount > 0) {
      return res
        .status(400)
        .send("Cannot delete projet Phase with associated Projects.");
    }

    db.query(sqlRemove, [phaseid], (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while deleting Project Phase.");
      }

      res.send("project Phase deleted successfully.");
    });
  });
});

//For viewing the specific project phase
app.get("/get/api/projectphase/:phaseid", async (req, res) => {
  try {
    const { phaseid } = req.params;
    const sqlGet = "SELECT * FROM projectphase WHERE phaseid = $1";

    const result = await db.query(sqlGet, [phaseid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching the Project Phase .");
  }
});

//Adding Project phase
app.post("/post/api/projectphase", (req, res) => {
  const { phasename, description } = req.body;
  const sqlInsert =
    "INSERT INTO projectphase (phasename,description) VALUES ($1,$2)"; // Use $1 for parameterized query
  const values = [phasename, description];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Project Phase:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Project phase inserted successfully" });
    }
  });
});

//for editing the Project Phase
app.put("/update/api/projectphase/:phaseid", (req, res) => {
  const { phaseid } = req.params;
  const { phasename, description } = req.body;
  const sqlUpdate =
    "UPDATE projectphase SET phasename = $1, description = $2 WHERE phaseid = $3";

  db.query(sqlUpdate, [phasename, description, phaseid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating the Project Phase.");
    }

    res.send("Project phase updated successfully.");
  });
});
/*****************Governance Step APIs*********************************************** */

//for getting the Governance Step
app.get("/getGovernanceStep/api", (req, res) => {
  const sqlGet = "SELECT * FROM governancestep";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//for deleting the Governance Step
app.delete("/removeGovernanceStep/api/:stepid", (req, res) => {
  const { stepid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS stepCount FROM governancestep WHERE stepid = $1";
  const sqlRemove = "DELETE FROM governancestep WHERE stepid = $1";

  db.query(sqlCheckPhase, [stepid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while checking Governance Steps.");
    }

    const stepCount = result.rows[0].stepCount;

    if (stepCount > 0) {
      return res
        .status(400)
        .send("Cannot delete Govenance step with associated Steps.");
    }

    db.query(sqlRemove, [stepid], (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while deleting Governance Steps.");
      }

      res.send("Steps deleted successfully.");
    });
  });
});

//For viewing the specific Governance Step
app.get("/getGovernanceStep/api/:stepid", async (req, res) => {
  try {
    const { stepid } = req.params;
    const sqlGet = "SELECT * FROM governancestep WHERE stepid = $1";

    const result = await db.query(sqlGet, [stepid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching the Governance Step .");
  }
});

//Adding Governance Step
app.post("/add/GovernanceStep/api", (req, res) => {
  const { stepname, description } = req.body;
  const sqlInsert =
    "INSERT INTO governancestep (stepname,description) VALUES ($1,$2)"; // Use $1 for parameterized query
  const values = [stepname, description];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Governance Step:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Step inserted successfully" });
    }
  });
});

//for editing the Governance Step
app.put("/updateGovernanceStep/api/:stepid", (req, res) => {
  const { stepid } = req.params;
  const { stepname, description } = req.body;
  const sqlUpdate =
    "UPDATE governancestep SET stepname = $1, description = $2 WHERE stepid = $3";

  db.query(sqlUpdate, [stepname, description, stepid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating the Governance Step.");
    }

    res.send("Governance step updated successfully.");
  });
});

/*****************Governance Group APIs*********************************************** */

//for getting the Governance Group
app.get("/GovernanceGroupget/api", (req, res) => {
  const sqlGet = "SELECT * FROM governancegroup";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//for deleting the Governance Group
app.delete("/GovernanceGroupremove/api/:groupid", (req, res) => {
  const { groupid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS groupCount FROM governancegroup WHERE groupid = $1";
  const sqlRemove = "DELETE FROM governancegroup WHERE groupid = $1";

  db.query(sqlCheckPhase, [groupid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while checking Governance Group.");
    }

    const groupCount = result.rows[0].groupCount;

    if (groupCount > 0) {
      return res
        .status(400)
        .send("Cannot delete Governance Group with associated  Group.");
    }

    db.query(sqlRemove, [groupid], (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while deleting Governance Group.");
      }

      res.send("Governance Group deleted successfully.");
    });
  });
});

//For viewing the specific Governance Group
app.get("/GovernanceGroupget/api/:groupid", async (req, res) => {
  try {
    const { groupid } = req.params;
    const sqlGet = "SELECT * FROM governancegroup WHERE groupid = $1";

    const result = await db.query(sqlGet, [groupid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching the Governance Group .");
  }
});

//Adding Governance Group
app.post("/GovernanceGroupadd/api", (req, res) => {
  const { groupname } = req.body;
  const sqlInsert = "INSERT INTO governancegroup (groupname) VALUES ($1)"; // Use $1 for parameterized query
  const values = [groupname];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Governance Group:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ message: "Governance Group inserted successfully" });
    }
  });
});

//for editing the Governance Group
app.put("/GovernanceGroupupdate/api/:groupid", (req, res) => {
  const { groupid } = req.params;
  const { groupname } = req.body;
  const sqlUpdate =
    "UPDATE governancegroup SET groupname = $1 WHERE groupid = $2";

  db.query(sqlUpdate, [groupname, groupid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating the Governance Group.");
    }

    res.send("Governance Group updated successfully.");
  });
});

/*****************Company APIs*********************************************** */

//for getting the Company
app.get("/companyget/api", (req, res) => {
  const sqlGet = "SELECT * FROM company";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//for deleting the Company
app.delete("/companyremove/api/:companyid", (req, res) => {
  const { companyid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS companyCount FROM company WHERE companyid = $1";
  const sqlRemove = "DELETE FROM company WHERE companyid = $1";

  db.query(sqlCheckPhase, [companyid], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("An error occurred while checking Company.");
    }

    const companyCount = result.rows[0].companyCount;

    if (companyCount > 0) {
      return res.status(400).send("Cannot delete Company with associates.");
    }

    db.query(sqlRemove, [companyid], (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while deleting Companys.");
      }

      res.send("Company deleted successfully.");
    });
  });
});

//For viewing the specific Company
app.get("/companyget/api/:companyid", async (req, res) => {
  try {
    const { companyid } = req.params;
    const sqlGet = "SELECT * FROM company WHERE companyid = $1";

    const result = await db.query(sqlGet, [companyid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Company .");
  }
});

//Adding Company
app.post("/companyadd/api", (req, res) => {
  const { companyname, contactname, contactemail, contactphone } = req.body;
  const sqlInsert =
    "INSERT INTO company (companyname,contactname,contactemail,contactphone) VALUES ($1,$2,$3,$4)";
  const values = [companyname, contactname, contactemail, contactphone];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Company:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Company inserted successfully" });
    }
  });
});

//for editing the Company
app.put("/updatecompany/api/:companyid", (req, res) => {
  const { companyid } = req.params;
  const { companyname, contactname, contactemail, contactphone } = req.body;
  const sqlUpdate =
    "UPDATE company SET companyname=$1,contactname=$2,contactemail=$3,contactphone=$4 WHERE companyid = $5";

  db.query(
    sqlUpdate,
    [companyname, contactname, contactemail, contactphone, companyid],
    (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while updating the Company.");
      }

      res.send("Company updated successfully.");
    }
  );
});

/*******************Project APIs********* */
//for adding a new Project
app.post("/projectadd/api/:companyid", (req, res) => {
  const { projectname, fromdate, todate } = req.body;
  const { companyid } = req.params;
  const sqlInsert =
    "INSERT INTO project (projectname,fromdate,todate, companyid) VALUES ($1, $2,$3,$4)";
  db.query(
    sqlInsert,
    [projectname, fromdate, todate, companyid],
    (error, result) => {
      if (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(201).json({ message: "Project  inserted successfully" });
      }
    }
  );
});

//for deleting the Project
app.delete("/projectRemove/:projectid", (req, res) => {
  const { projectid } = req.params;
  const sqlRemove = "DELETE FROM project WHERE projectid = $1";

  db.query(sqlRemove, [projectid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Project Details.");
    }

    res.send("Project details deleted successfully.");
  });
});

/******************************************* */
// for viewing the list of Projects
app.get("/projectgetapi", (req, res) => {
  const sqlGet = "SELECT * FROM project ";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Project Details.");
    }

    res.send(result.rows);
  });
});
/******************************************* */
// for viewing the list of Projects
app.get("/projectgetApi/:companyid", (req, res) => {
  const { companyid } = req.params;
  const sqlGet = "SELECT * FROM project WHERE companyid = $1";

  db.query(sqlGet, [companyid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Project Details.");
    }

    res.send(result.rows);
  });
});

//viewing the specific PROJECT
app.get("/projectApiGet/:projectid/:companyid", (req, res) => {
  const { projectid, companyid } = req.params;
  const sqlGet =
    "SELECT * FROM project WHERE projectid = $1 AND companyid = $2";

  db.query(sqlGet, [projectid, companyid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Project Details.");
    }

    if (result.rows.length === 0) {
      return res.status(404).send("Details not found.");
    }

    res.send(result.rows);
  });
});
//updating the project
app.put("/projectUpdate/api/:projectid/:companyid", (req, res) => {
  const { projectid, companyid } = req.params;
  const { projectname, fromdate, todate } = req.body;
  const sqlUpdateTerms =
    "UPDATE project SET projectname=$1,fromdate=$2,todate=$3 WHERE projectid = $4 AND companyid = $5";

  db.query(
    sqlUpdateTerms,
    [projectname, fromdate, todate, projectid, companyid],
    (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while updating the Project Details.");
      }

      res.send("Project Details updated successfully.");
    }
  );
});

/*****************Governance Task APIs******************* */
app.get("/taskGovernance/api", (req, res) => {
  const sqlGet = "SELECT * FROM governancetask";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Governance Task.");
    }

    res.send(result.rows);
  });
});

//for deleting the task
app.delete("/taskGovernanceRemove/:taskid", (req, res) => {
  const { taskid } = req.params;
  const sqlRemove = "DELETE FROM governancetask WHERE taskid = $1";

  db.query(sqlRemove, [taskid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Project Details.");
    }

    res.send("Project details deleted successfully.");
  });
});

//Adding Task
app.post("/governanceAddtask/api", (req, res) => {
  const { taskdescription, stepid, groupid } = req.body;
  const sqlInsert =
    "INSERT INTO governancetask (taskdescription, stepid, groupid) VALUES ($1,$2,$3)";
  const values = [taskdescription, stepid, groupid];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Task:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "task inserted successfully" });
    }
  });
});

//For viewing the specific Task
app.get("/taskGovernanceget/api/:taskid", async (req, res) => {
  try {
    const { taskid } = req.params;
    const sqlGet = "SELECT * FROM governancetask WHERE taskid = $1";

    const result = await db.query(sqlGet, [taskid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Company .");
  }
});

//updating the Governance Task
app.put("/taskGovernmentUpdate/api/:taskid", (req, res) => {
  const { taskid } = req.params;
  const { taskdescription, stepid, groupid } = req.body;
  const sqlUpdateTerms =
    "UPDATE governancetask SET taskdescription=$1, stepid=$2, groupid=$3 WHERE taskid = $4";

  db.query(
    sqlUpdateTerms,
    [taskdescription, stepid, groupid, taskid],
    (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while updating the Project Details.");
      }

      res.send("Project Details updated successfully.");
    }
  );
});

/*****************Governance test result APIs******************* */
app.get("/testresultGovernance/api", (req, res) => {
  const sqlGet = "SELECT * FROM governancetestresult";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Governance Test Result.");
    }

    res.send(result.rows);
  });
});

//for deleting the result
app.delete("/testGovernanceresultRemove/:resultid", (req, res) => {
  const { resultid } = req.params;
  const sqlRemove = "DELETE FROM governancetestresult WHERE resultid = $1";

  db.query(sqlRemove, [resultid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Test results.");
    }

    res.send("Test result deleted successfully.");
  });
});

//Adding Test result
app.post("/resultgovernanceAddtest/api", (req, res) => {
  const { taskid, stepid, status, remarks, documentupload } = req.body;
  const sqlInsert =
    "INSERT INTO governancetestresult (taskid, stepid,status,remarks,documentupload) VALUES ($1,$2,$3,$4,$5)";
  const values = [taskid, stepid, status, remarks, documentupload];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Task:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "task inserted successfully" });
    }
  });
});

//For viewing the specific Test result
app.get("/resultGovernanceget/api/:resultid", async (req, res) => {
  try {
    const { resultid } = req.params;
    const sqlGet = "SELECT * FROM governancetestresult WHERE resultid = $1";

    const result = await db.query(sqlGet, [resultid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Result .");
  }
});

//updating the Governance Test resukts
app.put("/resulttestGovernmentUpdate/api/:resultid", (req, res) => {
  const { resultid } = req.params;
  const { taskid, stepid, status, remarks, documentupload } = req.body;
  const sqlUpdateTerms =
    "UPDATE governancetestresult SET taskid=$1, stepid=$2, status=$3, remarks=$4, documentupload=$5 WHERE resultid = $6";

  db.query(
    sqlUpdateTerms,
    [taskid, stepid, status, remarks, documentupload, resultid],
    (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while updating the Test result.");
      }

      res.send("Test Result updated successfully.");
    }
  );
});

/*****************Governance Project details APIs******************* */
//getting the project details
app.get("/projectdetailsget/api", (req, res) => {
  const sqlGet = "SELECT * FROM projectdetails";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Project Details.");
    }

    res.send(result.rows);
  });
});

//for deleting the Project details
app.delete("/deleteprojectdetails/:srno", (req, res) => {
  const { srno } = req.params;
  const sqlRemove = "DELETE FROM projectdetails WHERE srno = $1";

  db.query(sqlRemove, [srno], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Project Details.");
    }

    res.send("Project Details deleted successfully.");
  });
});

//Adding Project Details
app.post("/detailsaddproject/api", (req, res) => {
  const {
    projectid,
    phaseid,
    taskid,
    stepid,
    projectpoint,
    projectmethod,
    examples,
  } = req.body;
  const sqlInsert =
    "INSERT INTO projectdetails (projectid, phaseid,taskid,stepid,projectpoint,projectmethod,examples) VALUES ($1,$2,$3,$4,$5,$6,$7)";
  const values = [
    projectid,
    phaseid,
    taskid,
    stepid,
    projectpoint,
    projectmethod,
    examples,
  ];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Project Details:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res
        .status(200)
        .json({ message: "Project Details inserted successfully" });
    }
  });
});

//For viewing the project Details
app.get("/projectdetailsget/api/:srno", async (req, res) => {
  try {
    const { srno } = req.params;
    const sqlGet = "SELECT * FROM projectdetails WHERE srno = $1";

    const result = await db.query(sqlGet, [srno]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Details .");
  }
});

//updating the Project Details
app.put("/detailsupdateproject/api/:srno", (req, res) => {
  const { srno } = req.params;
  const {
    projectid,
    phaseid,
    taskid,
    stepid,
    projectpoint,
    projectmethod,
    examples,
  } = req.body;
  const sqlUpdateTerms =
    "UPDATE projectdetails SET projectid=$1, phaseid=$2, taskid=$3, stepid=$4, projectpoint=$5,projectmethod=$6,examples=$7 WHERE srno = $8";

  db.query(
    sqlUpdateTerms,
    [
      projectid,
      phaseid,
      taskid,
      stepid,
      projectpoint,
      projectmethod,
      examples,
      srno,
    ],
    (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while updating the Project Details.");
      }

      res.send("Project Details updated successfully.");
    }
  );
});

//For viewing the company name from project Details
app.get("/projectdetails/get/api/:projectid", async (req, res) => {
  try {
    const { projectid } = req.params;
    const sqlGet =
      "SELECT company.companyname FROM projectdetails JOIN project ON projectdetails.projectid = project.projectid JOIN company ON project.companyid = company.companyid WHERE projectdetails.projectid = $1";

    const result = await db.query(sqlGet, [projectid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Details .");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
