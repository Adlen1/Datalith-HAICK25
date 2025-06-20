from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import UserCreate, LoginRequest, BiometricLoginRequest, Token, UserResponse, RefreshTokenRequest
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.schemas import User

router = APIRouter()
auth_service = AuthService()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    return await auth_service.register_user(user_data)

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest):
    """Login with email/phone and password"""
    return await auth_service.authenticate_user(login_data)

@router.post("/biometric-login", response_model=Token)
async def biometric_login(biometric_data: BiometricLoginRequest):
    """Login with biometric authentication"""
    return await auth_service.authenticate_biometric(biometric_data)

@router.post("/refresh", response_model=Token)
async def refresh_token(refresh_data: RefreshTokenRequest):
    """Refresh access token"""
    # TODO: Implement token refresh logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh not implemented yet"
    )

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """Logout user"""
    # TODO: Implement token blacklisting
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        phone=current_user.phone,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        kyc_status=current_user.kyc_status,
        preferences=current_user.preferences
    )

