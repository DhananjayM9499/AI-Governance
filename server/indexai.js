const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const xlsx = require("xlsx");
const { exec } = require("child_process");
const pg = require("pg");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { Sequelize, DataTypes } = require("sequelize");
//Multer middleware for file upload
const upload = multer({ dest: "uploads/" });
const db = new pg.Pool({
  user: "postgres",
  host: "34.71.87.187",
  database: "airegulation_dev",
  password: "India@5555",
  port: 5432,
});
// const JWT_SECRET = "Hjkl2345Olkj0987Ooiuyhjnb0987Nbvcty12fgh675redf23";
// const db = new pg.Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "termset",
//   password: "crud",
//   port: 5432,
// });

/******USER AUTH******************* */
// const sequelize = new Sequelize("airegulation_dev", "postgres", "India@5555", {
//   host: "34.71.87.187",
//   dialect: "postgres",
// });

// const Customer = sequelize.define(
//   "Customer",
//   {
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: "customer", // Use the existing table name
//     timestamps: false, // Disable timestamps if they are not present in the existing table
//   }
// );

// // Sync database (no need to sync in this case since the table already exists)
// // sequelize.sync();

// // Signup route
// app.post("/signup", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newCustomer = await Customer.create({
//       email,
//       password: hashedPassword,
//     });
//     res.status(201).send("Customer created");
//   } catch (err) {
//     console.error(err);
//     res.status(400).send("Error creating customer");
//   }
// });

// // Login route
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const customer = await Customer.findOne({ where: { email } });
//     if (!customer) {
//       return res.status(400).send("Customer not found");
//     }
//     const isMatch = await bcrypt.compare(password, customer.password);
//     if (!isMatch) {
//       return res.status(400).send("Invalid credentials");
//     }
//     const token = jwt.sign({ customerId: customer.id }, JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     res.json({ token });
//   } catch (err) {
//     console.error(err);
//     res.status(400).send("Error logging in");
//   }
// });

// // Protected route example
// app.get("/protected", (req, res) => {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(401).send("Access denied");
//   }
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     res.send("Protected data");
//   } catch (err) {
//     res.status(401).send("Invalid token");
//   }
// });

/******************************* */
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
//for getting the Distinct Thrust Area
app.get("/node-api/getGovernancethrustarea/api", (req, res) => {
  const sqlGet = "SELECT DISTINCT thrustarea FROM ai.governancecontrol";
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

/**************Get Governance Sub control by Group name*************************** */
app.get("/node-api/getGroupnamesubcontrol/api", (req, res) => {
  const { groupname } = req.query;
  const sqlGet =
    "SELECT DISTINCT thrustarea FROM ai.governancecontrol  WHERE groupname=$1";
  db.query(sqlGet, [groupname], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});

/***********************Get Governance Sub control by Thrust area********************************* */
app.get("/node-api/getthrustsubcontrol/api", (req, res) => {
  const { thrustarea } = req.query;
  const sqlGet = "SELECT * FROM ai.governancecontrol  WHERE thrustarea=$1";
  db.query(sqlGet, [thrustarea], (error, result) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(result.rows);
    }
  });
});
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
/************************************** */
app.get("/node-api/getdistinctcompany/api", (req, res) => {
  const sqlGet = "SELECT DISTINCT organization FROM ai.company";
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
  const { organization, contactname, contactemail, contactphone } = req.body;
  const sqlInsert =
    "INSERT INTO ai.company (organization,contactname,contactemail,contactphone) VALUES ($1,$2,$3,$4)";
  const values = [organization, contactname, contactemail, contactphone];

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
  const { organization, contactname, contactemail, contactphone } = req.body;
  const sqlUpdate =
    "UPDATE ai.company SET organization=$1,contactname=$2,contactemail=$3,contactphone=$4 WHERE companyid = $5";

  db.query(
    sqlUpdate,
    [organization, contactname, contactemail, contactphone, companyid],
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
/******************************************** */
app.get("/node-api/getdistinctproject", (req, res) => {
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
  const sqlUpdateTerms = `UPDATE ai.project SET projectname=$1,responsibilitygroup=$2,responsibilitycenter=$3,fromdate=$4,todate=$5,projecttype=$6
     WHERE projectid = $7 AND companyid = $8`;

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
  const sqlGet = "SELECT DISTINCT * FROM ai.governancecontrol";

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
  const { controlname, subcontrolname, groupname, thrustarea, controlwt } =
    req.body;
  const sqlInsert =
    "INSERT INTO ai.governancecontrol (controlname, subcontrolname, groupname,thrustarea,controlwt) VALUES ($1,$2,$3,$4,$5)";
  const values = [
    controlname,
    subcontrolname,
    groupname,
    thrustarea,
    controlwt,
  ];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting control:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "control inserted successfully" });
    }
  });
});

/**********Excel Loaded Data******************* */
app.post("/node-api/loadExcel/api", (req, res) => {
  const data = req.body; // Assuming req.body is an array of objects containing Excel data

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  const sqlInsert =
    "INSERT INTO ai.governancecontrol (controlname, subcontrolname, groupname, thrustarea, controlwt) VALUES ($1, $2, $3, $4, $5)";

  // Use Promise.all to execute all insert queries asynchronously
  Promise.all(
    data.map((row) => {
      const { controlname, subcontrolname, groupname, thrustarea, controlwt } =
        row;
      const values = [
        controlname,
        subcontrolname,
        groupname,
        thrustarea,
        controlwt,
      ];
      return new Promise((resolve, reject) => {
        db.query(sqlInsert, values, (error, result) => {
          if (error) {
            console.error("Error inserting control:", error);
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    })
  )
    .then(() => {
      res.status(200).json({ message: "Controls inserted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error" });
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
/*********************** */
app.get("/node-api/frameworkstandaards/api/:groupname", async (req, res) => {
  try {
    const { groupname } = req.params;
    const sqlGet = "SELECT * FROM ai.governancecontrol WHERE groupname = $1";

    const result = await db.query(sqlGet, [groupname]);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Company .");
  }
});

/****************** */
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
/********************************** */

app.get("/node-api/resultGovernanceget/api", (req, res) => {
  const sqlGet = "SELECT * from ai.governancetestresult";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      // Check if result is defined and has 'rows' property
      if (result && result.rows) {
        res.json(result.rows);
      } else {
        res.status(500).json({ error: "Unexpected result format" });
      }
    }
  });
});

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
app.get("/node-api/specificGovernanceget/api/:resultid", async (req, res) => {
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
      "SELECT company.organization FROM ai.projectdetails JOIN project ON projectdetails.projectid = project.projectid JOIN company ON project.companyid = company.companyid WHERE projectdetails.projectid = $1";

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
  const { thrustarea, groupname } = req.body;
  const sqlInsert =
    "INSERT INTO ai.thrustarea (thrustarea,groupname) VALUES ($1,$2)";
  const values = [thrustarea, groupname];

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
  const { thrustarea, groupname } = req.body;
  const sqlUpdateTerms =
    "UPDATE ai.thrustarea SET  thrustarea=$1, groupname=$2 WHERE thrustid = $3";

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
    //subcontrolid,
    subcontrolname,
    subcontrolwt,
    evidence,
    // object,
    // objecttype,
    evidencereferencelink,
    evidenceremark,
    evidenceupload,
    evidencestatus,
    organization,
    projectname,
    responsibilitycenter,
    responsibilitygroup,
    logindate,
  } = req.body;

  try {
    const sqlAdd = `
      INSERT INTO ai.governancetestresult (
        companyid, projectid, groupid, groupname, thrustid, thrustarea,
        controlid, controlname, controlwt, subcontrolname,
        subcontrolwt,evidence, evidencereferencelink, evidenceremark, evidenceupload, evidencestatus,organization,
        projectname,
        responsibilitycenter,
        responsibilitygroup,logindate
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,$17,$18,$19,$20,$21)
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
      // subcontrolid,
      subcontrolname,
      subcontrolwt,
      evidence,
      // object,
      //objecttype,
      evidencereferencelink,
      evidenceremark,
      evidenceupload,
      evidencestatus,
      organization,
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
/*************Algorithm Inventory****************** */
app.get("/node-api/api/algorithminventoryget", (req, res) => {
  const sqlGet = "SELECT  * from ai.algorithm_inventory";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the ALGORITHM INVENTORY.");
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
    projectname,
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
    severity,
    datasetname,
    objecttype,
    object,
    themename,
    vendorname,
    technologyname,
    environment,
    environmenttype,
    resilience,
    resilienceremark,
  } = req.body;

  // Define the SQL query for inserting data into the database
  const sqlInsert = `
  INSERT INTO ai.algorithm_inventory(
      organization,
      responsibilitygroup,
      responsibilitycenter,
      algorithminventorydate,
      projectname,
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
  severity,
  datasetname,
  objecttype,
    object,
    themename,
    vendorname,
    technologyname,
    environment,
    environmenttype,
    resilience,
    resilienceremark
   ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
       $18, $19, $20, $21, $22, $23, $24, $25 ,$26, $27 ,$28 ,$29, $30, $31, $32, $33 ,$34,
       $35 ,$36, $37, $38, $39, $40, $41, $42, $43, $44 ,$45, $46, $47, $48,
       $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64 ,$65,$66,$67,$68, $69 ,$70,$71,$72,$73,$74,$75 )`;

  // Define an array of values to be inserted into the database
  const values = [
    organization,
    responsibilitygroup,
    responsibilitycenter,
    algorithminventorydate,
    projectname,
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
    severity,
    datasetname,
    objecttype,
    object,
    themename,
    vendorname,
    technologyname,
    environment,
    environmenttype,
    resilience,
    resilienceremark,
  ];

  // Execute the SQL query and handle the result
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("Error inserting Algorithm Inventory", error);
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
app.get(
  "/node-api/api/algorithminventorygetid/:algorithminventoryid",
  async (req, res) => {
    try {
      const { algorithminventoryid } = req.params;
      const sqlGet =
        "SELECT * FROM ai.algorithm_inventory WHERE algorithminventoryid=$1";
      const result = await db.query(sqlGet, [algorithminventoryid]);
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
        projectname,
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
        severity,
        datasetname,
        objecttype,
        object,
        themename,
        vendorname,
        technologyname,
        environment,
        environmenttype,
        resilience,
        resilienceremark,
      } = req.body;

      const sqlUpdate = `
          UPDATE ai.algorithm_inventory
          SET
          organization=$1,
          responsibilitygroup=$2,
          responsibilitycenter=$3,
          algorithminventorydate=$4,
          projectname=$5,
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
          auditdate=$64,
          severity=$65,
          datasetname=$66,
          objecttype=$67,
    object=$68,
    themename=$69,
    vendorname=$70,
            technologyname=$71,
            environment=$72,
            environmenttype=$73,resilience=$74,
            resilienceremark=$75
          WHERE algorithminventoryid = $76`;

      const result = await db.query(sqlUpdate, [
        organization,
        responsibilitygroup,
        responsibilitycenter,
        algorithminventorydate,
        projectname,
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
        severity,
        datasetname,
        objecttype,
        object,
        themename,
        vendorname,
        technologyname,
        environment,
        environmenttype,
        resilience,
        resilienceremark,
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

/***************************** */
app.get("/node-api/api/Objectname", (req, res) => {
  const sqlGet = "SELECT DISTINCT objectcode from ai.p_object_name";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
/**********AglorithmInventory Graph******************* */
app.get("/node-api/api/algorithminventorygetcode/:projectcode", (req, res) => {
  const { projectcode } = req.params;

  const sqlGet =
    "SELECT DISTINCT organization,responsibilitygroup,responsibilitycenter,objecttype,object,projectname,projectcode,codename,assessmentdate,auditdate,algorithminventoryid FROM ai.algorithm_inventory WHERE projectcode=$1";
  db.query(sqlGet, [projectcode], (error, result) => {
    if (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching the ALGORITHM INVENTORY.");
    }

    res.send(result.rows);
  });
});
/********************* */
app.get(
  "/node-api/api/algorithminventoryget/graph/:projectcode",
  (req, res) => {
    const { projectcode } = req.params;
    const sqlGet =
      "SELECT reliability, privacy, bias, security, performance, robustness, transparency, fairness, accountability, ethics, explanability, resilience FROM ai.algorithm_inventory WHERE projectcode = $1";

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
/**************Data Lineage**************************** */
app.get("/node-api/api/datalineageget", (req, res) => {
  const sqlGet = "SELECT * from ai.datalineage";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      // Check if result is defined and has 'rows' property
      if (result && result.rows) {
        res.json(result.rows);
      } else {
        res.status(500).json({ error: "Unexpected result format" });
      }
    }
  });
});

app.post("/node-api/datalineagepost/api", (req, res) => {
  console.log(req.body); // Log the request body to inspect the data

  const evidences = req.body.evidenceData;

  // Check if 'evidenceData' is present and is an array
  if (!Array.isArray(evidences)) {
    return res.status(400).json({
      error: "Invalid or missing 'evidenceData' property in the request body",
    });
  }

  const sqlInsert =
    "INSERT INTO ai.datalineage (organization, projectname, responsibilitygroup, responsibilitycenter, objecttype, objectcode, evidencereferencelink, evidenceremark, evidenceupload, evidencestatus, controlname, subcontrolname, thrustarea) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";

  evidences.forEach((evidence) => {
    const {
      organization,
      projectname,
      responsibilitygroup,
      responsibilitycenter,
      objecttype,
      objectcode,
      evidencereferencelink,
      evidenceremark,
      evidenceupload,
      evidencestatus,
      controlname,
      subcontrolname,
      thrustarea,
    } = evidence;

    const values = [
      organization,
      projectname,
      responsibilitygroup,
      responsibilitycenter,
      objecttype,
      objectcode,
      evidencereferencelink,
      evidenceremark,
      evidenceupload,
      evidencestatus,
      controlname,
      subcontrolname,
      thrustarea,
    ];

    db.query(sqlInsert, values, (error, result) => {
      if (error) {
        console.error("Error inserting evidence:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
  });

  res.status(200).json({ message: "Evidence inserted successfully" });
});

app.delete("/node-api/api/datalineagedelete/:datalineageid", (req, res) => {
  const { datalineageid } = req.params;
  const sqlRemove = "Delete from ai.datalineage where datalineageid=$1";
  db.query(sqlRemove, [datalineageid], (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send("an error occurred while deleting Responsibility Center");
    }
    res.send("term deleted successfully");
  });
});

app.get("/node-api/api/datalineageget/:datalineageid", async (req, res) => {
  try {
    const { datalineageid } = req.params;
    const sqlGet = "SELECT * FROM ai.datalineage WHERE datalineageid=$1";
    const result = await db.query(sqlGet, [datalineageid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching the responsibility center");
  }
});

app.put("/node-api/api/datalineageupdate/:datalineageid", (req, res) => {
  const { datalineageid } = req.params;
  const {
    organization,
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    objecttype,
    objectcode,
    evidencereferencelink,
    evidenceremark,
    evidenceupload,
    evidencestatus,
    controlname,
    subcontrolname,
    thrustarea,
  } = req.body;

  const sqlUpdate = ` UPDATE ai.datalineage  SET 
  organization= $1,
  projectname= $2,
  responsibilitygroup= $3,
  responsibilitycenter= $4,
  objecttype= $5,
  objectcode= $6,
  evidencereferencelink= $7,
  evidenceremark= $8,
  evidenceupload= $9,
  evidencestatus= $10,
  controlname= $11,
  subcontrolname= $12,
  thrustarea = $13
  WHERE datalineageid = $14`;

  db.query(
    sqlUpdate,
    [
      organization,
      projectname,
      responsibilitygroup,
      responsibilitycenter,
      objecttype,
      objectcode,
      evidencereferencelink,
      evidenceremark,
      evidenceupload,
      evidencestatus,
      controlname,
      subcontrolname,
      thrustarea,
      datalineageid,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating object type", error);
        return res
          .status(500)
          .send("An error occurred while updating the Responsibility Center");
      }
      res.send("Responsibility Center updated successfully");
    }
  );
});
/********************** */
app.get("/node-api/api/companyprojectget", async (req, res) => {
  try {
    console.log("Request received");
    const { projectname } = req.query;

    console.log("projectname:", projectname);

    const sqlGet = `
      SELECT * FROM ai.governancetestresult
      WHERE projectname = $1;
    `;

    const result = await db.query(sqlGet, [projectname]);
    console.log("Result:", result.rows);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the data");
  }
});

/*******************Risk Severity*********************** */
app.get("/node-api/api/riskseverityget", (req, res) => {
  const sqlGet = "SELECT * from ai.risk_severity";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

/*************************************** */

/*-------------------------------Theme Master-------------------------------------------------*/

app.get("/node-api/api/thememasterget", (req, res) => {
  const sqlGet = "SELECT * from ai.thememaster";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/thememasterpost", (req, res) => {
  const { themecode, themename } = req.body;
  const sqlInsert =
    "INSERT INTO ai.thememaster (themecode,themename) values($1, $2)";
  const values = [themecode, themename];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting thememaster", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: "thememaster inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/thememasterdelete/:thememasterid", (req, res) => {
  const { thememasterid } = req.params;
  const sqlRemove = "Delete from ai.thememaster where thememasterid=$1";
  db.query(sqlRemove, [thememasterid], (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send("an error occurred while deleting thememaster");
    }
    res.send("thememaster deleted successfully");
  });
});

app.get("/node-api/api/thememasterget/:thememasterid", async (req, res) => {
  try {
    const { thememasterid } = req.params;
    const sqlGet = "SELECT * FROM ai.thememaster WHERE thememasterid=$1";
    const result = await db.query(sqlGet, [thememasterid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching thethememaster");
  }
});

app.put("/node-api/api/thememasterupdate/:thememasterid", (req, res) => {
  const { thememasterid } = req.params;
  const { themecode, themename } = req.body;

  const sqlUpdate =
    "UPDATE ai.thememaster SET themecode=$1,themename=$2 WHERE thememasterid=$3";
  db.query(
    sqlUpdate,
    [themecode, themename, thememasterid],
    (error, result) => {
      if (error) {
        console.error("error inserting object type", error);
        return res
          .status(500)
          .send("an error occurred while updating the object type");
      }
      res.send("object type updated sucessfully");
    }
  );
});

/*-------------------------------Activity Group-------------------------------------------------*/

app.get("/node-api/api/activitygroupget", (req, res) => {
  const sqlGet = "SELECT * from ai.activitygroup";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/activitygrouppost", (req, res) => {
  const { groupactivity, theme, phase } = req.body;
  const sqlInsert =
    "INSERT INTO ai.activitygroup (groupactivity,theme,phase) values($1, $2 ,$3)";
  const values = [groupactivity, theme, phase];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting activity group", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: "activity group inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/activitygroupdelete/:activitygroupid", (req, res) => {
  const { activitygroupid } = req.params;
  const sqlRemove = "Delete from ai.activitygroup where activitygroupid=$1";
  db.query(sqlRemove, [activitygroupid], (error, result) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .send("an error occurred while deleting activity group");
    }
    res.send("activity group deleted successfully");
  });
});

app.get("/node-api/api/activitygroupget/:activitygroupid", async (req, res) => {
  try {
    const { activitygroupid } = req.params;
    const sqlGet = "SELECT * FROM ai.activitygroup WHERE activitygroupid=$1";
    const result = await db.query(sqlGet, [activitygroupid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching activity group");
  }
});

app.put("/node-api/api/activitygroupupdate/:activitygroupid", (req, res) => {
  const { activitygroupid } = req.params;
  const { groupactivity, theme, phase } = req.body;

  const sqlUpdate =
    "UPDATE ai.activitygroup SET groupactivity=$1,theme=$2 ,phase=$3 WHERE activitygroupid=$4";
  db.query(
    sqlUpdate,
    [groupactivity, theme, phase, activitygroupid],
    (error, result) => {
      if (error) {
        console.error("error inserting object type", error);
        return res.status(500).send("an error occurred while updating ");
      }
      res.send(" updated sucessfully");
    }
  );
});

/*-----------------------------------Theme Activity---------------------------------------*/

app.get("/node-api/api/themeactivityget", (req, res) => {
  const sqlGet = "SELECT * from ai.themeactivity";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});
/*************Distict Theme********************* */
app.get("/node-api/api/getthemeactivity", (req, res) => {
  try {
    const sqlGet = "SELECT DISTINCT themename from ai.themeactivity";
    db.query(sqlGet, (error, result) => {
      res.json(result.rows);
    });
  } catch (e) {
    console.log("Error in reading the properties");
  }
});

/*************Distict Phase********************* */

app.get("/node-api/api/getphaseactivity/:themename", async (req, res) => {
  try {
    const { themename } = req.params;
    const sqlGetPhase = "SELECT * FROM ai.themeactivity WHERE themename = $1";
    const result = await db.query(sqlGetPhase, [themename]);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while fetching phase for the theme.");
  }
});

app.post("/node-api/api/themeactivitypost", (req, res) => {
  const { theme, phase, activitygroup, activity } = req.body;
  const sqlInsert =
    "INSERT INTO ai.themeactivity (themename,phase,activitygroup,activity) values($1, $2 ,$3 ,$4)";
  const values = [theme, phase, activitygroup, activity];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/themeactivitydelete/:themeactivityid", (req, res) => {
  const { themeactivityid } = req.params;
  const sqlRemove = "Delete from ai.themeactivity where themeactivityid=$1";
  db.query(sqlRemove, [themeactivityid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/themeactivityget/:themeactivityid", async (req, res) => {
  try {
    const { themeactivityid } = req.params;
    const sqlGet = "SELECT * FROM ai.themeactivity WHERE themeactivityid=$1";
    const result = await db.query(sqlGet, [themeactivityid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

/*******************Theme Activity by theme*********************** */
app.get("/node-api/api/themeactivity/:themename", async (req, res) => {
  try {
    const { themename } = req.params;
    const sqlGet = "SELECT * FROM ai.themeactivity WHERE themename=$1";
    const result = await db.query(sqlGet, [themename]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

/************************************************ */
app.put("/node-api/api/themeactivityupdate/:themeactivityid", (req, res) => {
  const { themeactivityid } = req.params;
  const { theme, phase, activitygroup, activity } = req.body;

  const sqlUpdate =
    "UPDATE ai.themeactivity SET themename=$1, phase=$2, activitygroup=$3, activity=$4 WHERE themeactivityid=$5";
  db.query(
    sqlUpdate,
    [theme, phase, activitygroup, activity, themeactivityid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/*-----------------------------------Vendor Master---------------------------------------*/

app.get("/node-api/api/vendormasterget", (req, res) => {
  const sqlGet = "SELECT * from ai.vendormaster";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/vendormasterpost", (req, res) => {
  const { vendorname, vendorcontact, vendoremail, stakeholdertype, category } =
    req.body;
  const sqlInsert =
    "INSERT INTO ai.vendormaster (vendorname,vendorcontact,vendoremail,stakeholdertype,category) values($1, $2 ,$3,$4,$5)";
  const values = [
    vendorname,
    vendorcontact,
    vendoremail,
    stakeholdertype,
    category,
  ];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/vendormasterdelete/:vendorid", (req, res) => {
  const { vendorid } = req.params;
  const sqlRemove = "Delete from ai.vendormaster where vendorid=$1";
  db.query(sqlRemove, [vendorid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/vendormasterget/:vendorid", async (req, res) => {
  try {
    const { vendorid } = req.params;
    const sqlGet = "SELECT * FROM ai.vendormaster WHERE vendorid=$1";
    const result = await db.query(sqlGet, [vendorid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

app.put("/node-api/api/vendormasterupdate/:vendorid", (req, res) => {
  const { vendorid } = req.params;
  const { vendorname, vendorcontact, vendoremail, stakeholdertype, category } =
    req.body;

  const sqlUpdate = `UPDATE ai.vendormaster SET vendorname=$1,
    vendorcontact= $2,
    vendoremail= $3,
    stakeholdertype=$4,
    category=$5 WHERE vendorid=$6`;
  db.query(
    sqlUpdate,
    [
      vendorname,
      vendorcontact,
      vendoremail,
      stakeholdertype,
      category,
      vendorid,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/*-----------------------------------Technology---------------------------------------*/

app.get("/node-api/api/technologyget", (req, res) => {
  const sqlGet = "SELECT * from ai.technology";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/technologypost", (req, res) => {
  const { technologyname, technologyversion } = req.body;
  const sqlInsert =
    "INSERT INTO ai.technology (technologyname,technologyversion) values($1, $2 )";
  const values = [technologyname, technologyversion];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/technologydelete/:technologymasterid", (req, res) => {
  const { technologymasterid } = req.params;
  const sqlRemove = "Delete from ai.technology where technologymasterid=$1";
  db.query(sqlRemove, [technologymasterid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/technologyget/:technologymasterid", async (req, res) => {
  try {
    const { technologymasterid } = req.params;
    const sqlGet = "SELECT * FROM ai.technology WHERE technologymasterid=$1";
    const result = await db.query(sqlGet, [technologymasterid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

app.put("/node-api/api/technologyupdate/:technologymasterid", (req, res) => {
  const { technologymasterid } = req.params;
  const { technologyname, technologyversion } = req.body;

  const sqlUpdate =
    "UPDATE ai.technology SET technologyname=$1, technologyversion=$2 WHERE technologymasterid=$3";
  db.query(
    sqlUpdate,
    [technologyname, technologyversion, technologymasterid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/*-----------------------------------vulnerability---------------------------------------*/

app.get("/node-api/api/vulnerabilityget", (req, res) => {
  const sqlGet = "SELECT * from ai.vulnerability";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/vulnerabilitypost", (req, res) => {
  const { vulnerabilityname, threat, mitigationstrategy, contigencyplan } =
    req.body;
  const sqlInsert =
    "INSERT INTO ai.vulnerability (vulnerabilityname,threat,mitigationstrategy,contigencyplan) values($1 ,$2, $3, $4)";
  const values = [
    vulnerabilityname,
    threat,
    mitigationstrategy,
    contigencyplan,
  ];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/vulnerabilitydelete/:vulnerabilityid", (req, res) => {
  const { vulnerabilityid } = req.params;
  const sqlRemove = "Delete from ai.vulnerability where vulnerabilityid=$1";
  db.query(sqlRemove, [vulnerabilityid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/vulnerabilityget/:vulnerabilityid", async (req, res) => {
  try {
    const { vulnerabilityid } = req.params;
    const sqlGet = "SELECT * FROM ai.vulnerability WHERE vulnerabilityid=$1";
    const result = await db.query(sqlGet, [vulnerabilityid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

app.put("/node-api/api/vulnerabilityupdate/:vulnerabilityid", (req, res) => {
  const { vulnerabilityid } = req.params;
  const { vulnerabilityname, threat, mitigationstrategy, contigencyplan } =
    req.body;

  const sqlUpdate =
    "UPDATE ai.vulnerability SET vulnerabilityname=$1,threat=$2,mitigationstrategy=$3,contigencyplan=$4 WHERE vulnerabilityid=$5";
  db.query(
    sqlUpdate,
    [
      vulnerabilityname,
      threat,
      mitigationstrategy,
      contigencyplan,
      vulnerabilityid,
    ],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/*-----------------------------------Resource---------------------------------------*/

app.get("/node-api/api/resourceget", (req, res) => {
  const sqlGet = "SELECT * from ai.resourcemaster";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/resourcepost", (req, res) => {
  const { resourcename, designation, status } = req.body;
  const sqlInsert =
    "INSERT INTO ai.resourcemaster (resourcename,designation,status) values($1 ,$2, $3)";
  const values = [resourcename, designation, status];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/resourcedelete/:resourceid", (req, res) => {
  const { resourceid } = req.params;
  const sqlRemove = "Delete from ai.resourcemaster where resourceid=$1";
  db.query(sqlRemove, [resourceid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/resourceget/:resourceid", async (req, res) => {
  try {
    const { resourceid } = req.params;
    const sqlGet = "SELECT * FROM ai.resourcemaster WHERE resourceid=$1";
    const result = await db.query(sqlGet, [resourceid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

app.put("/node-api/api/resourceupdate/:resourceid", (req, res) => {
  const { resourceid } = req.params;
  const { resourcename, designation, status } = req.body;

  const sqlUpdate =
    "UPDATE ai.resourcemaster SET resourcename=$1,designation=$2,status=$3 WHERE resourceid=$4";
  db.query(
    sqlUpdate,
    [resourcename, designation, status, resourceid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});
/*******Allocate Resource********************* */
app.post("/node-api/api/resourceallocation", async (req, res) => {
  // Extract project ID and resource IDs from the request body
  const { projectid, resourceid } = req.body;

  try {
    // Iterate over each resource ID and insert into the database
    for (const resourceId of resourceid) {
      // Execute the INSERT query for each resource ID
      await db.query(
        "INSERT INTO ai.resourceallocation(projectid, resourceid) VALUES ($1, $2)",
        [projectid, resourceId]
      );
    }

    // Send a success response
    res.status(201).json({ message: "Resource allocation successful" });
  } catch (error) {
    // Handle the error appropriately, log it, and send an error response
    console.error("Error allocating resources:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*************Get Allocated Resources**************** */
app.get("/node-api/api/getallocatedresource/:projectid", (req, res) => {
  const { projectid } = req.params;
  const sqlGet =
    "SELECT resourceid from ai.resourceallocation WHERE projectid=$1";
  db.query(sqlGet, [projectid], (error, result) => {
    res.json(result.rows);
  });
});

/********************************************** */
app.delete("/node-api/delete/allocatedresource/:resourceid", (req, res) => {
  const { resourceid } = req.params;
  const sqlDelete = "DELETE * FROM ai.resourceallocation WHERE  resourceid= $1";
  db.query(sqlDelete, [resourceid], (err, data) => {
    if (err) {
      return res.sendStatus(400);
    } else {
      return res.sendStatus(200);
    }
  });
});

/**************GET Resource By Designation**************************** */
app.get("/node-api/api/resourcedesignation/:designation", async (req, res) => {
  try {
    const { designation } = req.params;
    const sqlGet = "SELECT * FROM ai.resourcemaster WHERE designation=$1";
    const result = await db.query(sqlGet, [designation]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
/*************************************** */
app.get("/node-api/api/getresourcedesignation", (req, res) => {
  const sqlGet = "SELECT DISTINCT designation from ai.resourcemaster";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

/************************************ */
app.get("/node-api/api/resourcemaster/:resourceid", async (req, res) => {
  try {
    const resourceid = req.params.resourceid; // Extract resource ID from URL parameters

    // Query the database for resource details using the resource ID
    const queryResult = await db.query(
      "SELECT * FROM ai.resourcemaster WHERE resourceid = $1",
      [resourceid]
    );

    // Check if any resource is found
    if (queryResult.rowCount === 1) {
      res.json(queryResult.rows[0]); // Return the resource details
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    console.error("Error querying database:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/*-------------------------------Governance--------------------------------------------------*/

app.get("/node-api/resultGovernanceget/api/:resultid", async (req, res) => {
  try {
    const { resultid } = req.params;

    const sqlGet = `
        SELECT
          *,
          (SELECT COUNT(*) FROM ai.governancetestresult) AS count_all,
          (SELECT COUNT(organization) FROM ai.governancetestresult) AS count_organization,
          (SELECT COUNT(projectname) FROM ai.governancetestresult) AS count_projectname,
          (SELECT COUNT(evidence) FROM ai.governancetestresult) AS count_evidence,
          (SELECT COUNT(assessment) FROM ai.governancetestresult) AS count_assessment,
          (SELECT COUNT(auditplan) FROM ai.governancetestresult) AS count_auditplan,
          (SELECT COUNT(audit) FROM ai.governancetestresult) AS count_audit
        FROM ai.governancetestresult
        WHERE resultid = $1;
      `;

    const result = await db.query(sqlGet, [resultid]);

    res.json(result.rows[0]); // Assuming you expect a single row as the result
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the Result.");
  }
});
/***************************Data Sets************************************/

app.get("/node-api/api/datasetget", (req, res) => {
  const sqlGet = "SELECT * from ai.dataset";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/datasetpost", (req, res) => {
  const { datasetname, datasetdescription } = req.body;
  const sqlInsert =
    "INSERT INTO ai.dataset(datasetname,datasetdescription) values($1 ,$2)";
  const values = [datasetname, datasetdescription];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " Dataset Inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/datasetdelete/:datasetid", (req, res) => {
  const { datasetid } = req.params;
  const sqlRemove = "Delete from ai.dataset where datasetid=$1";
  db.query(sqlRemove, [datasetid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/dataset/:datasetid", async (req, res) => {
  try {
    const { datasetid } = req.params;
    const sqlGet = "SELECT * FROM ai.dataset WHERE datasetid=$1";
    const result = await db.query(sqlGet, [datasetid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

app.put("/node-api/api/datasetupdate/:datasetid", (req, res) => {
  const { datasetid } = req.params;
  const { datasetname, datasetdescription } = req.body;

  const sqlUpdate =
    "UPDATE ai.dataset SET datasetname=$1, datasetdescription=$2 WHERE datasetid=$3";
  db.query(
    sqlUpdate,
    [datasetname, datasetdescription, datasetid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/************************CheckList***********************************/
/********GEt THE Checklist**************** */
app.get("/node-api/api/checklist", (req, res) => {
  const sqlGet = "SELECT * from ai.checklist";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result && result.rows) {
      res.json(result.rows);
    } else {
      console.error("Unexpected result structure:", result);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
});
/************Insert the Checklist***************** */
app.post("/node-api/api/addchecklist/:algorithminventoryid", (req, res) => {
  // Extract data from the request body
  const { algorithminventoryid } = req.params;
  const {
    organization,
    projectname,
    projectcode,
    responsibilitygroup,
    responsibilitycenter,
    objecttype,
    object,
    codename,
    phase,
    themename,
    activitygroup,
    activity,
    expectedevidence,
    remark,
    percentagecompletion,
    actualevidence,
    status,
    planstartdate,
    planenddate,
    actualstartdate,
    actualenddate,
    activitycode,
    resources,
    stakeholdername,
    designation,
    themesource,

    riskid,
    issueid,
  } = req.body;

  // Define the SQL query with placeholders
  const sqlInsert = `
    INSERT INTO ai.checklist (
      organization, projectname, projectcode, responsibilitygroup, responsibilitycenter,
      objecttype, object, codename, phase, themename, activitygroup, activity,
      expectedevidence, remark, percentagecompletion, actualevidence, status,
      planstartdate, planenddate, actualstartdate, actualenddate, activitycode,resources, stakeholdername,
      designation, algorithminventoryid,themesource, riskid,
      issueid
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23,$24,$25,$26,$27,$28,$29)
  `;

  // Set up an array of parameterized values
  const values = [
    organization,
    projectname,
    projectcode,
    responsibilitygroup,
    responsibilitycenter,
    objecttype,
    object,
    codename,
    phase,
    themename,
    activitygroup,
    activity,
    expectedevidence,
    remark,
    percentagecompletion,
    actualevidence,
    status,
    planstartdate,
    planenddate,
    actualstartdate,
    actualenddate,
    activitycode,
    resources,
    stakeholdername,
    designation,
    algorithminventoryid, // Place it at the correct position
    themesource,
    riskid,
    issueid,
  ];

  // Execute the SQL query
  db.query(sqlInsert, values, (error, result) => {
    // Handle the result or error
    if (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.log("Data inserted successfully");
      res.status(200).json({ message: "Inserted successfully" });
    }
  });
});

/**********List OF the Checklist******************* */
app.get("/node-api/api/checklist/:algorithminventoryid", async (req, res) => {
  try {
    const { algorithminventoryid } = req.params;
    const sqlGet = "SELECT * FROM ai.checklist WHERE algorithminventoryid=$1";
    const result = await db.query(sqlGet, [algorithminventoryid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});
/********Deleting the Checklist*************** */
app.delete("/node-api/api/removechecklist/:checklistid", (req, res) => {
  const { checklistid } = req.params;
  const sqlRemove = "DELETE FROM ai.checklist WHERE checklistid = $1";

  db.query(sqlRemove, [checklistid], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send("An error occurred while deleting the term.");
    }

    res.send("Term deleted successfully.");
  });
});

/***********Score Card API*********************** */
/*Score Card*/

app.get("/node-api/api/scorecard", (req, res) => {
  const {
    groupname,
    organization,
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    objecttype,
    object,
  } = req.query;

  const conditions = [];
  const values = [];

  // Add conditions for each provided parameter
  if (groupname) {
    conditions.push("groupname = $" + (values.length + 1));
    values.push(groupname);
  }
  if (organization) {
    conditions.push("organization = $" + (values.length + 1));
    values.push(organization);
  }
  if (projectname) {
    conditions.push("projectname = $" + (values.length + 1));
    values.push(projectname);
  }
  if (responsibilitygroup) {
    conditions.push("responsibilitygroup = $" + (values.length + 1));
    values.push(responsibilitygroup);
  }
  if (responsibilitycenter) {
    conditions.push("responsibilitycenter = $" + (values.length + 1));
    values.push(responsibilitycenter);
  }
  if (objecttype) {
    conditions.push("objecttype = $" + (values.length + 1));
    values.push(objecttype);
  }
  if (object) {
    conditions.push("object = $" + (values.length + 1));
    values.push(object);
  }

  let sqlQuery = "SELECT * FROM ai.governancetestresult";

  // Add WHERE clause if conditions are provided
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }

  // console.log("Generated SQL query:", sqlQuery); // Log the generated SQL query

  // Execute the SQL query with the provided parameters
  db.query(sqlQuery, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Send the results as JSON
    res.json(results.rows);
  });
});

/******************************************** */
app.get("/node-api/api/governancemultigraph", async (req, res) => {
  try {
    const {
      organization,
      projectname,
      responsibilitygroup,
      responsibilitycenter,
      objecttype,
      object,
    } = req.query;

    const conditions = [];
    const groupBy = []; // Array to store columns for GROUP BY clause
    const values = [];

    // Add conditions for each provided parameter
    if (organization) {
      conditions.push("organization = $" + (values.length + 1));
      values.push(organization);
    }
    if (projectname) {
      conditions.push("projectname = $" + (values.length + 1));
      values.push(projectname);
    }
    if (responsibilitygroup) {
      conditions.push("responsibilitygroup = $" + (values.length + 1));
      values.push(responsibilitygroup);
      groupBy.push("responsibilitygroup"); // Add to GROUP BY clause
    }
    if (responsibilitycenter) {
      conditions.push("responsibilitycenter = $" + (values.length + 1));
      values.push(responsibilitycenter);
      groupBy.push("responsibilitycenter"); // Add to GROUP BY clause
    }
    if (objecttype) {
      conditions.push("objecttype = $" + (values.length + 1));
      values.push(objecttype);
      groupBy.push("objecttype"); // Add to GROUP BY clause
    }
    if (object) {
      conditions.push("object = $" + (values.length + 1));
      values.push(object);
      groupBy.push("object"); // Add to GROUP BY clause
    }

    let sqlQuery = `
            SELECT 
                COUNT(DISTINCT assessmentscore) as assessmentscore_count,
                COUNT(DISTINCT auditscore) as auditscore_count,
                COUNT(DISTINCT evidenceremark) as evidenceremark_count
            FROM ai.governancetestresult`;

    // Add WHERE clause if conditions are provided
    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ");
    }

    // Add GROUP BY clause if there are columns to group by
    if (groupBy.length > 0) {
      sqlQuery += " GROUP BY " + groupBy.join(", ");
    }

    // Execute the SQL query with the provided parameters
    const countResult = await db.query(sqlQuery, values);
    console.log(sqlQuery);
    res.json(countResult.rows); // Assuming the result may contain multiple rows
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the data");
  }
});

/*******************************9 */
app.get("/node-api/api/groupnameget/:groupname", async (req, res) => {
  try {
    console.log("Request received");
    const { groupname } = req.params;

    console.log("groupname:", groupname);

    const sqlGet = `
      SELECT * FROM ai.governancetestresult
      WHERE groupname = $1;
    `;

    const result = await db.query(sqlGet, [groupname]);
    console.log("Result:", result.rows);

    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the data");
  }
});

/******************************************** */

app.get("/node-api/getdatalineage", (req, res) => {
  const {
    organization,
    projectname,
    responsibilitygroup,
    responsibilitycenter,
    objecttype,
    objectcode,
  } = req.query;

  const conditions = [];
  const values = [];

  // Add conditions for each provided parameter
  if (organization) {
    conditions.push("organization = $" + (values.length + 1));
    values.push(organization);
  }
  if (projectname) {
    conditions.push("projectname = $" + (values.length + 1));
    values.push(projectname);
  }
  if (responsibilitygroup) {
    conditions.push("responsibilitygroup = $" + (values.length + 1));
    values.push(responsibilitygroup);
  }
  if (responsibilitycenter) {
    conditions.push("responsibilitycenter = $" + (values.length + 1));
    values.push(responsibilitycenter);
  }
  if (objecttype) {
    conditions.push("objecttype = $" + (values.length + 1));
    values.push(objecttype);
  }
  if (objectcode) {
    conditions.push("objectcode = $" + (values.length + 1));
    values.push(objectcode);
  }

  let sqlQuery = "SELECT * FROM ai.datalineage";

  // Add WHERE clause if conditions are provided
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }

  // console.log("Generated SQL query:", sqlQuery); // Log the generated SQL query

  // Execute the SQL query with the provided parameters
  db.query(sqlQuery, values, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Send the results as JSON
    res.json(results.rows);
  });
});
/********************************************* */

/*Environment*/

app.get("/node-api/api/environmentget", (req, res) => {
  const sqlGet = "SELECT * from ai.environment";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/environmentpost", (req, res) => {
  const { environmentname, environmentdescription } = req.body;
  const sqlInsert =
    "INSERT INTO ai.environment(environmentname,environmentdescription) values($1 ,$2)";
  const values = [environmentname, environmentdescription];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " Dataset Inserted sucessfully" });
    }
  });
});

app.delete("/node-api/api/environmentdelete/:environmentid", (req, res) => {
  const { environmentid } = req.params;
  const sqlRemove = "Delete from ai.environment where environmentid=$1";
  db.query(sqlRemove, [environmentid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/environmentset/:environmentid", async (req, res) => {
  try {
    const { environmentid } = req.params;
    const sqlGet = "SELECT * FROM ai.environment WHERE environmentid=$1";
    const result = await db.query(sqlGet, [environmentid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

app.put("/node-api/api/environmentupdate/:environmentid", (req, res) => {
  const { environmentid } = req.params;
  const { environmentname, environmentdescription } = req.body;

  const sqlUpdate =
    "UPDATE ai.environment SET environmentname=$1, environmentdescription=$2 WHERE environmentid=$3";
  db.query(
    sqlUpdate,
    [environmentname, environmentdescription, environmentid],
    (error, result) => {
      if (error) {
        console.error("Error updating theme activity:", error);
        return res.status(500).send("An error occurred while updating");
      }
      res.send("Updated successfully");
    }
  );
});

/*Environment Type*/

app.get("/node-api/api/environmenttypeget", (req, res) => {
  const sqlGet = "SELECT * from ai.environmenttype";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/environmenttypepost", (req, res) => {
  const { environmenttypename, environmenttypedescription } = req.body;
  const sqlInsert =
    "INSERT INTO ai.environmenttype(environmenttypename,environmenttypedescription) values($1 ,$2)";
  const values = [environmenttypename, environmenttypedescription];
  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error intersting ", error);
      res.status(500).json({ error: "internal server error" });
    } else {
      res.status(200).json({ message: " Dataset Inserted sucessfully" });
    }
  });
});

app.delete(
  "/node-api/api/environmenttypedelete/:environmenttypeid",
  (req, res) => {
    const { environmenttypeid } = req.params;
    const sqlRemove =
      "Delete from ai.environmenttype where environmenttypeid=$1";
    db.query(sqlRemove, [environmenttypeid], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).send("an error occurred while deleting ");
      }
      res.send(" deleted successfully");
    });
  }
);

app.get(
  "/node-api/api/environmenttypeset/:environmenttypeid",
  async (req, res) => {
    try {
      const { environmenttypeid } = req.params;
      const sqlGet =
        "SELECT * FROM ai.environmenttype WHERE environmenttypeid=$1";
      const result = await db.query(sqlGet, [environmenttypeid]);
      res.send(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("an error occurred while fectching ");
    }
  }
);

app.put(
  "/node-api/api/environmenttypeupdate/:environmenttypeid",
  (req, res) => {
    const { environmenttypeid } = req.params;
    const { environmenttypename, environmenttypedescription } = req.body;

    const sqlUpdate =
      "UPDATE ai.environmenttype SET environmenttypename=$1, environmenttypedescription=$2 WHERE environmenttypeid=$3";
    db.query(
      sqlUpdate,
      [environmenttypename, environmenttypedescription, environmenttypeid],
      (error, result) => {
        if (error) {
          console.error("Error updating theme activity:", error);
          return res.status(500).send("An error occurred while updating");
        }
        res.send("Updated successfully");
      }
    );
  }
);

/*********************ISSUE MANAGEMENT******************** */
/*Issue*/

app.get("/node-api/api/issueget", (req, res) => {
  const sqlGet = "SELECT * from ai.issue";
  db.query(sqlGet, (error, result) => {
    res.json(result.rows);
  });
});

app.post("/node-api/api/issuepost/:algorithminventoryid", (req, res) => {
  const {
    codename,
    codingissue,
    dataissue,
    infrastructureissue,
    issuename,
    issuedate,
    modelissue,
    object,
    objecttype,
    organization,
    performanceissue,
    processissue,
    projectname,
    projectcode,
    securityissue,
    resourceissue,
    responsibilitycenter,
    responsibilitygroup,
  } = req.body;
  const { algorithminventoryid } = req.params;
  const sqlInsert =
    "INSERT INTO ai.issue (codename, codingissue, dataissue, infrastructureissue, issuename, issuedate, modelissue, object, objecttype, organization, performanceissue, processissue, projectname, projectcode, securityissue, resourceissue, responsibilitycenter, responsibilitygroup,algorithminventoryid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)";
  const values = [
    codename,
    codingissue,
    dataissue,
    infrastructureissue,
    issuename,
    issuedate,
    modelissue,
    object,
    objecttype,
    organization,
    performanceissue,
    processissue,
    projectname,
    projectcode,
    securityissue,
    resourceissue,
    responsibilitycenter,
    responsibilitygroup,
    algorithminventoryid,
  ];

  db.query(sqlInsert, values, (error, result) => {
    if (error) {
      console.error("error inserting dataset:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Dataset inserted successfully" });
    }
  });
});

/*********************update Issue************************* */

app.delete("/node-api/api/issuedelete/:issueid", (req, res) => {
  const { issueid } = req.params;
  const sqlRemove = "Delete from ai.issue where issueid=$1";
  db.query(sqlRemove, [issueid], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(500).send("an error occurred while deleting ");
    }
    res.send(" deleted successfully");
  });
});

app.get("/node-api/api/issueget/:issueid", async (req, res) => {
  try {
    const { issueid } = req.params;
    const sqlGet = "SELECT * FROM ai.issue WHERE issueid=$1";
    const result = await db.query(sqlGet, [issueid]);
    res.send(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

/********Get Issue By Algorithm Inventory ID**********************9 */
app.get("/node-api/api/issuegetAI/:algorithminventoryid", async (req, res) => {
  try {
    const { algorithminventoryid } = req.params;
    const sqlGet = "SELECT * FROM ai.issue WHERE algorithminventoryid=$1";
    const result = await db.query(sqlGet, [algorithminventoryid]);
    if (result && result.rows) {
      res.json(result.rows);
    } else {
      res.status(500).json({ error: "Unexpected result format" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("an error occurred while fectching ");
  }
});

/***********Update Issue***************************** */
app.put(
  "/node-api/api/issueupdate/:issueid/:algorithminventoryid",
  (req, res) => {
    const { issueid, algorithminventoryid } = req.params;
    const {
      codename,
      codingissue,
      dataissue,
      infrastructureissue,
      issuename,
      issuedate,
      modelissue,
      object,
      objecttype,
      organization,
      performanceissue,
      processissue,
      projectname,
      projectcode,
      securityissue,
      resourceissue,
      responsibilitycenter,
      responsibilitygroup,
    } = req.body;

    const sqlUpdate =
      "UPDATE ai.issue SET codename=$1, codingissue=$2, dataissue=$3, infrastructureissue=$4, issuename=$5, issuedate=$6, modelissue=$7, object=$8, objecttype=$9, organization=$10, performanceissue=$11, processissue=$12, projectname=$13, projectcode=$14, securityissue=$15, resourceissue=$16, responsibilitycenter=$17, responsibilitygroup=$18,algorithminventoryid=$19 WHERE issueid=$20";
    const values = [
      codename,
      codingissue,
      dataissue,
      infrastructureissue,
      issuename,
      issuedate,
      modelissue,
      object,
      objecttype,
      organization,
      performanceissue,
      processissue,
      projectname,
      projectcode,
      securityissue,
      resourceissue,
      responsibilitycenter,
      responsibilitygroup,
      algorithminventoryid,
      issueid,
    ];

    db.query(sqlUpdate, values, (error, result) => {
      if (error) {
        console.error("Error updating dataset:", error);
        res.status(500).send("An error occurred while updating");
      } else {
        res.send("Updated successfully");
      }
    });
  }
);

/*************FILE OPENING************************ */
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(
    __dirname,
    "C:UsersASUSOneDriveDesktopPassionIt_ProjectCapitoltunnelAIcrudserverSingapor.html"
  );
  console.log("Requested file path:", filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("500 Internal Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
});
/********************************************* */

app.post("/node-api/api/nmap-scan", (req, res) => {
  const ip = req.body.ip;

  if (!ip) {
    return res.status(400).json({ error: "Missing IP address" });
  }

  exec(`nmap -p- --open ${ip}`, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    const openPorts = stdout
      .split("\n")
      .filter((line) => line.includes("/tcp"))
      .map((line) => line.split("/")[0]);

    res.json({ openPorts });
  });
});

/*****************************dashBoard API********************************/
app.get("/node-api/api/dashboard", (req, res) => {
  const {
    organization,
    responsibilitygroup,
    responsibilitycenter,
    projectname,
    object,
    objecttype,
    groupname,
  } = req.query;

  console.log("Received Parameters:", req.query);

  const conditions = [];
  const values = [];

  if (organization) {
    conditions.push("organization = $" + (values.length + 1));
    values.push(organization);
  }
  if (responsibilitygroup) {
    conditions.push("responsibilitygroup = $" + (values.length + 1));
    values.push(responsibilitygroup);
  }
  if (responsibilitycenter) {
    conditions.push("responsibilitycenter = $" + (values.length + 1));
    values.push(responsibilitycenter);
  }
  if (projectname) {
    conditions.push("projectname = $" + (values.length + 1));
    values.push(projectname);
  }
  if (object) {
    conditions.push("object = $" + (values.length + 1));
    values.push(object);
  }
  if (objecttype) {
    conditions.push("objecttype = $" + (values.length + 1));
    values.push(objecttype);
  }
  if (groupname) {
    conditions.push("groupname = $" + (values.length + 1));
    values.push(groupname);
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "1=1";

  let sqlQuery = `
      SELECT
          organization,
          responsibilitygroup,
          responsibilitycenter,
          sourcelink,
          COUNT(*) AS count,
          SUM(CASE WHEN sourcelink = 'governancetestresult' THEN evidence_count ELSE 0 END) AS evidence_count,
          SUM(CASE WHEN sourcelink = 'governancetestresult' THEN assessment_count ELSE 0 END) AS assessment_count,
          SUM(CASE WHEN sourcelink = 'governancetestresult' THEN audit_count ELSE 0 END) AS audit_count
      FROM
          (
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'risk' AS sourcelink, 
                  0 AS evidence_count, 
                  0 AS assessment_count, 
                  0 AS audit_count 
              FROM ai.risk 
              UNION ALL
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'issue' AS sourcelink, 
                  0 AS evidence_count, 
                  0 AS assessment_count, 
                  0 AS audit_count 
              FROM ai.issue
              UNION ALL
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'checklist' AS sourcelink, 
                  0 AS evidence_count, 
                  0 AS assessment_count, 
                  0 AS audit_count 
              FROM ai.checklist
              UNION ALL
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'governancetestresult' AS sourcelink, 
                  COUNT(evidence) AS evidence_count, 
                  COUNT(assessmentreferencelink) AS assessment_count, 
                  COUNT(auditreferencelink) AS audit_count 
              FROM ai.governancetestresult
              GROUP BY 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter  -- Include all non-aggregated columns in the GROUP BY clause
              UNION ALL
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'algorithm' AS sourcelink, 
                  0 AS evidence_count, 
                  0 AS assessment_count, 
                  0 AS audit_count 
              FROM ai.algorithm_inventory
              UNION ALL
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'evidence' AS sourcelink, 
                  0 AS evidence_count, 
                  0 AS assessment_count, 
                  0 AS audit_count 
              FROM ai.governancetestresult 
              WHERE evidence IS NOT NULL
              UNION ALL
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'assessmentreferencelink' AS sourcelink, 
                  0 AS evidence_count, 
                  0 AS assessment_count, 
                  0 AS audit_count 
              FROM ai.governancetestresult 
              WHERE assessmentreferencelink IS NOT NULL
              UNION ALL
              SELECT 
                  organization, 
                  responsibilitygroup, 
                  responsibilitycenter, 
                  'auditreferencelink' AS sourcelink, 
                  0 AS evidence_count, 
                  0 AS assessment_count, 
                  0 AS audit_count 
              FROM ai.governancetestresult 
              WHERE auditreferencelink IS NOT NULL
          ) AS combined_data
      WHERE
          ${whereClause}
      GROUP BY
          organization,
          responsibilitygroup,
          responsibilitycenter,
          sourcelink
  `;

  db.query(sqlQuery, values)
    .then((result) => {
      console.log("SQL Result:", result.rows);
      res.json(result.rows);
    })
    .catch((err) => {
      console.error("Error executing SQL queries:", err.message);
      res.status(500).send("Internal Server Error: " + err.message);
    });
});

app.get("/node-api/api/dashboardevidence", (req, res) => {
  const {
    organization,
    responsibilitygroup,
    responsibilitycenter,
    projectname,
    object,
    objecttype,
    groupname,
  } = req.query;

  console.log("Received Parameters:", req.query);

  const conditions = [];
  const values = [];

  if (organization) {
    conditions.push("organization = $" + (values.length + 1));
    values.push(organization);
  }
  if (responsibilitygroup) {
    conditions.push("responsibilitygroup = $" + (values.length + 1));
    values.push(responsibilitygroup);
  }
  if (responsibilitycenter) {
    conditions.push("responsibilitycenter = $" + (values.length + 1));
    values.push(responsibilitycenter);
  }
  if (projectname) {
    conditions.push("projectname = $" + (values.length + 1));
    values.push(projectname);
  }
  if (object) {
    conditions.push("object = $" + (values.length + 1));
    values.push(object);
  }
  if (objecttype) {
    conditions.push("objecttype = $" + (values.length + 1));
    values.push(objecttype);
  }
  if (groupname) {
    conditions.push("groupname = $" + (values.length + 1));
    values.push(groupname);
  }

  const whereClause = conditions.length > 0 ? conditions.join(" AND ") : "1=1";

  let sqlQuery = `
    SELECT
        organization,
        responsibilitygroup,
        responsibilitycenter,
        projectname,
        evidence,
     
        COUNT(*) AS count
    FROM
        (
             SELECT organization, responsibilitygroup, responsibilitycenter,evidence, 'governancetestresult' AS projectname FROM ai.governancetestresult
             UNION ALL
             SELECT organization, responsibilitygroup, responsibilitycenter,evidence, 'evidencetd' AS projectname FROM ai.governancetestresult
        ) AS combined_data
    WHERE
        ${whereClause}
    GROUP BY
        organization,
        responsibilitygroup,
        responsibilitycenter,
        projectname,
        evidence
`;

  db.query(sqlQuery, values)
    .then((result) => {
      console.log("SQL Result:", result.rows);
      const combinedResults = {
        evidence: result.rows.filter((row) => row.projectname === "evidencetd"),
      };

      res.json(combinedResults);
    })
    .catch((err) => {
      console.error("Error executing SQL queries:", err.message);
      res.status(500).send("Internal Server Error: " + err.message);
    });
});
/********************************************* */
app.get("/node-api/api/dashboard/detail", (req, res) => {
  const {
    organization,
    responsibilitygroup,
    responsibilitycenter,
    projectname,
    sourcelink,
  } = req.query;

  console.log("Received Parameters for Detail:", req.query);

  const conditions = [];
  const values = [];

  if (organization) {
    conditions.push("organization = $1");
    values.push(organization);
  }
  if (responsibilitygroup) {
    conditions.push("responsibilitygroup = $2");
    values.push(responsibilitygroup);
  }
  if (responsibilitycenter) {
    conditions.push("responsibilitycenter = $3");
    values.push(responsibilitycenter);
  }
  if (projectname) {
    conditions.push("projectname = $4");
    values.push(projectname);
  }

  const whereClause =
    conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  const sqlQuery = `
      SELECT 
          * 
      FROM 
          ai.${sourcelink} 
      ${whereClause}
  `;

  console.log("Generated SQL Query for Detail:", sqlQuery);

  db.query(sqlQuery, values)
    .then((result) => {
      console.log("Detail SQL Result:", result.rows);
      res.json(result.rows);
    })
    .catch((err) => {
      console.error("Error executing Detail SQL query:", err.message);
      res.status(500).send("Internal Server Error: " + err.message);
    });
});

/******************************************** */
/*****************AI GOvernance Data Upload***************************** */
app.post("/node-api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Process excelData to remove duplicates
    for (const row of excelData) {
      const {
        controlname,
        thrustarea,
        controlwt,
        subcontrolname,
        groupname,
        evidence,
        subcontrolwt,
      } = row;

      // Check if the entry already exists in governancecontrol table
      const governanceControlResult = await db.query(
        "SELECT COUNT(*) AS count FROM ai.governancecontrol WHERE controlname = $1 AND thrustarea = $2 AND subcontrolname = $3 AND groupname = $4",
        [controlname, thrustarea, subcontrolname, groupname]
      );
      const governanceControlCount = parseInt(
        governanceControlResult.rows[0].count
      );
      if (governanceControlCount === 0) {
        // Insert into governancecontrol table
        await db.query(
          "INSERT INTO ai.governancecontrol (controlname, thrustarea, controlwt, subcontrolname, groupname, evidence, subcontrolwt) VALUES ($1,$2,$3,$4,$5,$6,$7)",
          [
            controlname,
            thrustarea,
            controlwt,
            subcontrolname,
            groupname,
            evidence,
            subcontrolwt,
          ]
        );
      }

      // Check if the entry already exists in thrustarea table
      const thrustAreaResult = await db.query(
        "SELECT COUNT(*) AS count FROM ai.thrustarea WHERE thrustarea = $1 AND groupname = $2",
        [thrustarea, groupname]
      );
      const thrustAreaCount = parseInt(thrustAreaResult.rows[0].count);
      if (thrustAreaCount === 0) {
        // Insert into thrustarea table
        await db.query(
          "INSERT INTO ai.thrustarea (thrustarea, groupname) VALUES ($1,$2)",
          [thrustarea, groupname]
        );
      }

      // Check if the entry already exists in governancegroup table
      const governanceGroupResult = await db.query(
        "SELECT COUNT(*) AS count FROM ai.governancegroup WHERE groupname = $1",
        [groupname]
      );
      const governanceGroupCount = parseInt(
        governanceGroupResult.rows[0].count
      );
      if (governanceGroupCount === 0) {
        // Insert into governancegroup table
        await db.query(
          "INSERT INTO ai.governancegroup (groupname) VALUES ($1)",
          [groupname]
        );
      }
    }

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**************Theme Activity Upload*************************** */

app.post("/node-api/uploadtheme", upload.single("file"), async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    await db.query("BEGIN");

    // Store processed phases and themes to check for duplicates
    const processedPhases = new Set();
    const processedThemes = new Set();

    for (const row of data) {
      const { themename, phase, activitygroup, activity, expectedevidence } =
        row;

      // Check if phase has already been processed
      if (processedPhases.has(phase)) {
        console.log(`Duplicate phase detected: ${phase}`);
        continue; // Skip processing this row
      } else {
        processedPhases.add(phase);
      }

      // Check if theme has already been processed
      if (processedThemes.has(themename)) {
        console.log(`Duplicate theme detected: ${themename}`);
        continue; // Skip processing this row
      } else {
        processedThemes.add(themename);
      }

      // Insert into themeactivity table
      const themeActivityQuery = `
        INSERT INTO ai.themeactivity (themename, phase, activitygroup, activity, expectedevidence)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING;
      `;
      await db.query(themeActivityQuery, [
        themename,
        phase,
        activitygroup,
        activity,
        expectedevidence,
      ]);

      // Insert into thememaster table if not already exists
      const themeMasterQuery = `
        INSERT INTO ai.thememaster (themename)
        VALUES ($1)
        ON CONFLICT DO NOTHING;
      `;
      await db.query(themeMasterQuery, [themename]);

      // Insert into projectphase table if not already exists
      const projectPhaseQuery = `
        INSERT INTO ai.projectphase (phasename)
        VALUES ($1)
        ON CONFLICT DO NOTHING;
      `;
      await db.query(projectPhaseQuery, [phase]);
    }

    await db.query("COMMIT");
    res.status(200).send("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
    res.status(500).send("Error uploading data");
  }
});

/***************************************************** */
const PORT = process.env.PORT || 5011;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
