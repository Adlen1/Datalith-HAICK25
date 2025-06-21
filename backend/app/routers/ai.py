from typing import Optional, List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.core.dependencies import get_current_user
from app.models.schemas import User
from app.services.enhanced_chatbot_service import EnhancedChatbotService
from app.services.ai_insights_service import AIInsightsService

router = APIRouter()
chatbot_service = EnhancedChatbotService()
insights_service = AIInsightsService()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    suggestions: List[str] = []
    actions: List[dict] = []
    intent: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    chat_request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """Chat with enhanced AI assistant"""
    result = await chatbot_service.process_message(
        user_id=str(current_user.id),
        message=chat_request.message,
        session_id=chat_request.session_id
    )
    
    return ChatResponse(
        response=result["response"],
        session_id=result["session_id"],
        suggestions=result.get("suggestions", []),
        actions=result.get("actions", []),
        intent=result.get("intent")
    )

@router.get("/insights")
async def get_ai_insights(current_user: User = Depends(get_current_user)):
    """Get AI-powered financial insights"""
    insights = await insights_service.generate_spending_insights(str(current_user.id))
    return {"insights": insights}

@router.get("/forecast")
async def get_financial_forecast(current_user: User = Depends(get_current_user)):
    """Get financial forecast based on spending patterns"""
    forecast = await insights_service.generate_financial_forecast(str(current_user.id))
    return forecast

@router.post("/analyze-transaction")
async def analyze_transaction_risk(
    transaction_data: dict,
    current_user: User = Depends(get_current_user)
):
    """Analyze transaction for fraud risk"""
    analysis = await insights_service.detect_fraud_patterns(
        str(current_user.id), 
        transaction_data
    )
    return analysis

@router.get("/chat-history/{session_id}")
async def get_chat_history(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get chat history for a session"""
    history = await chatbot_service.get_chat_history(str(current_user.id), session_id)
    return {"messages": [msg.dict() for msg in history]}

@router.post("/end-session/{session_id}")
async def end_chat_session(
    session_id: str,
    current_user: User = Depends(get_current_user)
):
    """End a chat session"""
    await chatbot_service.end_session(str(current_user.id), session_id)
    return {"message": "Session ended successfully"}

