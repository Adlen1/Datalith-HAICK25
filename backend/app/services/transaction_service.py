from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException, status
from app.core.database import get_database
from app.models.schemas import Account, Transaction, TransferCreate, PaymentCreate, TransactionStatus, TransactionType
from bson import ObjectId
import uuid

class TransactionService:
    def __init__(self):
        self.db = get_database()
    
    async def get_user_accounts(self, user_id: str) -> List[Account]:
        """Get all accounts for a user"""
        accounts = []
        async for account_doc in self.db.accounts.find({"user_id": ObjectId(user_id)}):
            accounts.append(Account(**account_doc))
        return accounts
    
    async def get_account_balance(self, account_id: str, user_id: str) -> dict:
        """Get account balance"""
        account = await self.db.accounts.find_one({
            "_id": ObjectId(account_id),
            "user_id": ObjectId(user_id)
        })
        
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found"
            )
        
        return {
            "account_id": str(account["_id"]),
            "balance": account["balance"],
            "available_balance": account["available_balance"],
            "currency": account["currency"]
        }
    
    async def create_transfer(self, transfer_data: TransferCreate, from_user_id: str) -> Transaction:
        """Create a money transfer"""
        # Get sender's primary account
        from_account = await self.db.accounts.find_one({
            "user_id": ObjectId(from_user_id),
            "is_primary": True
        })
        
        if not from_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Sender account not found"
            )
        
        # Check sufficient balance
        if from_account["available_balance"] < transfer_data.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient balance"
            )
        
        # Find recipient account
        to_account = None
        to_user_id = None
        
        if transfer_data.to_account_id:
            to_account = await self.db.accounts.find_one({"_id": transfer_data.to_account_id})
        elif transfer_data.to_phone:
            # Find user by phone and get their primary account
            to_user = await self.db.users.find_one({"phone": transfer_data.to_phone})
            if to_user:
                to_account = await self.db.accounts.find_one({
                    "user_id": to_user["_id"],
                    "is_primary": True
                })
                to_user_id = to_user["_id"]
        elif transfer_data.to_email:
            # Find user by email and get their primary account
            to_user = await self.db.users.find_one({"email": transfer_data.to_email})
            if to_user:
                to_account = await self.db.accounts.find_one({
                    "user_id": to_user["_id"],
                    "is_primary": True
                })
                to_user_id = to_user["_id"]
        
        if not to_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Recipient account not found"
            )
        
        # Create transaction
        transaction_id = f"TXN-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        transaction_doc = {
            "transaction_id": transaction_id,
            "transaction_type": TransactionType.TRANSFER,
            "from_account_id": from_account["_id"],
            "to_account_id": to_account["_id"],
            "from_user_id": ObjectId(from_user_id),
            "to_user_id": to_user_id or to_account["user_id"],
            "amount": transfer_data.amount,
            "currency": "DZD",
            "fee": 0.0,  # No fee for transfers
            "status": TransactionStatus.PENDING,
            "description": transfer_data.description or "Money Transfer",
            "reference_number": f"REF-{str(uuid.uuid4())[:12].upper()}",
            "scheduled_date": transfer_data.scheduled_date or datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert transaction
        result = await self.db.transactions.insert_one(transaction_doc)
        transaction_doc["_id"] = result.inserted_id
        
        # Process transfer if not scheduled
        if not transfer_data.scheduled_date or transfer_data.scheduled_date <= datetime.utcnow():
            await self._process_transfer(transaction_doc)
        
        return Transaction(**transaction_doc)
    
    async def create_payment(self, payment_data: PaymentCreate, from_user_id: str) -> Transaction:
        """Create a payment transaction"""
        # Get user's primary account
        from_account = await self.db.accounts.find_one({
            "user_id": ObjectId(from_user_id),
            "is_primary": True
        })
        
        if not from_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found"
            )
        
        # Check sufficient balance
        if from_account["available_balance"] < payment_data.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient balance"
            )
        
        # Create transaction
        transaction_id = f"PAY-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
        
        transaction_doc = {
            "transaction_id": transaction_id,
            "transaction_type": TransactionType.PAYMENT,
            "from_account_id": from_account["_id"],
            "from_user_id": ObjectId(from_user_id),
            "amount": payment_data.amount,
            "currency": "DZD",
            "fee": 0.0,
            "status": TransactionStatus.PENDING,
            "description": payment_data.description or f"Payment to {payment_data.merchant_name}",
            "reference_number": f"REF-{str(uuid.uuid4())[:12].upper()}",
            "metadata": {
                "merchant_id": payment_data.merchant_id,
                "merchant_name": payment_data.merchant_name,
                "payment_method": payment_data.payment_method
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert transaction
        result = await self.db.transactions.insert_one(transaction_doc)
        transaction_doc["_id"] = result.inserted_id
        
        # Process payment
        await self._process_payment(transaction_doc)
        
        return Transaction(**transaction_doc)
    
    async def get_transaction_history(
        self, 
        user_id: str, 
        limit: int = 50, 
        offset: int = 0,
        transaction_type: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Transaction]:
        """Get transaction history for a user"""
        query = {"$or": [
            {"from_user_id": ObjectId(user_id)},
            {"to_user_id": ObjectId(user_id)}
        ]}
        
        if transaction_type:
            query["transaction_type"] = transaction_type
        
        if status:
            query["status"] = status
        
        transactions = []
        async for transaction_doc in self.db.transactions.find(query).sort("created_at", -1).skip(offset).limit(limit):
            transactions.append(Transaction(**transaction_doc))
        
        return transactions
    
    async def get_transaction_by_id(self, transaction_id: str, user_id: str) -> Transaction:
        """Get specific transaction by ID"""
        transaction = await self.db.transactions.find_one({
            "_id": ObjectId(transaction_id),
            "$or": [
                {"from_user_id": ObjectId(user_id)},
                {"to_user_id": ObjectId(user_id)}
            ]
        })
        
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        
        return Transaction(**transaction)
    
    async def _process_transfer(self, transaction_doc: dict):
        """Process a transfer transaction"""
        try:
            # Update transaction status
            await self.db.transactions.update_one(
                {"_id": transaction_doc["_id"]},
                {
                    "$set": {
                        "status": TransactionStatus.PROCESSING,
                        "processed_date": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Debit from sender account
            await self.db.accounts.update_one(
                {"_id": transaction_doc["from_account_id"]},
                {
                    "$inc": {
                        "balance": -transaction_doc["amount"],
                        "available_balance": -transaction_doc["amount"]
                    },
                    "$set": {
                        "last_transaction_date": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Credit to recipient account
            await self.db.accounts.update_one(
                {"_id": transaction_doc["to_account_id"]},
                {
                    "$inc": {
                        "balance": transaction_doc["amount"],
                        "available_balance": transaction_doc["amount"]
                    },
                    "$set": {
                        "last_transaction_date": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Mark transaction as completed
            await self.db.transactions.update_one(
                {"_id": transaction_doc["_id"]},
                {
                    "$set": {
                        "status": TransactionStatus.COMPLETED,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
        except Exception as e:
            # Mark transaction as failed
            await self.db.transactions.update_one(
                {"_id": transaction_doc["_id"]},
                {
                    "$set": {
                        "status": TransactionStatus.FAILED,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Transfer processing failed"
            )
    
    async def _process_payment(self, transaction_doc: dict):
        """Process a payment transaction"""
        try:
            # Update transaction status
            await self.db.transactions.update_one(
                {"_id": transaction_doc["_id"]},
                {
                    "$set": {
                        "status": TransactionStatus.PROCESSING,
                        "processed_date": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Debit from account
            await self.db.accounts.update_one(
                {"_id": transaction_doc["from_account_id"]},
                {
                    "$inc": {
                        "balance": -transaction_doc["amount"],
                        "available_balance": -transaction_doc["amount"]
                    },
                    "$set": {
                        "last_transaction_date": datetime.utcnow(),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Mark transaction as completed
            await self.db.transactions.update_one(
                {"_id": transaction_doc["_id"]},
                {
                    "$set": {
                        "status": TransactionStatus.COMPLETED,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
        except Exception as e:
            # Mark transaction as failed
            await self.db.transactions.update_one(
                {"_id": transaction_doc["_id"]},
                {
                    "$set": {
                        "status": TransactionStatus.FAILED,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Payment processing failed"
            )

