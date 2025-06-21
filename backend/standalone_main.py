from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json

# Simple FastAPI app without database dependencies for testing
app = FastAPI(
    title="SATIM Pay API",
    version="1.0.0",
    description="SATIM Pay Backend API - Standalone Version"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    message: str

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SATIM Pay API - Standalone Version",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/ask")
async def legacy_ask_chatbot(req: AskRequest):
    """Legacy chatbot endpoint for backward compatibility"""
    try:
        from chatbot import ask_assistant
        return {"response": ask_assistant(req.message)}
    except Exception as e:
        return {"response": f"Bonjour ! Je suis l'assistant SATIM Pay. Comment puis-je vous aider aujourd'hui ? (Note: Service IA temporairement indisponible)"}

@app.post("/api/v1/ai/chat")
async def chat_endpoint(req: ChatRequest):
    """Enhanced chat endpoint"""
    try:
        from chatbot import ask_assistant
        response = ask_assistant(f"Tu es un assistant bancaire pour SATIM Pay en Algérie. Réponds en français: {req.message}")
        return {
            "response": response,
            "session_id": req.session_id or "default",
            "suggestions": [
                "Voir mon solde",
                "Faire un virement", 
                "Historique des transactions",
                "Aide et support"
            ]
        }
    except Exception as e:
        return {
            "response": "Bonjour ! Je suis votre assistant SATIM Pay. Comment puis-je vous aider avec vos finances aujourd'hui ?",
            "session_id": req.session_id or "default",
            "suggestions": [
                "Voir mon solde",
                "Faire un virement",
                "Historique des transactions", 
                "Aide et support"
            ]
        }

@app.get("/api/v1/ai/insights")
async def get_insights():
    """Mock AI insights endpoint"""
    return {
        "insights": [
            {
                "type": "spending",
                "title": "Conseil d'épargne",
                "description": "Vous pourriez économiser 3,200 DZD ce mois en réduisant vos achats alimentaires de 15%.",
                "confidence": 0.85,
                "category": "savings"
            },
            {
                "type": "trend",
                "title": "Tendance positive",
                "description": "Vos revenus ont augmenté de 12% par rapport au mois dernier.",
                "confidence": 0.92,
                "category": "income"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "standalone_main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

