from fastapi import FastAPI, Request
from pydantic import BaseModel
from rag_engine import agent_executor
from dotenv import load_dotenv
import os

load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY is missing from environment!")


app = FastAPI()

class QueryRequest(BaseModel):
    query: str


@app.post("/rag")
def ask_question(request: QueryRequest):
    input_message = {"role": "user", "content": request.query}
    result = agent_executor.invoke({"messages": [input_message]})
    
    # Collect all message content (e.g., for full trace)
    all_outputs = [msg.content for msg in result["messages"]]

    return {
        "answer": all_outputs[-1],  # Return only final response
        "full_trace": all_outputs   # Optional: return full trace
    }