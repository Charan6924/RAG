from fastapi import FastAPI, Request
from pydantic import BaseModel
from rag_engine import generate_answer

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.post("/rag")
def rag_endpoint(request: QueryRequest):
    answer = generate_answer(request.query)
    return {"answer": answer}
