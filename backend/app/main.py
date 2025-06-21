from fastapi import FastAPI
from pydantic import BaseModel
from chatbot import ask_assistant

app = FastAPI()

class AskRequest(BaseModel):
    message: str

@app.post("/ask")
def ask_chatbot(req: AskRequest):
    return {"response": ask_assistant(req.message)}
