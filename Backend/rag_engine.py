import getpass
import os
from langchain_openai import ChatOpenAI
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_openai import OpenAIEmbeddings
import bs4
from langchain import hub
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict
from langchain_community.document_loaders import PyPDFLoader
from langchain.tools import tool
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
import os

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    raise ValueError("OPENAI_API_KEY not found in environment.")

os.environ["OPENAI_API_KEY"] = openai_key


llm = ChatOpenAI(model="gpt-4o-mini")
embeddings = OpenAIEmbeddings()
vector_store = InMemoryVectorStore(embeddings)

docs = []
file_paths = [os.path.join("/Users/charan/Desktop/FastApi/Backend/Files", f) for f in os.listdir("/Users/charan/Desktop/FastApi/Backend/Files") if f.endswith(".pdf")]
for f in file_paths:
    loader = PyPDFLoader(f)
    doc = loader.load()
    docs.extend(doc)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
all_splits = text_splitter.split_documents(docs)
_ = vector_store.add_documents(documents=all_splits)

prompt = hub.pull("rlm/rag-prompt")

class State(TypedDict):
    question: str
    context: List[Document]
    answer: str


# Define application steps
def retrieve(state: State):
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}


def generate(state: State):
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    messages = prompt.invoke({"question": state["question"], "context": docs_content})
    response = llm.invoke(messages)
    return {"answer": response.content}


# Compile application and test
graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

@tool
def inv_tool(query: str) -> str:
    """Answer questions using the knowledge graph."""
    response = graph.invoke({"question": query})
    return response["answer"]

@tool
def log_txt(message : str) -> str:
    """Logs the message onto a txt file"""
    with open('logs.txt','a') as f:
      f.write(message + "\n")
    return "Logged"

tools = [inv_tool,log_txt]
agent_executor = create_react_agent(llm, tools)
