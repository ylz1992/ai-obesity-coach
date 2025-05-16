from fastapi import FastAPI
from pydantic import BaseModel
from backend.chains import answer

app = FastAPI()

class Prompt(BaseModel):
    prompt: str

@app.post("/chat")
async def chat(req: Prompt):
    """Return the combined doctor-style + factual answer."""
    return {"answer": answer(req.prompt)}