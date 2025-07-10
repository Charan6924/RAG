from fastapi import FastAPI, Request
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from rag_engine import agent_executor
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime, timezone
from contextlib import asynccontextmanager
import uuid

load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY is missing from environment!")

config = {
    "ATLAS_URI": os.getenv("ATLAS_URI"),
    "DB_NAME": os.getenv("DB_NAME")
}

if not config["ATLAS_URI"] or not config["DB_NAME"]:
    raise ValueError("ATLAS_URI or DB_NAME is missing from environment!")

@asynccontextmanager
async def lifespan(app : FastAPI):
    app.state.mongodb_client = MongoClient(config["ATLAS_URI"])
    app.state.database = app.state.mongodb_client[config["DB_NAME"]]
    print('Connected')
    print("Mongo connected to:", app.state.mongodb_client.address)

    yield
    app.state.mongodb_client.close()
    print('Disconnected')

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or "*" for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    session_id : str

@app.get('/new_session')
def session():
    session_id = str(uuid.uuid4())
    return {'session_id' : session_id}

@app.post("/rag")
def ask_question(request: QueryRequest):
    try:
        system_message = {
        "role": "system",
        "content": "Answer the user's question."
        }
        user_message = {
         "role": "user",
         "content": request.query
        }
        result = agent_executor.invoke({"messages": [system_message, user_message]})
        all_outputs = [msg.content for msg in result["messages"]]
        answer = all_outputs[-1]
        app.state.database["Chats"].insert_one({
        "question": request.query,
        "answer": answer,
        "timestamp" : datetime.now(),
        "session_id": request.session_id})
    
        return {"answer": answer}
    except Exception as e:
        print(e)

from fastapi.responses import JSONResponse


@app.get('/chat_history')
def retrieve_history():
    d = {}
    for doc in app.state.database["Chats"].find({},{"_id": 0, "question": 1,"session_id":1}).sort('timestamp'):
        key = doc['session_id']
        if key in d:
            pass
        else:
            d[key] = [doc]
    return JSONResponse(content=d)

@app.get('/complete_history')
def get_complete(session_id: str):
    messages = []
    for i in app.state.database["Chats"].find(
        {"session_id": session_id},
        {"_id": 0, "question": 1, "answer" : 1 }
    ).sort('timestamp'):
        
        # Append user message
        messages.append({
            "role": "user",
            "content": i["question"]
        })

        # Append assistant response
        messages.append({
            "role": "assistant",
            "content": i["answer"]
        })

    return JSONResponse(content=messages)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")

