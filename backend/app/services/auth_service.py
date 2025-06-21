from typing import Optional, List
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from app.core.database import get_database
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, verify_biometric_data
from app.models.schemas import User, UserCreate, LoginRequest, BiometricLoginRequest, Token, UserResponse
from bson import ObjectId
import uuid

class AuthService:
    def __init__(self):
        self.db = get_database()
    
    async def register_user(self, user_data: UserCreate) -> UserResponse:
        """Register a new user"""
        # Check if user already exists
        existing_user = await self.db.users.find_one({
            "$or": [
                {"email": user_data.email},
                {"phone": user_data.phone}
            ]
        })
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email or phone already exists"
            )
        
        # Hash password
        password_hash = get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "phone": user_data.phone,
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "date_of_birth": user_data.date_of_birth,
            "password_hash": password_hash,
            "role": "user",
            "kyc_status": "pending",
            "account_type": "individual",
            "is_active": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "security_settings": {
                "two_factor_enabled": False,
                "login_attempts": 0,
                "account_locked": False
            },
            "preferences": {
                "language": "fr",
                "currency": "DZD",
                "notifications": {
                    "email": True,
                    "sms": True,
                    "push": True
                }
            }
        }
        
        # Insert user
        result = await self.db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        
        # Create primary account for user
        await self._create_primary_account(result.inserted_id)
        
        return UserResponse(
            id=str(result.inserted_id),
            email=user_data.email,
            phone=user_data.phone,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            role="user",
            is_active=True,
            created_at=user_doc["created_at"],
            kyc_status="pending"
        )
    
    async def authenticate_user(self, login_data: LoginRequest) -> Token:
        """Authenticate user with email/phone and password"""
        # Find user by email or phone
        user = await self.db.users.find_one({
            "$or": [
                {"email": login_data.email_or_phone},
                {"phone": login_data.email_or_phone}
            ]
        })
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check if account is locked
        security_settings = user.get("security_settings", {})
        if security_settings.get("account_locked", False):
            lock_until = security_settings.get("lock_until")
            if lock_until and datetime.utcnow() < lock_until:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Account is locked. Please try again later."
                )
            else:
                # Unlock account if lock period has expired
                await self._unlock_account(user["_id"])
        
        # Verify password
        if not verify_password(login_data.password, user["password_hash"]):
            await self._handle_failed_login(user["_id"])
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Reset login attempts on successful login
        await self._reset_login_attempts(user["_id"])
        
        # Create tokens
        access_token = create_access_token(data={"sub": str(user["_id"])})
        refresh_token = create_refresh_token(data={"sub": str(user["_id"])})
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    async def authenticate_biometric(self, biometric_data: BiometricLoginRequest) -> Token:
        """Authenticate user with biometric data"""
        user = await self.db.users.find_one({"_id": ObjectId(biometric_data.user_id)})
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Check if biometric is enabled
        biometric_settings = user.get("biometric_data", {})
        if not biometric_settings.get("is_biometric_enabled", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Biometric authentication not enabled"
            )
        
        # Verify biometric data
        stored_hash = None
        if biometric_data.biometric_type == "fingerprint":
            stored_hash = biometric_settings.get("fingerprint_hash")
        elif biometric_data.biometric_type == "face":
            stored_hash = biometric_settings.get("face_recognition_data")
        
        if not stored_hash or not verify_biometric_data(biometric_data.biometric_data, stored_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Biometric authentication failed"
            )
        
        # Create tokens
        access_token = create_access_token(data={"sub": str(user["_id"])})
        refresh_token = create_refresh_token(data={"sub": str(user["_id"])})
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    async def _create_primary_account(self, user_id: ObjectId):
        """Create primary account for new user"""
        account_number = f"DZ{datetime.now().strftime('%Y%m%d')}{str(user_id)[-6:]}"
        
        account_doc = {
            "user_id": user_id,
            "account_number": account_number,
            "account_type": "checking",
            "currency": "DZD",
            "balance": 0.0,
            "available_balance": 0.0,
            "status": "active",
            "daily_limit": 100000.0,
            "monthly_limit": 1000000.0,
            "is_primary": True,
            "opened_date": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await self.db.accounts.insert_one(account_doc)
    
    async def _handle_failed_login(self, user_id: ObjectId):
        """Handle failed login attempt"""
        user = await self.db.users.find_one({"_id": user_id})
        security_settings = user.get("security_settings", {})
        
        login_attempts = security_settings.get("login_attempts", 0) + 1
        
        update_data = {
            "security_settings.login_attempts": login_attempts,
            "updated_at": datetime.utcnow()
        }
        
        # Lock account if too many failed attempts
        if login_attempts >= 5:  # MAX_LOGIN_ATTEMPTS
            update_data.update({
                "security_settings.account_locked": True,
                "security_settings.lock_until": datetime.utcnow() + timedelta(minutes=30)
            })
        
        await self.db.users.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
    
    async def _reset_login_attempts(self, user_id: ObjectId):
        """Reset login attempts after successful login"""
        await self.db.users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "security_settings.login_attempts": 0,
                    "security_settings.last_login": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
    
    async def _unlock_account(self, user_id: ObjectId):
        """Unlock user account"""
        await self.db.users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "security_settings.account_locked": False,
                    "security_settings.login_attempts": 0,
                    "updated_at": datetime.utcnow()
                },
                "$unset": {
                    "security_settings.lock_until": ""
                }
            }
        )

