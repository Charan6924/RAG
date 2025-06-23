from fastapi import FastAPI, Request
from pydantic import BaseModel
from rag_engine import agent_executor

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.post("/rag")
def ask_question(request: QueryRequest):
    result = agent_executor.invoke({"input": request.query})
    return {"answer": result["output"]}