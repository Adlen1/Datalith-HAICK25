from fastapi import FastAPI
from pydantic import BaseModel
from app.main import app

# Keep the old main.py structure for compatibility
class AskRequest(BaseModel):
    message: str

# This is now handled by the new app structure
# The /ask endpoint is included in app/main.py for backward compatibility
