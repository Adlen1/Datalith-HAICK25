from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")
        return field_schema

# User Models
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SUPPORT = "support"

class AccountType(str, Enum):
    CHECKING = "checking"
    SAVINGS = "savings"
    BUSINESS = "business"

class TransactionType(str, Enum):
    TRANSFER = "transfer"
    PAYMENT = "payment"
    WITHDRAWAL = "withdrawal"
    DEPOSIT = "deposit"

class TransactionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class NotificationType(str, Enum):
    TRANSACTION = "transaction"
    SECURITY = "security"
    PROMOTION = "promotion"
    SYSTEM = "system"

# Base Models
class UserBase(BaseModel):
    email: EmailStr
    phone: str
    first_name: str
    last_name: str
    date_of_birth: Optional[datetime] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[datetime] = None

class BiometricData(BaseModel):
    fingerprint_hash: Optional[str] = None
    face_recognition_data: Optional[str] = None
    is_biometric_enabled: bool = False

class SecuritySettings(BaseModel):
    two_factor_enabled: bool = False
    login_attempts: int = 0
    last_login: Optional[datetime] = None
    account_locked: bool = False
    lock_until: Optional[datetime] = None

class UserPreferences(BaseModel):
    language: str = "fr"
    currency: str = "DZD"
    notifications: Dict[str, bool] = {
        "email": True,
        "sms": True,
        "push": True
    }

class Address(BaseModel):
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "Algeria"

class User(UserBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    password_hash: str
    role: UserRole = UserRole.USER
    address: Optional[Address] = None
    biometric_data: Optional[BiometricData] = None
    security_settings: Optional[SecuritySettings] = None
    preferences: Optional[UserPreferences] = None
    kyc_status: str = "pending"
    account_type: str = "individual"
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    phone: str
    first_name: str
    last_name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    kyc_status: str
    preferences: Optional[UserPreferences] = None

# Account Models
class AccountBase(BaseModel):
    account_type: AccountType
    currency: str = "DZD"

class AccountCreate(AccountBase):
    user_id: PyObjectId

class Account(AccountBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    account_number: str
    balance: float = 0.0
    available_balance: float = 0.0
    status: str = "active"
    daily_limit: float = 100000.0  # DZD
    monthly_limit: float = 1000000.0  # DZD
    is_primary: bool = False
    opened_date: datetime = Field(default_factory=datetime.utcnow)
    last_transaction_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Transaction Models
class TransactionMetadata(BaseModel):
    ip_address: Optional[str] = None
    device_info: Optional[str] = None
    location: Optional[str] = None
    authentication_method: Optional[str] = None

class AIAnalysis(BaseModel):
    fraud_score: float = 0.0
    risk_level: str = "low"
    category: Optional[str] = None
    merchant_info: Optional[Dict[str, Any]] = None

class TransactionBase(BaseModel):
    transaction_type: TransactionType
    amount: float
    currency: str = "DZD"
    description: Optional[str] = None

class TransferCreate(BaseModel):
    to_account_id: Optional[PyObjectId] = None
    to_phone: Optional[str] = None
    to_email: Optional[EmailStr] = None
    amount: float
    description: Optional[str] = None
    scheduled_date: Optional[datetime] = None

class PaymentCreate(BaseModel):
    merchant_id: Optional[str] = None
    merchant_name: Optional[str] = None
    amount: float
    description: Optional[str] = None
    payment_method: str = "account"

class Transaction(TransactionBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    transaction_id: str
    from_account_id: Optional[PyObjectId] = None
    to_account_id: Optional[PyObjectId] = None
    from_user_id: Optional[PyObjectId] = None
    to_user_id: Optional[PyObjectId] = None
    fee: float = 0.0
    status: TransactionStatus = TransactionStatus.PENDING
    reference_number: Optional[str] = None
    scheduled_date: Optional[datetime] = None
    processed_date: Optional[datetime] = None
    metadata: Optional[TransactionMetadata] = None
    ai_analysis: Optional[AIAnalysis] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Notification Models
class NotificationBase(BaseModel):
    type: NotificationType
    title: str
    message: str
    priority: str = "normal"

class NotificationCreate(NotificationBase):
    user_id: PyObjectId
    channels: List[str] = ["push"]
    metadata: Optional[Dict[str, Any]] = None
    scheduled_at: Optional[datetime] = None

class Notification(NotificationBase):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    status: str = "pending"
    channels: List[str] = ["push"]
    metadata: Optional[Dict[str, Any]] = None
    scheduled_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# AI Models
class ChatMessage(BaseModel):
    message_id: str
    type: str  # "user" or "bot"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

class ChatSession(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    session_id: str
    messages: List[ChatMessage] = []
    status: str = "active"
    started_at: datetime = Field(default_factory=datetime.utcnow)
    ended_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class AIInsight(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    insight_type: str
    title: str
    description: str
    data: Optional[Dict[str, Any]] = None
    confidence_score: float = 0.0
    category: str
    action_items: List[str] = []
    is_read: bool = False
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Authentication Models
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None

class LoginRequest(BaseModel):
    email_or_phone: str
    password: str

class BiometricLoginRequest(BaseModel):
    user_id: str
    biometric_data: str
    biometric_type: str  # "fingerprint" or "face"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

