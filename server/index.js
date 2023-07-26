const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Danny@1252",
  database: "term_set",
});

// For viewing term set Home.js
app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM term_set_sp";
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

// For viewing terms
app.get("/api/get/term/:term_set_no", (req, res) => {
  const { term_set_no } = req.params;
  const sqlGetTerms = "SELECT * FROM term_set_taxonomy WHERE term_set_no = ?";
  db.query(sqlGetTerms, term_set_no, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

//for adding the term Set
app.post("/api/post", (req, res) => {
  const { term_set } = req.body;
  const sqlInsert = "INSERT INTO term_set_sp( term_set) VALUES(?)";
  db.query(sqlInsert, [term_set], (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});
//for adding a new Term
app.post("/api/post/term", (req, res) => {
  const { term_set } = req.body;
  const sqlInsert = "INSERT INTO term_set_taxonomy( ?,term) VALUES(?)";
  db.query(sqlInsert, [term_set], (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

//for deleting the term set
app.delete("/api/remove/:term_set_id", (req, res) => {
  const { term_set_id } = req.params;
  const sqlRemove = "DELETE FROM term_set_sp WHERE term_set_id = ?";
  db.query(sqlRemove, term_set_id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});
//for deleting the term
app.delete("/api/remove/term/:term_set_no", (req, res) => {
  const { term_set } = req.params;
  const sqlRemove = "DELETE FROM term_set_taxonomy WHERE term_set_no = ?";
  db.query(sqlRemove, term_set, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});
//for viewing the specific term set
app.get("/api/get/:term_set_id", (req, res) => {
  const { term_set_id } = req.params;
  const sqlGet = "SELECT * FROM term_set_sp WHERE term_set_id = ?";
  db.query(sqlGet, term_set_id, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});
// for viewing the specific term
app.get("/api/get/term:term_set_no", (req, res) => {
  const { term_set_no } = req.params;
  const sqlGet = "SELECT * FROM term_set_taxonomy WHERE term_set_no = ?";
  db.query(sqlGet, term_set_no, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});
//for editing the termset
app.put("/api/update/:term_set_id", (req, res) => {
  const { term_set_id } = req.params;
  const { term_set } = req.body;
  const sqlUpdate = "UPDATE term_set_sp SET term_set = ? WHERE term_set_id = ?";
  db.query(sqlUpdate, [term_set, term_set_id], (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});
//for editing the terms
app.put("/api/update/term/:term_set_no", (req, res) => {
  const { term_set_no } = req.params;
  const { terms } = req.body;
  const sqlUpdateTerms =
    "UPDATE term_set_taxonomy SET terms = ? WHERE term_set_no = ?";
  db.query(sqlUpdateTerms, [terms, term_set_no], (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
