from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    client: AsyncIOMotorClient = None
    database = None

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "satim_pay")

async def connect_to_mongo():
    """Create database connection"""
    Database.client = AsyncIOMotorClient(MONGODB_URL, server_api=ServerApi('1'))
    Database.database = Database.client[DATABASE_NAME]
    
    # Test the connection
    try:
        await Database.client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")

async def close_mongo_connection():
    """Close database connection"""
    if Database.client:
        Database.client.close()
        print("Disconnected from MongoDB!")

def get_database():
    """Get database instance"""
    return Database.database

