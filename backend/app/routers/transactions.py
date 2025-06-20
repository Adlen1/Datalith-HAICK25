from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.models.schemas import Account, Transaction, TransferCreate, PaymentCreate, User
from app.services.transaction_service import TransactionService
from app.core.dependencies import get_current_user

router = APIRouter()
transaction_service = TransactionService()

@router.get("/accounts", response_model=List[Account])
async def get_user_accounts(current_user: User = Depends(get_current_user)):
    """Get all accounts for the current user"""
    return await transaction_service.get_user_accounts(str(current_user.id))

@router.get("/accounts/{account_id}/balance")
async def get_account_balance(
    account_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get account balance"""
    return await transaction_service.get_account_balance(account_id, str(current_user.id))

@router.post("/transfer", response_model=Transaction)
async def create_transfer(
    transfer_data: TransferCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a money transfer"""
    return await transaction_service.create_transfer(transfer_data, str(current_user.id))

@router.post("/payment", response_model=Transaction)
async def create_payment(
    payment_data: PaymentCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a payment"""
    return await transaction_service.create_payment(payment_data, str(current_user.id))

@router.get("/history", response_model=List[Transaction])
async def get_transaction_history(
    current_user: User = Depends(get_current_user),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    transaction_type: Optional[str] = Query(None),
    status: Optional[str] = Query(None)
):
    """Get transaction history"""
    return await transaction_service.get_transaction_history(
        str(current_user.id), limit, offset, transaction_type, status
    )

@router.get("/transactions/{transaction_id}", response_model=Transaction)
async def get_transaction(
    transaction_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get specific transaction details"""
    return await transaction_service.get_transaction_by_id(transaction_id, str(current_user.id))

