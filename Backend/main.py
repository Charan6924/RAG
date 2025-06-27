from fastapi import FastAPI, Request
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from rag_engine import agent_executor
import uvicorn
from fastapi.middleware.cors import CORSMiddleware



load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY is missing from environment!")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


@app.post("/rag")
def ask_question(request: QueryRequest):
    system_message = {
        "role": "system",
        "content": "Answer the user's question. After answering, log the question and the final answer using the logging tool."
    }
    user_message = {
        "role": "user",
        "content": request.query
    }
    result = agent_executor.invoke({"messages": [system_message, user_message]})
    all_outputs = [msg.content for msg in result["messages"]]
    return {"answer": all_outputs[-1]}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, log_level="info")