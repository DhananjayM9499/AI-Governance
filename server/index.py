from fastapi import FastAPI, HTTPException

from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from typing import List
import asyncpg

app = FastAPI()
# CORS Configuration
origins = [
    "http://localhost:3000",  # Replace with the actual origin of your React app during development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # You can specify specific HTTP methods if needed
    allow_headers=["*"],  # You can specify specific headers if needed
)


# Database connection setup
async def get_database_connection():
    return await asyncpg.connect(
        user="postgres", password="crud", database="termset", host="localhost"
    )


class TermSet(BaseModel):
    termsetname: str


class Term(BaseModel):
    termname: str


# Create a new term set
@app.post("/api/post", response_model=None)
async def create_term_set(term_set: TermSet):
    try:
        conn = await get_database_connection()
        await conn.execute(
            "INSERT INTO termset (termsetname) VALUES ($1)", term_set.termsetname
        )
        await conn.close()
        return {"message": "Term set inserted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


# Create a new term
@app.post("/api/post/term/{termsetid}", response_model=None)
async def create_term(termsetid: int, term: Term):
    try:
        conn = await get_database_connection()
        await conn.execute(
            "INSERT INTO term (termname, termsetid) VALUES ($1, $2)",
            term.termname,
            termsetid,
        )
        await conn.close()
        return {"message": "Term inserted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


# Get all term sets
@app.get("/api/get", response_model=List[TermSet])
async def get_term_sets():
    try:
        conn = await get_database_connection()
        rows = await conn.fetch("SELECT * FROM termset")
        await conn.close()
        return [{"termsetname": row["termsetname"]} for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


# Get all terms in a term set
@app.get("/api/get/term/{termsetid}", response_model=List[Term])
async def get_terms_in_term_set(termsetid: int):
    try:
        conn = await get_database_connection()
        rows = await conn.fetch("SELECT * FROM term WHERE termsetid = $1", termsetid)
        await conn.close()
        return [{"termname": row["termname"]} for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


# Delete a term set
@app.delete("/api/remove/{termsetid}", response_model=None)
async def delete_term_set(termsetid: int):
    try:
        conn = await get_database_connection()
        term_count = await conn.fetchval(
            "SELECT COUNT(*) FROM term WHERE termsetid = $1", termsetid
        )
        if term_count > 0:
            await conn.close()
            raise HTTPException(
                status_code=400, detail="Cannot delete term set with associated terms"
            )

        await conn.execute("DELETE FROM termset WHERE termsetid = $1", termsetid)
        await conn.close()
        return {"message": "Term set deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


# Delete a term
@app.delete("/api/remove/term/{termid}", response_model=None)
async def delete_term(termid: int):
    try:
        conn = await get_database_connection()
        await conn.execute("DELETE FROM term WHERE termid = $1", termid)
        await conn.close()
        return {"message": "Term deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


# Update a term set
@app.put("/api/update/{termsetid}", response_model=None)
async def update_term_set(termsetid: int, term_set: TermSet):
    try:
        conn = await get_database_connection()
        await conn.execute(
            "UPDATE termset SET termsetname = $1 WHERE termsetid = $2",
            term_set.termsetname,
            termsetid,
        )
        await conn.close()
        return {"message": "Term set updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")


# Update a term
@app.put("/api/update/term/{termid}/{termsetid}", response_model=None)
async def update_term(termid: int, termsetid: int, term: Term):
    try:
        conn = await get_database_connection()
        await conn.execute(
            "UPDATE term SET termname = $1 WHERE termid = $2 AND termsetid = $3",
            term.termname,
            termid,
            termsetid,
        )
        await conn.close()
        return {"message": "Term updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
