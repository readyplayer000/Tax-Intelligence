from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.agent import run_agent, compare_tax_regimes
import uvicorn
import os
import warnings

# Suppress LangChain warnings
warnings.filterwarnings("ignore", category=UserWarning, module="langchain")
warnings.filterwarnings("ignore", category=DeprecationWarning)

app = FastAPI(title="TaxAI Agent Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: str
    financial_year: str
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    if not req.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    response = run_agent(req.user_id, req.financial_year, req.message)
    return {"response": response}

class CompareRequest(BaseModel):
    total_income: float
    deductions: float

@app.post("/compare")
async def compare(req: CompareRequest):
    result = compare_tax_regimes.invoke({
        "total_income": req.total_income,
        "deductions": req.deductions
    })
    return result

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
