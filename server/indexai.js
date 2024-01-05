const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const pg = require("pg");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Pool({
  user: "postgres",
  host: "34.71.87.187",
  database: "airegulation_dev",
  password: "India@5555",
  port: 5432,
});
// const db = new pg.Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "termset",
//   password: "crud",
//   port: 5432,
// });

app.get("/node-api/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM ai.termset";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

app.post("/node-api/api/post", (req, res) => {
  const { termsetname } = req.body;
  const sqlInsert = "INSERT INTO ai.termset (termsetname) VALUES ($1)"; // Use $1 for parameterized query
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

app.post("/node-api/api/post/term/:termsetid", (req, res) => {
  const { termname } = req.body;
  const { termsetid } = req.params;
  const sqlInsert = "INSERT INTO ai.term (termname, termsetid) VALUES ($1, $2)";
  db.query(sqlInsert, [termname, termsetid], (error, result) => {
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ message: "Term inserted successfully" });
    }
  });
});

app.delete("/node-api/api/remove/:termsetid", (req, res) => {
  const { termsetid } = req.params;
  const sqlCheckTerms =
    "SELECT COUNT(*) AS termCount FROM ai.term WHERE termsetid = $1";
  const sqlRemove = "DELETE FROM ai.termset WHERE termsetid = $1";

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

app.delete("/node-api/api/remove/term/:termid", (req, res) => {
  const { termid } = req.params;
  const sqlRemove = "DELETE FROM ai.term WHERE termid = $1";

  db.query(sqlRemove, [termid], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("An error occurred while deleting the term.");
    }

    res.send("Term deleted successfully.");
  });
});

app.get("/node-api/api/get/:termsetid", async (req, res) => {
  try {
    const { termsetid } = req.params;
    const sqlGet = "SELECT * FROM ai.termset WHERE termsetid = $1";

    const result = await db.query(sqlGet, [termsetid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the term set.");
  }
});

app.get("/node-api/api/get/term/:termsetid", (req, res) => {
  const { termsetid } = req.params;
  const sqlGet = "SELECT * FROM ai.term WHERE termsetid = $1";

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

app.get("/node-api/api/get/term/:termid/:termsetid", (req, res) => {
  const { termid, termsetid } = req.params;
  const sqlGet = "SELECT * FROM ai.term WHERE termid = $1 AND termsetid = $2";

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

app.put("/node-api/api/update/:termsetid", (req, res) => {
  const { termsetid } = req.params;
  const { termsetname } = req.body;
  const sqlUpdate =
    "UPDATE ai.termset SET termsetname = $1 WHERE termsetid = $2";

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

app.put("/node-api/api/update/term/:termid/:termsetid", (req, res) => {
  const { termid, termsetid } = req.params;
  const { termname } = req.body;
  const sqlUpdateTerms =
    "UPDATE ai.term SET termname = $1 WHERE termid = $2 AND termsetid = $3";

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
app.get("/node-api/get/api/projectphase", (req, res) => {
  const sqlGet = "SELECT * FROM ai.projectphase";
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
app.delete("/node-api/remove/api/projectphase/:phaseid", (req, res) => {
  const { phaseid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS phaseCount FROM ai.projectphase WHERE phaseid = $1";
  const sqlRemove = "DELETE FROM ai.projectphase WHERE phaseid = $1";

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
app.get("/node-api/get/api/projectphase/:phaseid", async (req, res) => {
  try {
    const { phaseid } = req.params;
    const sqlGet = "SELECT * FROM ai.projectphase WHERE phaseid = $1";

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
app.post("/node-api/post/api/projectphase", (req, res) => {
  const { phasename, description } = req.body;
  const sqlInsert =
    "INSERT INTO ai.projectphase (phasename,description) VALUES ($1,$2)"; // Use $1 for parameterized query
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
app.put("/node-api/update/api/projectphase/:phaseid", (req, res) => {
  const { phaseid } = req.params;
  const { phasename, description } = req.body;
  const sqlUpdate =
    "UPDATE ai.projectphase SET phasename = $1, description = $2 WHERE phaseid = $3";

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
/*****************Governance Sub-Control APIs*********************************************** */

//for getting the Governance Sub-Control
app.get("/node-api/getGovernancesubcontrol/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.governancesubcontrol";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
//for deleting the Governance Sub-Control
app.delete(
  "/node-api/removeGovernancesubcontrol/api/:subcontrolid",
  (req, res) => {
    const { subcontrolid } = req.params;
    const sqlCheckPhase =
      "SELECT COUNT(*) AS stepCount FROM ai.governancesubcontrol WHERE subcontrolid = $1";
    const sqlRemove =
      "DELETE FROM ai.governancesubcontrol WHERE subcontrolid = $1";

    db.query(sqlCheckPhase, [subcontrolid], (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while checking Governance Sub-Controls.");
      }

      const stepCount = result.rows[0].stepCount;

      if (stepCount > 0) {
        return res
          .status(400)
          .send(
            "Cannot delete Govenance subcontrol with associated subcontrols."
          );
      }

      db.query(sqlRemove, [subcontrolid], (error, result) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .send("An error occurred while deleting Governance Sub-Controls.");
        }

        res.send("subcontrols deleted successfully.");
      });
    });
  }
);

//For viewing the specific Governance Sub-Control
app.get(
  "/node-api/getGovernancesubcontrol/api/:subcontrolid",
  async (req, res) => {
    try {
      const { subcontrolid } = req.params;
      const sqlGet =
        "SELECT * FROM ai.governancesubcontrol WHERE subcontrolid = $1";

      const result = await db.query(sqlGet, [subcontrolid]);

      res.send(result.rows);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send("An error occurred while fetching the Governance Sub-Control .");
    }
  }
);

//Adding Governance Sub-Control
app.post("/node-api/add/Governancesubcontrol/api", (req, res) => {
  const { subcontrolname, subcontrolwt, evidence } = req.body;
  const sqlInsert =
    "INSERT INTO ai.governancesubcontrol (subcontrolname,subcontrolwt,evidence) VALUES ($1,$2,$3)"; // Use $1 for parameterized query
  const values = [subcontrolname, subcontrolwt, evidence];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Governance Sub-Control:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "subcontrol inserted successfully" });
    }
  });
});

//for editing the Governance Sub-Control
app.put(
  "/node-api/updateGovernancesubcontrol/api/:subcontrolid",
  (req, res) => {
    const { subcontrolid } = req.params;
    const { subcontrolname, subcontrolwt, evidence } = req.body;
    const sqlUpdate =
      "UPDATE ai.governancesubcontrol SET subcontrolname = $1, evidence = $2,subcontrolwt=$3 WHERE subcontrolid = $4";

    db.query(
      sqlUpdate,
      [subcontrolname, subcontrolwt, evidence, subcontrolid],
      (error, result) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .send(
              "An error occurred while updating the Governance Sub-Control."
            );
        }

        res.send("Governance Sub-Control updated successfully.");
      }
    );
  }
);

/*****************Governance Group APIs*********************************************** */

//for getting the Governance Group
app.get("/node-api/GovernanceGroupget/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.governancegroup";
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
app.delete("/node-api/GovernanceGroupremove/api/:groupid", (req, res) => {
  const { groupid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS groupCount FROM ai.governancegroup WHERE groupid = $1";
  const sqlRemove = "DELETE FROM ai.governancegroup WHERE groupid = $1";

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
app.get("/node-api/GovernanceGroupget/api/:groupid", async (req, res) => {
  try {
    const { groupid } = req.params;
    const sqlGet = "SELECT * FROM ai.governancegroup WHERE groupid = $1";

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
app.post("/node-api/GovernanceGroupadd/api", (req, res) => {
  const { groupname } = req.body;
  const sqlInsert = "INSERT INTO ai.governancegroup (groupname) VALUES ($1)"; // Use $1 for parameterized query
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
app.put("/node-api/GovernanceGroupupdate/api/:groupid", (req, res) => {
  const { groupid } = req.params;
  const { groupname } = req.body;
  const sqlUpdate =
    "UPDATE ai.governancegroup SET groupname = $1 WHERE groupid = $2";

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
app.get("/node-api/companyget/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.company";
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
app.delete("/node-api/companyremove/api/:companyid", (req, res) => {
  const { companyid } = req.params;
  const sqlCheckPhase =
    "SELECT COUNT(*) AS companyCount FROM ai.company WHERE companyid = $1";
  const sqlRemove = "DELETE FROM ai.company WHERE companyid = $1";

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
app.get("/node-api/companyget/api/:companyid", async (req, res) => {
  try {
    const { companyid } = req.params;
    const sqlGet = "SELECT * FROM ai.company WHERE companyid = $1";

    const result = await db.query(sqlGet, [companyid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Company .");
  }
});

//Adding Company
app.post("/node-api/companyadd/api", (req, res) => {
  const { companyname, contactname, contactemail, contactphone } = req.body;
  const sqlInsert =
    "INSERT INTO ai.company (companyname,contactname,contactemail,contactphone) VALUES ($1,$2,$3,$4)";
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
app.put("/node-api/updatecompany/api/:companyid", (req, res) => {
  const { companyid } = req.params;
  const { companyname, contactname, contactemail, contactphone } = req.body;
  const sqlUpdate =
    "UPDATE ai.company SET companyname=$1,contactname=$2,contactemail=$3,contactphone=$4 WHERE companyid = $5";

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
app.post("/node-api/projectadd/api/:companyid", (req, res) => {
  const {
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    fromdate,
    todate,
    projecttype,
  } = req.body;
  const { companyid } = req.params;
  const sqlInsert = `INSERT INTO ai.project ( projectname,
      responsibilitygroup,
      responsibilitycenter,
      fromdate,
      todate,
      projecttype, companyid) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
  db.query(
    sqlInsert,
    [
      projectname,
      responsibilitygroup,
      responsibilitycenter,
      fromdate,
      todate,
      projecttype,
      companyid,
    ],
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
app.delete("/node-api/projectRemove/:projectid", (req, res) => {
  const { projectid } = req.params;
  const sqlRemove = "DELETE FROM ai.project WHERE projectid = $1";

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
app.get("/node-api/projectgetapi", (req, res) => {
  const sqlGet = "SELECT * FROM ai.project ";

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
// for viewing the list of Projects using companyid
app.get("/node-api/projectgetApi/:companyid", (req, res) => {
  const { companyid } = req.params;
  const sqlGet = "SELECT * FROM ai.project WHERE companyid = $1";

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
app.get("/node-api/projectApiGet/:projectid/:companyid", (req, res) => {
  const { projectid, companyid } = req.params;
  const sqlGet =
    "SELECT * FROM ai.project WHERE projectid = $1 AND companyid = $2";

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
/**************************************** */
app.get("/node-api/specificproject/:projectid", (req, res) => {
  const { projectid } = req.params;
  const sqlGet = "SELECT * FROM ai.project WHERE projectid = $1 ";

  db.query(sqlGet, [projectid], (error, result) => {
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
/**********For Viewing the Name of the project with Project id************ */
app.get("/node-api/namespecificproject/:projectid", (req, res) => {
  const { projectid } = req.params;
  const sqlGet = "SELECT projectname FROM ai.project WHERE projectid = $1 ";

  db.query(sqlGet, [projectid], (error, result) => {
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
app.put("/node-api/projectUpdate/api/:projectid/:companyid", (req, res) => {
  const { projectid, companyid } = req.params;
  const {
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    fromdate,
    todate,
    projecttype,
  } = req.body;
  const sqlUpdateTerms =
    "UPDATE ai.project SET projectname=$1,responsibilitygroup=$2,responsibilitycenter=$3,fromdate=$4,todate=$5,projecttype=$6 WHERE projectid = $7 AND companyid = $8";

  db.query(
    sqlUpdateTerms,
    [
      projectname,
      responsibilitygroup,
      responsibilitycenter,
      fromdate,
      todate,
      projecttype,
      projectid,
      companyid,
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

/*****************Governance control APIs******************* */
app.get("/node-api/controlGovernance/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.governancecontrol";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Governance control.");
    }

    res.send(result.rows);
  });
});

//for deleting the control
app.delete("/node-api/controlGovernanceRemove/:controlid", (req, res) => {
  const { controlid } = req.params;
  const sqlRemove = "DELETE FROM ai.governancecontrol WHERE controlid = $1";

  db.query(sqlRemove, [controlid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Project Details.");
    }

    res.send("Project details deleted successfully.");
  });
});

//Adding control
app.post("/node-api/governanceAddcontrol/api", (req, res) => {
  const { controlname, subcontrolid, groupid, thrustarea, controlwt } =
    req.body;
  const sqlInsert =
    "INSERT INTO ai.governancecontrol (controlname, subcontrolid, groupid,thrustarea,controlwt) VALUES ($1,$2,$3,$4,$5)";
  const values = [controlname, subcontrolid, groupid, thrustarea, controlwt];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting control:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "control inserted successfully" });
    }
  });
});

//For viewing the specific control
app.get("/node-api/controlGovernanceget/api/:controlid", async (req, res) => {
  try {
    const { controlid } = req.params;
    const sqlGet = "SELECT * FROM ai.governancecontrol WHERE controlid = $1";

    const result = await db.query(sqlGet, [controlid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Company .");
  }
});

//updating the Governance control
app.put("/node-api/controlGovernanceUpdate/api/:controlid", (req, res) => {
  const { controlid } = req.params;
  const { controlname, subcontrolid, groupid, thrustarea, controlwt } =
    req.body;
  const sqlUpdateTerms =
    "UPDATE ai.governancecontrol SET controlname=$1, subcontrolid=$2, groupid=$3,thrustarea=$4 controlwt=$5 WHERE controlid = $6";

  db.query(
    sqlUpdateTerms,
    [controlname, subcontrolid, groupid, thrustarea, controlid, controlwt],
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
// app.get(
//   "/node-api/testresultGovernance/api/:evidencereferencelink",
//   (req, res) => {
//     const { evidencereferencelink } = req.params;
//     const sqlGet =
//       "SELECT * FROM governancetestresult WHERE evidencereferencelink=$1";

//     db.query(sqlGet, [evidencereferencelink], (error, result) => {
//       if (error) {
//         console.error(error);
//         return res
//           .status(500)
//           .send("An error occurred while fetching the Governance Test Result.");
//       }

//       res.send(result.rows);
//     });
//   }
// );

//for deleting the result
app.delete("/node-api/testGovernanceresultRemove/:resultid", (req, res) => {
  const { resultid } = req.params;
  const sqlRemove = "DELETE FROM ai.governancetestresult WHERE resultid = $1";

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
app.post(
  "/node-api/resultgovernanceAddtest/api/:auditid/:companyid",
  (req, res) => {
    const {
      controlid,
      subcontrolid,
      status,
      remarks,
      documentupload,
      governancegroup,
      referencelink,
      score,
      weight,
      thrustarea,
    } = req.body;
    const { auditid, companyid } = req.params;
    const sqlInsert =
      "INSERT INTO ai.governancetestresult (controlid, subcontrolid,status,remarks,documentupload,auditid,governancegroup,referencelink,score,weight,thrustarea,companyid) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)";
    const values = [
      controlid,
      subcontrolid,
      status,
      remarks,
      documentupload,
      auditid,
      governancegroup,
      referencelink,
      score,
      weight,
      thrustarea,
      companyid,
    ];

    db.query(sqlInsert, values, (error, result) => {
      if (error) {
        console.error("Error inserting Test Result:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ message: "Test result inserted successfully" });
      }
    });
  }
);

//For viewing the specific Test result
app.get("/node-api/resultGovernanceget/api/:resultid", async (req, res) => {
  try {
    const { resultid } = req.params;
    const sqlGet = "SELECT * FROM ai.governancetestresult WHERE resultid = $1 ";

    const result = await db.query(sqlGet, [resultid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Result .");
  }
});

//updating the Governance Test resukts
app.put("/node-api/resulttestGovernanceUpdate/api/:resultid", (req, res) => {
  const { resultid } = req.params;
  const {
    auditreferencelink,
    auditremark,
    auditupload,
    auditstatus,
    auditscore,
  } = req.body;
  const sqlUpdateTerms =
    "UPDATE ai.governancetestresult SET  auditreferencelink=$1, auditremark=$2, auditupload=$3, auditstatus=$4, auditscore=$5  WHERE resultid=$6";

  db.query(
    sqlUpdateTerms,
    [
      auditreferencelink,
      auditremark,
      auditupload,
      auditstatus,
      auditscore,
      resultid,
    ],
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
app.get("/node-api/projectdetailsget/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.projectdetails";

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
app.delete("/node-api/deleteprojectdetails/:srno", (req, res) => {
  const { srno } = req.params;
  const sqlRemove = "DELETE FROM ai.projectdetails WHERE srno = $1";

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
app.post("/node-api/detailsaddproject/api", (req, res) => {
  const {
    projectid,
    phaseid,
    controlid,
    subcontrolid,
    projectpoint,
    projectmethod,
    examples,
  } = req.body;
  const sqlInsert =
    "INSERT INTO ai.projectdetails (projectid, phaseid,controlid,subcontrolid,projectpoint,projectmethod,examples) VALUES ($1,$2,$3,$4,$5,$6,$7)";
  const values = [
    projectid,
    phaseid,
    controlid,
    subcontrolid,
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
app.get("/node-api/projectdetailsget/api/:srno", async (req, res) => {
  try {
    const { srno } = req.params;
    const sqlGet = "SELECT * FROM ai.projectdetails WHERE srno = $1";

    const result = await db.query(sqlGet, [srno]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Details .");
  }
});

//updating the Project Details
app.put("/node-api/detailsupdateproject/api/:srno", (req, res) => {
  const { srno } = req.params;
  const {
    projectid,
    phaseid,
    controlid,
    subcontrolid,
    projectpoint,
    projectmethod,
    examples,
  } = req.body;
  const sqlUpdateTerms =
    "UPDATE ai.projectdetails SET projectid=$1, phaseid=$2, controlid=$3, subcontrolid=$4, projectpoint=$5,projectmethod=$6,examples=$7 WHERE srno = $8";

  db.query(
    sqlUpdateTerms,
    [
      projectid,
      phaseid,
      controlid,
      subcontrolid,
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
app.get("/node-api/projectdetails/get/api/:projectid", async (req, res) => {
  try {
    const { projectid } = req.params;
    const sqlGet =
      "SELECT company.companyname FROM ai.projectdetails JOIN project ON projectdetails.projectid = project.projectid JOIN company ON project.companyid = company.companyid WHERE projectdetails.projectid = $1";

    const result = await db.query(sqlGet, [projectid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Details .");
  }
});
/**********Governance Audit APIs******************* */

/**********Get Audit api************ */
app.get("/node-api/audit/api/:resultid", (req, res) => {
  const { resultid } = req.params;
  const sqlGet = "SELECT * FROM ai.projectaudit where resultid=$1";

  db.query(sqlGet, [resultid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Project Audit Details.");
    }

    res.send(result.rows);
  });
});
/*********************get all the audits********** */
app.get("/node-api/getaudit/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.projectaudit ";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Project Audit Details.");
    }

    res.send(result.rows);
  });
});

//for deleting the  project Audit
app.delete("/node-api/removeauditapi/:auditid", (req, res) => {
  const { auditid } = req.params;
  const sqlRemove = "DELETE FROM ai.projectaudit WHERE auditid = $1";

  db.query(sqlRemove, [auditid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Project Audit.");
    }

    res.send("Project Audit deleted successfully.");
  });
});

//Adding Project Audit
app.post(
  "/node-api/addprojectaudit/api/:projectid/:companyid/:resultid",
  (req, res) => {
    const { projectname, auditors, auditees, auditscope, auditdate } = req.body;
    const { projectid, companyid, resultid } = req.params;
    const sqlInsert =
      "INSERT INTO ai.projectaudit (projectname, auditors, auditees, auditscope, auditdate,projectid, companyid,resultid ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)";
    const values = [
      projectname,
      auditors,
      auditees,
      auditscope,
      auditdate,
      projectid,
      companyid,
      resultid,
    ];

    db.query(sqlInsert, values, (error, result) => {
      if (error) {
        console.error("Error inserting control:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ message: "Audit inserted successfully" });
      }
    });
  }
);
/***************************Adding an Audit Independently************ */

app.post("/node-api/directaddprojectaudit/api", (req, res) => {
  const {
    projectname,
    auditors,
    auditees,
    auditscope,
    auditdate,
    projectid,
    companyid,
  } = req.body;
  const sqlInsert =
    "INSERT INTO ai.projectaudit (projectname, auditors, auditees, auditscope, auditdate,projectid, companyid ) VALUES ($1,$2,$3,$4,$5,$6,$7)";
  const values = [
    projectname,
    auditors,
    auditees,
    auditscope,
    auditdate,
    projectid,
    companyid,
  ];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting control:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Audit inserted successfully" });
    }
  });
});

//For viewing the specific governance audit associated with project
app.get("/node-api/specificaudit/api/:auditid", async (req, res) => {
  try {
    const { auditid } = req.params;
    const sqlGet = "SELECT * FROM ai.projectaudit WHERE  auditid=$1";

    const result = await db.query(sqlGet, [auditid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Audit.");
  }
});
//get specific audit from projectid
app.get("/node-api/audit/api/:projectid", async (req, res) => {
  try {
    const { projectid } = req.params;
    const sqlGet = "SELECT * FROM ai.projectaudit WHERE  projectid=$1";

    const result = await db.query(sqlGet, [projectid]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Audit.");
  }
});
//updating the Governance Audit
app.put("/node-api/updateprojectaudit/api/:auditid", (req, res) => {
  const { auditid } = req.params;
  const { projectname, auditors, auditees, auditscope, auditdate } = req.body;
  const sqlUpdateTerms =
    "UPDATE ai.projectaudit SET  projectname=$1, auditors=$2, auditees=$3, auditscope=$4, auditdate=$5 WHERE auditid = $6";

  db.query(
    sqlUpdateTerms,
    [projectname, auditors, auditees, auditscope, auditdate, auditid],
    (error, result) => {
      if (error) {
        console.error(error);
        return res
          .status(500)
          .send("An error occurred while updating the Project Audit.");
      }

      res.send("Project Audit updated successfully.");
    }
  );
});

app.get("/node-api/getprojectnames/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.project";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Project Audit Details.");
    }

    res.send(result.rows);
  });
});
/*****************ThrustArea API********************* */
//to get all the Thrust area
app.get("/node-api/thrustarea/api", (req, res) => {
  const sqlGet = "SELECT * FROM ai.thrustarea";

  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Thrust area.");
    }

    res.send(result.rows);
  });
});
//specific thrust

app.get("/node-api/specificthrustarea/api/:thrustid", (req, res) => {
  const { thrustid } = req.params;
  const sqlGet = "SELECT * FROM ai.thrustarea WHERE thrustid = $1";

  db.query(sqlGet, [thrustid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Thrust area.");
    }

    res.send(result.rows);
  });
});

//for deleting the  Thrust area
app.delete("/node-api/removethrustarea/:thrustid", (req, res) => {
  const { thrustid } = req.params;
  const sqlRemove = "DELETE FROM ai.thrustarea WHERE thrustid = $1";

  db.query(sqlRemove, [thrustid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Project Audit.");
    }

    res.send("Project Audit deleted successfully.");
  });
});

//Adding Project Thrust area
app.post("/node-api/addthrustarea/api", (req, res) => {
  const { thrustarea } = req.body;
  const sqlInsert = "INSERT INTO ai.thrustarea (thrustarea) VALUES ($1)";
  const values = [thrustarea];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting control:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Thrust area inserted successfully" });
    }
  });
});

//updating the Thrust areas
app.put("/node-api/thrustareaupdate/api/:thrustid", (req, res) => {
  const { thrustid } = req.params;
  const { thrustarea } = req.body;
  const sqlUpdateTerms =
    "UPDATE ai.thrustarea SET  thrustarea=$1 WHERE thrustid = $2";

  db.query(sqlUpdateTerms, [thrustarea, thrustid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while updating the Thrust Area.");
    }

    res.send("Thrust Area updated successfully.");
  });
});

app.get("/node-api/projectWithCompany/:projectid", (req, res) => {
  const { projectid } = req.params;

  const sqlGet =
    "SELECT project.*, company.* FROM ai.project JOIN company ON project.companyid = company.companyid WHERE project.projectid = $1";

  db.query(sqlGet, [projectid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching project details.");
    }

    const projectWithCompany = result.rows[0];
    if (!projectWithCompany) {
      return res.status(404).send("Project not found.");
    }

    res.json(projectWithCompany);
  });
});

/********************Evidence API***********************************/

/***Get Evidence by reference link******* */

app.get("/node-api/getEvidence/:resultid", (req, res) => {
  const { resultid } = req.params;
  const sqlGet = "SELECT * FROM ai.governancetestresult where resultid=$1";

  db.query(sqlGet, [resultid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Evidence.");
    }

    res.send(result.rows);
  });
});

/**********Delete An Evidence************ */
app.delete("/node-api/evidenceremove/:resultid", (req, res) => {
  const { resultid } = req.params;
  const sqlRemove = "DELETE FROM ai.governancetestresult WHERE resultid = $1";

  db.query(sqlRemove, [resultid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while deleting the Evidence.");
    }

    res.send("Project Evidence deleted successfully.");
  });
});

/********Get Evidence with projectid************** */
app.get("/node-api/getEvidences/:projectid/:companyid", (req, res) => {
  const { projectid, companyid } = req.params;
  const sqlGet =
    "SELECT * FROM ai.governancetestresult where projectid=$1 AND companyid =$2";

  db.query(sqlGet, [projectid, companyid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Thrust area.");
    }

    res.send(result.rows);
  });
});
/********Get Evidence with Company ID************** */
app.get("/node-api/getCompanyEvidence/:companyid", (req, res) => {
  const { companyid } = req.params;
  const sqlGet = "SELECT * FROM ai.governancetestresult where companyid=$1";

  db.query(sqlGet, [companyid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Thrust area.");
    }

    res.send(result.rows);
  });
});
/********Insert Evidence********** */
app.post("/node-api/evidence/:projectid/:companyid", async (req, res) => {
  const { projectid, companyid } = req.params;
  const {
    groupid,
    groupname,
    thrustid,
    thrustarea,
    controlid,
    controlname,
    controlwt,
    subcontrolid,
    subcontrolname,
    subcontrolwt,
    evidence,
    // object,
    // objecttype,
    evidencereferencelink,
    evidenceremark,
    evidenceupload,
    evidencestatus,
    companyname,
    projectname,
    responsibilitycenter,
    responsibilitygroup,
    logindate,
  } = req.body;

  try {
    const sqlAdd = `
      INSERT INTO ai.governancetestresult (
        companyid, projectid, groupid, groupname, thrustid, thrustarea,
        controlid, controlname, controlwt, subcontrolid, subcontrolname,
        subcontrolwt,evidence, evidencereferencelink, evidenceremark, evidenceupload, evidencestatus,companyname,
        projectname,
        responsibilitycenter,
        responsibilitygroup,logindate
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,$17,$18,$19,$20,$21,$22)
    `;

    const values = [
      companyid,
      projectid,
      groupid,
      groupname,
      thrustid,
      thrustarea,
      controlid,
      controlname,
      controlwt,
      subcontrolid,
      subcontrolname,
      subcontrolwt,
      evidence,
      // object,
      //objecttype,
      evidencereferencelink,
      evidenceremark,
      evidenceupload,
      evidencestatus,
      companyname,
      projectname,
      responsibilitycenter,
      responsibilitygroup,
      logindate,
    ];

    const result = await db.query(sqlAdd, values);

    res.status(200).json({ message: "Evidence inserted successfully" });
  } catch (error) {
    console.error("Error inserting Evidence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
/************Edit Evidence********* */
app.put("/node-api/evidenceEdit/:resultid", async (req, res) => {
  const { resultid } = req.params;
  const {
    groupid,
    groupname,
    thrustid,
    thrustarea,
    controlid,
    controlname,
    controlwt,
    subcontrolid,
    subcontrolname,
    subcontrolwt,
    evidence,
    // object,
    // objecttype,
    evidencereferencelink,
    evidenceremark,
    evidenceupload,
    evidencestatus,
  } = req.body;

  try {
    const sqlUpdate = `
      UPDATE ai.governancetestresult
      SET
        groupid = $1,
        groupname = $2,
        thrustid = $3,
        thrustarea = $4,
        controlid = $5,
        controlname = $6,
        controlwt = $7,
        subcontrolid = $8,
        subcontrolname = $9,
        subcontrolwt = $10,
        evidence=$11,
        evidencereferencelink = $12,
        evidenceremark = $13,
        evidenceupload = $14,
        evidencestatus = $15
      WHERE resultid = $16
    `;

    const values = [
      groupid,
      groupname,
      thrustid,
      thrustarea,
      controlid,
      controlname,
      controlwt,
      subcontrolid,
      subcontrolname,
      subcontrolwt,
      evidence,
      //object,
      //objecttype,
      evidencereferencelink,
      evidenceremark,
      evidenceupload,
      evidencestatus,
      resultid,
    ];

    const result = await db.query(sqlUpdate, values);

    res.status(200).json({ message: "Evidence updated successfully" });
  } catch (error) {
    console.error("Error updating Evidence:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/************Get Assesment With REsultid************************** */

app.get("/node-api/getassessment/:resultid", (req, res) => {
  const { resultid } = req.params;
  const sqlGet =
    "SELECT  assessmentreferencelink, assessmentremark, assessmentupload, assessmentstatus, assessmentscore,resultid FROM ai.governancetestresult Where resultid=$1";

  db.query(sqlGet, [resultid], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Thrust area.");
    }

    res.send(result.rows);
  });
});

/******Adding the assessments*************** */
app.post("/node-api/addassessment/:companyid/:projectid", async (req, res) => {
  const { companyid, projectid } = req.params;
  const {
    groupid,
    groupname,
    thrustid,
    thrustarea,
    controlid,
    controlname,
    controlwt,
    subcontrolid,
    subcontrolname,
    subcontrolwt,
    evidencereferencelink,
    evidenceremark,
    evidenceupload,
    evidencestatus,
    assessmentreferencelink,
    assessmentremark,
    assessmentupload,
    assessmentstatus,
    assessmentscore,
  } = req.body;
  try {
    const sqlAddAssessment = `INSERT INTO ai.governancetestresult (
      companyid, projectid, groupid, groupname, thrustid, thrustarea,
      controlid, controlname, controlwt, subcontrolid, subcontrolname,
      subcontrolwt, evidencereferencelink, evidenceremark, evidenceupload, evidencestatus,
      assessmentreferencelink,
      assessmentremark,
      assessmentupload,
      assessmentstatus,
      assessmentscore
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,$17,$18,$19,$20,$21)`;
    const values = [
      companyid,
      projectid,
      groupid,
      groupname,
      thrustid,
      thrustarea,
      controlid,
      controlname,
      controlwt,
      subcontrolid,
      subcontrolname,
      subcontrolwt,
      evidencereferencelink,
      evidenceremark,
      evidenceupload,
      evidencestatus,
      assessmentreferencelink,
      assessmentremark,
      assessmentupload,
      assessmentstatus,
      assessmentscore,
    ];

    const result = await db.query(sqlAddAssessment, values);

    res.status(200).json({ message: "Assessment data inserted successfully" });
  } catch (error) {
    console.error("Error inserting Assessment data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*****************Audit Details************************ */
app.put("/node-api/addaudit/:resultid", async (req, res) => {
  const { resultid } = req.params;
  const {
    auditreferencelink,
    auditremark,
    auditupload,
    auditstatus,
    auditscore,
  } = req.body;
  try {
    const sqlAddAssessment =
      "UPDATE ai.governancetestresult SET  auditreferencelink=$1, auditremark=$2, auditupload=$3, auditstatus=$4, auditscore=$5  WHERE resultid=$6";

    const values = [
      auditreferencelink,
      auditremark,
      auditupload,
      auditstatus,
      auditscore,
      resultid,
    ];

    const result = await db.query(sqlAddAssessment, values);

    res.status(200).json({ message: "Assessment data inserted successfully" });
  } catch (error) {
    console.error("Error inserting Assessment data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*------------------------------------------------------Algorithm Inventory-----------------------------------------------------------------------------------*/
/***************add responsibilitynameid Responsibility_Center Table******************/

app.get("/node-api/api/getresponsibilitycenter", (req, res) => {
  const sqlGet = "SELECT * from ai.responsibility_center";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.get("/node-api/api/in", (req, res) => {
  const sqlGet = "SELECT * from ai.responsibility_group";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.get("/node-api/api/algorithminventoryget", (req, res) => {
  const sqlGet = "SELECT * from ai.algorithm_inventory";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the Thrust area.");
    }

    res.send(result.rows);
  });
});

app.post("/node-api/api/algorithminventorypost", (req, res) => {
  // Destructure the data from the request body
  const {
    organization,
    responsibilitygroup,
    responsibilitycenter,
    algorithminventorydate,
    project,
    projectcode,
    algorithminventorytime,
    algorithm,
    algorithmremark,
    dataset,
    dataremark,
    codevulnerability,
    codevulnerabilityremark,
    privacydata,
    privacydataremark,
    algorithmbias,
    databias,
    codevulnerabilitybias,
    privacydatabias,
    algorithmtestoutputurl,
    datasettestoutputurl,
    codevulnerabilitytestoutputurl,
    privacytestoutputurl,
    datasetstatus,
    algorithmstatus,
    codevulnerabilitystatus,
    privacydatastatus,
    explanability,
    transparency,
    fairness,
    ethics,
    robustness,
    reliability,
    codename,
    algorithmversiondate,
    datasetversiondate,
    codevulnerabilityversiondate,
    privacyversiondate,
    bias,
    security,
    algorithmversionno,
    datasetversionno,
    codevulnerabilityversionno,
    privacyversionno,
    robustnessremark,
    explanabilityremark,
    transparencyremark,
    fairnessremark,
    biasremark,
    ethicsremark,
    reliabilityremark,
    securityremark,
    performance,
    accountability,
    privacy,
    privacyremark,
    performanceremark,
    accountabilityremark,
    assessmentremark,
    assessmentfile,
    assessmentdate,
    auditremark,
    auditfile,
    auditdate,
  } = req.body;

  // Define the SQL query for inserting data into the database
  const sqlInsert = `
  INSERT INTO ai.algorithm_inventory(
      organization,
      responsibilitygroup,
      responsibilitycenter,
      algorithminventorydate,
      project,
      projectcode,
      algorithminventorytime,
      algorithm,
      algorithmremark,
      dataset,
      dataremark,
      codevulnerability,
      codevulnerabilityremark,
      privacydata, 
      privacydataremark,
      algorithmbias,
      databias, 
      codevulnerabilitybias,
      privacydatabias,
      algorithmtestoutputurl,
      datasettestoutputurl,
      codevulnerabilitytestoutputurl,
      privacytestoutputurl,
      datasetstatus,
      algorithmstatus,
    codevulnerabilitystatus,
     privacydatastatus,
     explanability,
   transparency,
   fairness,
   ethics,
   robustness,
   reliability,
   codename,
   algorithmversiondate,
   datasetversiondate,
  codevulnerabilityversiondate,
  privacyversiondate,
  bias,
  security,
  algorithmversionno,
  datasetversionno,
  codevulnerabilityversionno,
  privacyversionno,
  robustnessremark,
  explanabilityremark,
  transparencyremark,
  fairnessremark,
  biasremark, 
  ethicsremark,
  reliabilityremark,
  securityremark,
  performance,
  accountability,
  privacy,
  privacyremark,
  performanceremark,
  accountabilityremark,
  assessmentremark,
  assessmentfile,
  assessmentdate,
  auditremark,
  auditfile,
  auditdate
   ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
       $18, $19, $20, $21, $22, $23, $24, $25 ,$26, $27 ,$28 ,$29, $30, $31, $32, $33 ,$34,
       $35 ,$36, $37, $38, $39, $40, $41, $42, $43, $44 ,$45, $46, $47, $48,
       $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64        )`;

  // Define an array of values to be inserted into the database
  const values = [
    organization,
    responsibilitygroup,
    responsibilitycenter,
    algorithminventorydate,
    project,
    projectcode,
    algorithminventorytime,
    algorithm,
    algorithmremark,
    dataset,
    dataremark,
    codevulnerability,
    codevulnerabilityremark,
    privacydata,
    privacydataremark,
    algorithmbias,
    databias,
    codevulnerabilitybias,
    privacydatabias,
    algorithmtestoutputurl,
    datasettestoutputurl,
    codevulnerabilitytestoutputurl,
    privacytestoutputurl,
    datasetstatus,
    algorithmstatus,
    codevulnerabilitystatus,
    privacydatastatus,
    explanability,
    transparency,
    fairness,
    ethics,
    robustness,
    reliability,
    codename,
    algorithmversiondate,
    datasetversiondate,
    codevulnerabilityversiondate,
    privacyversiondate,
    bias,
    security,
    algorithmversionno,
    datasetversionno,
    codevulnerabilityversionno,
    privacyversionno,
    robustnessremark,
    explanabilityremark,
    transparencyremark,
    fairnessremark,
    biasremark,
    ethicsremark,
    reliabilityremark,
    securityremark,
    performance,
    accountability,
    privacy,
    privacyremark,
    performanceremark,
    accountabilityremark,
    assessmentremark,
    assessmentfile,
    assessmentdate,
    auditremark,
    auditfile,
    auditdate,
  ];

  // Execute the SQL query and handle the result
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting risk", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.log("Successfully inserted risk:", result); // Log the result
      res.status(200).json({ message: "Risk inserted successfully" });
    }
  });
});

app.delete(
  "/node-api/api/algorithminventorydelete/:algorithminventoryid",
  async (req, res) => {
    const { algorithminventoryid } = req.params;

    try {
      const sqlDelete =
        "DELETE FROM ai.algorithm_inventory WHERE algorithminventoryid = $1"; // Use the correct column name, assuming it's 'riskid'.
      await db.query(sqlDelete, [algorithminventoryid]);

      res.json({ message: "Risk deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the Risk" });
    }
  }
);

app.get(
  "/node-api/api/algorithminventoryget/:projectcode",
  async (req, res) => {
    try {
      const { projectcode } = req.params;
      const sqlGet =
        "SELECT * FROM ai.algorithm_inventory WHERE projectcode=$1";
      const result = await db.query(sqlGet, [projectcode]);
      res.send(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("an error occurred while fectching the Risk");
    }
  }
);

app.put(
  "/node-api/api/algorithminventoryupdate/:algorithminventoryid",
  async (req, res) => {
    try {
      const { algorithminventoryid } = req.params;
      const {
        organization,
        responsibilitygroup,
        responsibilitycenter,
        algorithminventorydate,
        project,
        projectcode,
        algorithminventorytime,
        algorithm,
        algorithmremark,
        dataset,
        dataremark,
        codevulnerability,
        codevulnerabilityremark,
        privacydata,
        privacydataremark,
        algorithmbias,
        databias,
        codevulnerabilitybias,
        privacydatabias,
        algorithmtestoutputurl,
        datasettestoutputurl,
        codevulnerabilitytestoutputurl,
        privacytestoutputurl,
        datasetstatus,
        algorithmstatus,
        codevulnerabilitystatus,
        privacydatastatus,
        explanability,
        transparency,
        fairness,
        ethics,
        robustness,
        reliability,
        codename,
        algorithmversiondate,
        datasetversiondate,
        codevulnerabilityversiondate,
        privacyversiondate,
        bias,
        security,
        algorithmversionno,
        datasetversionno,
        codevulnerabilityversionno,
        privacyversionno,
        robustnessremark,
        explanabilityremark,
        transparencyremark,
        fairnessremark,
        biasremark,
        ethicsremark,
        reliabilityremark,
        securityremark,
        performance,
        accountability,
        privacy,
        privacyremark,
        performanceremark,
        accountabilityremark,
        assessmentremark,
        assessmentfile,
        assessmentdate,
        auditremark,
        auditfile,
        auditdate,
      } = req.body;

      const sqlUpdate = `
          UPDATE ai.algorithm_inventory
          SET
          organization=$1,
          responsibilitygroup=$2,
          responsibilitycenter=$3,
          algorithminventorydate=$4,
          project=$5,
          projectcode=$6,
          algorithminventorytime=$7,
          algorithm=$8,
          algorithmremark=$9,
          dataset=$10,
          dataremark=$11,
          codevulnerability=$12,
          codevulnerabilityremark=$13,
          privacydata=$14,
          privacydataremark=$15,
          algorithmbias=$16,
          databias=$17,
          codevulnerabilitybias=$18,
          privacydatabias=$19,
          algorithmtestoutputurl=$20,
          datasettestoutputurl=$21,
          codevulnerabilitytestoutputurl=$22,
          privacytestoutputurl=$23,
          datasetstatus=$24,
          algorithmstatus=$25,
          codevulnerabilitystatus=$26,
          privacydatastatus=$27,
          explanability=$28,
          transparency=$29,
          fairness=$30,
          ethics=$31,
          robustness=$32,
          reliability=$33,
          codename=$34,
          algorithmversiondate=$35,
          datasetversiondate=$36,
          codevulnerabilityversiondate=$37,
          privacyversiondate=$38,
          bias=$39,
          security=$40,
          algorithmversionno=$41,
          datasetversionno=$42,
          codevulnerabilityversionno=$43,
          privacyversionno=$44,
          robustnessremark=$45,
          explanabilityremark=$46,
          transparencyremark=$47,
          fairnessremark=$48,
          biasremark=$49, 
          ethicsremark=$50,
          reliabilityremark=$51,
          securityremark=$52,
          performance=$53,
          accountability=$54,
          privacy=$55,
          privacyremark=$56,
          performanceremark=$57,
          accountabilityremark=$58,
          assessmentremark=$59,
          assessmentfile=$60,
          assessmentdate=$61,
          auditremark=$62,
          auditfile=$63,
          auditdate=$64
          WHERE algorithminventoryid = $65`;

      const result = await db.query(sqlUpdate, [
        organization,
        responsibilitygroup,
        responsibilitycenter,
        algorithminventorydate,
        project,
        projectcode,
        algorithminventorytime,
        algorithm,
        algorithmremark,
        dataset,
        dataremark,
        codevulnerability,
        codevulnerabilityremark,
        privacydata,
        privacydataremark,
        algorithmbias,
        databias,
        codevulnerabilitybias,
        privacydatabias,
        algorithmtestoutputurl,
        datasettestoutputurl,
        codevulnerabilitytestoutputurl,
        privacytestoutputurl,
        datasetstatus,
        algorithmstatus,
        codevulnerabilitystatus,
        privacydatastatus,
        explanability,
        transparency,
        fairness,
        ethics,
        robustness,
        reliability,
        codename,
        algorithmversiondate,
        datasetversiondate,
        codevulnerabilityversiondate,
        privacyversiondate,
        bias,
        security,
        algorithmversionno,
        datasetversionno,
        codevulnerabilityversionno,
        privacyversionno,
        robustnessremark,
        explanabilityremark,
        transparencyremark,
        fairnessremark,
        biasremark,
        ethicsremark,
        reliabilityremark,
        securityremark,
        performance,
        accountability,
        privacy,
        privacyremark,
        performanceremark,
        accountabilityremark,
        assessmentremark,
        assessmentfile,
        assessmentdate,
        auditremark,
        auditfile,
        auditdate,
        algorithminventoryid,
      ]);

      if (result.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Risk not found or not updated." });
      }

      res.json({ message: "Risk updated successfully" });
    } catch (error) {
      console.error("Error updating risk:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the Risk" });
    }
  }
);

/*******************Object******* */
app.get("/node-api/api/getObjecttype", (req, res) => {
  const sqlGet = "SELECT * from ai.p_object_type";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

/************************* */
app.get("/node-api/api/getObjectname", (req, res) => {
  const sqlGet = "SELECT * from ai.p_object_name";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
/**********AglorithmInventory Graph******************* */
app.get(
  "/node-api/api/algorithminventoryget/graph/:projectcode",
  (req, res) => {
    const { projectcode } = req.params;
    const sqlGet =
      "SELECT reliability, privacy, bias, security, performance, robustness, transparency, fairness, accountability, ethics, explanability FROM ai.algorithm_inventory WHERE projectcode = $1";

    db.query(sqlGet, [projectcode], (error, result) => {
      if (error) {
        console.error("Error executing SQL query:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!result || !result.rows) {
        console.error("Empty or undefined result received from the database");
        return res.status(404).json({ error: "Not Found" });
      }

      res.json(result.rows);
    });
  }
);
/****************************************** */
const PORT = process.env.PORT || 5011;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
