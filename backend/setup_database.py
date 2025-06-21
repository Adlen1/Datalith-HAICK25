#!/usr/bin/env python3
"""
Database setup script for SATIM Pay application.
Creates collections and inserts dummy data including admin user.
"""

import asyncio
import os
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from bson import ObjectId
import json

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database configuration
MONGODB_URL = "mongodb://localhost:27017"
DATABASE_NAME = "satim_pay_test"

async def setup_database():
    """Setup database with collections and dummy data"""
    
    # Connect to MongoDB
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    print(f"Connected to MongoDB: {DATABASE_NAME}")
    
    # Drop existing collections for fresh start
    collections = await db.list_collection_names()
    for collection in collections:
        await db[collection].drop()
        print(f"Dropped collection: {collection}")
    
    # Create users collection with dummy data
    users_collection = db.users
    
    # Admin user
    admin_user = {
        "_id": ObjectId(),
        "email": "admin@satimpay.com",
        "username": "admin",
        "password_hash": pwd_context.hash("admin123"),
        "first_name": "Admin",
        "last_name": "User",
        "phone": "+213555000000",
        "role": "admin",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "profile": {
            "avatar_url": "/placeholder-user.jpg",
            "bio": "System Administrator",
            "preferences": {
                "language": "en",
                "currency": "DZD",
                "notifications": True
            }
        },
        "security": {
            "login_attempts": 0,
            "last_login": datetime.utcnow(),
            "account_locked": False,
            "two_factor_enabled": False
        }
    }
    
    # Regular users
    regular_users = [
        {
            "_id": ObjectId(),
            "email": "john.doe@example.com",
            "username": "johndoe",
            "password_hash": pwd_context.hash("password123"),
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+213555111111",
            "role": "user",
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.utcnow() - timedelta(days=30),
            "updated_at": datetime.utcnow(),
            "profile": {
                "avatar_url": "/placeholder-user.jpg",
                "bio": "Software Developer",
                "preferences": {
                    "language": "en",
                    "currency": "DZD",
                    "notifications": True
                }
            },
            "security": {
                "login_attempts": 0,
                "last_login": datetime.utcnow() - timedelta(hours=2),
                "account_locked": False,
                "two_factor_enabled": False
            }
        },
        {
            "_id": ObjectId(),
            "email": "jane.smith@example.com",
            "username": "janesmith",
            "password_hash": pwd_context.hash("password123"),
            "first_name": "Jane",
            "last_name": "Smith",
            "phone": "+213555222222",
            "role": "user",
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.utcnow() - timedelta(days=15),
            "updated_at": datetime.utcnow(),
            "profile": {
                "avatar_url": "/placeholder-user.jpg",
                "bio": "Marketing Manager",
                "preferences": {
                    "language": "fr",
                    "currency": "DZD",
                    "notifications": True
                }
            },
            "security": {
                "login_attempts": 0,
                "last_login": datetime.utcnow() - timedelta(days=1),
                "account_locked": False,
                "two_factor_enabled": True
            }
        },
        {
            "_id": ObjectId(),
            "email": "ahmed.benali@example.com",
            "username": "ahmedbenali",
            "password_hash": pwd_context.hash("password123"),
            "first_name": "Ahmed",
            "last_name": "Benali",
            "phone": "+213555333333",
            "role": "user",
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.utcnow() - timedelta(days=7),
            "updated_at": datetime.utcnow(),
            "profile": {
                "avatar_url": "/placeholder-user.jpg",
                "bio": "Business Analyst",
                "preferences": {
                    "language": "ar",
                    "currency": "DZD",
                    "notifications": False
                }
            },
            "security": {
                "login_attempts": 0,
                "last_login": datetime.utcnow() - timedelta(hours=5),
                "account_locked": False,
                "two_factor_enabled": False
            }
        }
    ]
    
    # Insert users
    await users_collection.insert_one(admin_user)
    await users_collection.insert_many(regular_users)
    print(f"Inserted {len(regular_users) + 1} users (1 admin, {len(regular_users)} regular)")
    
    # Create accounts collection
    accounts_collection = db.accounts
    
    # Create accounts for users
    user_ids = [admin_user["_id"]] + [user["_id"] for user in regular_users]
    accounts = []
    
    for i, user_id in enumerate(user_ids):
        account = {
            "_id": ObjectId(),
            "user_id": user_id,
            "account_number": f"DZ{1000000000 + i:010d}",
            "account_type": "checking",
            "balance": 50000.0 + (i * 10000),  # Different balances
            "currency": "DZD",
            "status": "active",
            "created_at": datetime.utcnow() - timedelta(days=30-i),
            "updated_at": datetime.utcnow(),
            "limits": {
                "daily_transfer": 100000.0,
                "monthly_transfer": 1000000.0,
                "daily_withdrawal": 50000.0
            }
        }
        accounts.append(account)
    
    await accounts_collection.insert_many(accounts)
    print(f"Inserted {len(accounts)} accounts")
    
    # Create transactions collection with dummy data
    transactions_collection = db.transactions
    
    transactions = []
    for i in range(20):  # Create 20 dummy transactions
        transaction = {
            "_id": ObjectId(),
            "from_account": accounts[i % len(accounts)]["_id"],
            "to_account": accounts[(i + 1) % len(accounts)]["_id"],
            "amount": 1000.0 + (i * 500),
            "currency": "DZD",
            "type": "transfer",
            "status": "completed" if i % 5 != 0 else "pending",
            "description": f"Payment #{i+1}",
            "reference": f"TXN{datetime.utcnow().strftime('%Y%m%d')}{i:04d}",
            "created_at": datetime.utcnow() - timedelta(days=i, hours=i),
            "completed_at": datetime.utcnow() - timedelta(days=i, hours=i-1) if i % 5 != 0 else None,
            "metadata": {
                "ip_address": "192.168.1.100",
                "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "device_id": f"device_{i % 3}"
            }
        }
        transactions.append(transaction)
    
    await transactions_collection.insert_many(transactions)
    print(f"Inserted {len(transactions)} transactions")
    
    # Create notifications collection
    notifications_collection = db.notifications
    
    notifications = []
    for i, user_id in enumerate(user_ids):
        for j in range(3):  # 3 notifications per user
            notification = {
                "_id": ObjectId(),
                "user_id": user_id,
                "title": f"Transaction Alert #{j+1}",
                "message": f"You have received a payment of {1000 + j*500} DZD",
                "type": "transaction",
                "status": "unread" if j == 0 else "read",
                "created_at": datetime.utcnow() - timedelta(days=j, hours=i),
                "read_at": datetime.utcnow() - timedelta(days=j-1) if j > 0 else None,
                "metadata": {
                    "transaction_id": str(ObjectId()),
                    "amount": 1000 + j*500,
                    "currency": "DZD"
                }
            }
            notifications.append(notification)
    
    await notifications_collection.insert_many(notifications)
    print(f"Inserted {len(notifications)} notifications")
    
    # Create indexes for better performance
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("username", unique=True)
    await accounts_collection.create_index("user_id")
    await accounts_collection.create_index("account_number", unique=True)
    await transactions_collection.create_index("from_account")
    await transactions_collection.create_index("to_account")
    await transactions_collection.create_index("created_at")
    await notifications_collection.create_index("user_id")
    await notifications_collection.create_index("created_at")
    
    print("Created database indexes")
    
    # Print summary
    print("\n=== Database Setup Complete ===")
    print(f"Database: {DATABASE_NAME}")
    print(f"Users: {await users_collection.count_documents({})}")
    print(f"Accounts: {await accounts_collection.count_documents({})}")
    print(f"Transactions: {await transactions_collection.count_documents({})}")
    print(f"Notifications: {await notifications_collection.count_documents({})}")
    
    print("\n=== Login Credentials ===")
    print("Admin User:")
    print("  Email: admin@satimpay.com")
    print("  Password: admin123")
    print("\nRegular Users:")
    print("  Email: john.doe@example.com, Password: password123")
    print("  Email: jane.smith@example.com, Password: password123")
    print("  Email: ahmed.benali@example.com, Password: password123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(setup_database())

