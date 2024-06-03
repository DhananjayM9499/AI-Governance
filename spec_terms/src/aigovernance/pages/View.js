import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./View.css";
import { toast } from "react-toastify";
import Header from "./header";
import Footer from "./footer";

const TermSetView = () => {
  const [terms, setTerms] = useState([]);
  const [termSet, setTermSet] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of terms to display per page

  const { termsetid } = useParams();

  useEffect(() => {
    const fetchTermSetData = async () => {
      try {
        // Fetch term set data
        const responseTermSet = await axios.get(
          `https://staging.apilayer.valuevalidator.com/node-api/api/get/${termsetid}`
        );
        console.log("Response Terms Set:", responseTermSet.data);
        setTermSet(responseTermSet.data);

        // Fetch terms associated with the term set
        const responseTerms = await axios.get(
          `https://staging.apilayer.valuevalidator.com/node-api/api/get/term/${termsetid}`
        );
        const sortedTerms = responseTerms.data.sort(
          (a, b) => b.termid - a.termid
        );
        setTerms(sortedTerms);
        console.log("Response Terms:", responseTerms.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTermSetData();
  }, [termsetid]);

  const deleteTerm = async (termid) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(
          `https://staging.apilayer.valuevalidator.com/node-api/api/remove/term/${termid}`
        );
        toast.success("Term Deleted Successfully");
        // Fetch updated terms after deletion
        const responseTerms = await axios.get(
          `https://staging.apilayer.valuevalidator.com/node-api/api/get/term/${termsetid}`
        );
        setTerms(responseTerms.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const indexOfLastTerm = currentPage * itemsPerPage;
  const indexOfFirstTerm = indexOfLastTerm - itemsPerPage;
  const currentTerms = terms.slice(indexOfFirstTerm, indexOfLastTerm);

  const totalPages = Math.ceil(terms.length / itemsPerPage);

  return (
    <div>
      <Header />
      <div style={{ marginTop: "0px" }}>
        <div>
          <div style={{ fontFamily: "Poppins" }}>
            {termSet.map((termset) => {
              return <h1>Terms of : {termset.termsetname}</h1>;
            })}
          </div>
          <div className="container">
            <div style={{ marginTop: "0" }}>
              <Link to={`/addTerm/${termsetid}`}>
                <button className="btn btn-contact">Add Term</button>
              </Link>
              <table className="styled-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Term No.</th>
                    <th style={{ textAlign: "center" }}>Term</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTerms.map((term, index) => {
                    return (
                      <tr key={term.id}>
                        <th scope="row">{indexOfFirstTerm + index + 1}</th>
                        <td>{term.termname}</td>
                        <td>
                          <Link
                            to={`/update/term/${term.termid}/${term.termsetid}`}
                          >
                            <button className="btn btn-edit">Edit</button>
                          </Link>
                          <button
                            className="btn btn-delete"
                            onClick={() => deleteTerm(term.termid)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <br />
            <br />

            <div style={{ marginTop: "1px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <Link to="/home">
              <div className="btn btn-edit">GO Back</div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermSetView;
