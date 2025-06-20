from typing import List, Dict, Any, Optional
from datetime import datetime
from app.core.database import get_database
from app.models.schemas import ChatSession, ChatMessage, User
from app.services.ai_insights_service import AIInsightsService
from app.services.transaction_service import TransactionService
from bson import ObjectId
import uuid
import re

class EnhancedChatbotService:
    def __init__(self):
        self.db = get_database()
        self.ai_insights = AIInsightsService()
        self.transaction_service = TransactionService()
        
        # Banking-specific intents and responses
        self.intents = {
            "balance_inquiry": {
                "keywords": ["solde", "balance", "combien", "argent", "compte"],
                "response_template": "Votre solde actuel est de {balance} DZD. Votre solde disponible est de {available_balance} DZD."
            },
            "transaction_history": {
                "keywords": ["historique", "transactions", "opérations", "mouvements"],
                "response_template": "Voici vos dernières transactions. Vous avez effectué {count} transactions ce mois-ci."
            },
            "transfer_help": {
                "keywords": ["virement", "envoyer", "transférer", "transfer"],
                "response_template": "Je peux vous aider à effectuer un virement. Vous pouvez envoyer de l'argent par numéro de téléphone ou email."
            },
            "payment_help": {
                "keywords": ["paiement", "payer", "facture", "bill"],
                "response_template": "Pour effectuer un paiement, je peux vous guider vers la section paiements où vous pourrez régler vos factures."
            },
            "security_info": {
                "keywords": ["sécurité", "sécurisé", "protection", "fraud", "fraude"],
                "response_template": "Votre compte est protégé par un chiffrement de niveau bancaire et une authentification biométrique."
            },
            "help_support": {
                "keywords": ["aide", "help", "support", "problème", "assistance"],
                "response_template": "Je suis là pour vous aider ! Vous pouvez me poser des questions sur vos comptes, transactions, ou utiliser les actions rapides."
            }
        }
    
    async def process_message(self, user_id: str, message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """Process user message and generate intelligent response"""
        
        # Get or create chat session
        if not session_id:
            session_id = str(uuid.uuid4())
        
        session = await self._get_or_create_session(user_id, session_id)
        
        # Analyze user intent
        intent = await self._analyze_intent(message)
        
        # Generate contextual response
        response = await self._generate_response(user_id, message, intent)
        
        # Save message to session
        user_message = ChatMessage(
            message_id=str(uuid.uuid4()),
            type="user",
            content=message,
            timestamp=datetime.utcnow()
        )
        
        bot_message = ChatMessage(
            message_id=str(uuid.uuid4()),
            type="bot",
            content=response["content"],
            timestamp=datetime.utcnow(),
            metadata=response.get("metadata", {})
        )
        
        # Update session
        await self.db.chat_sessions.update_one(
            {"_id": session["_id"]},
            {
                "$push": {
                    "messages": {
                        "$each": [user_message.dict(), bot_message.dict()]
                    }
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return {
            "response": response["content"],
            "session_id": session_id,
            "suggestions": response.get("suggestions", []),
            "actions": response.get("actions", []),
            "intent": intent
        }
    
    async def _get_or_create_session(self, user_id: str, session_id: str) -> Dict:
        """Get existing session or create new one"""
        session = await self.db.chat_sessions.find_one({
            "user_id": ObjectId(user_id),
            "session_id": session_id
        })
        
        if not session:
            session_doc = {
                "user_id": ObjectId(user_id),
                "session_id": session_id,
                "messages": [],
                "status": "active",
                "started_at": datetime.utcnow(),
                "created_at": datetime.utcnow()
            }
            result = await self.db.chat_sessions.insert_one(session_doc)
            session_doc["_id"] = result.inserted_id
            return session_doc
        
        return session
    
    async def _analyze_intent(self, message: str) -> str:
        """Analyze user message to determine intent"""
        message_lower = message.lower()
        
        # Check for specific intents
        for intent, config in self.intents.items():
            if any(keyword in message_lower for keyword in config["keywords"]):
                return intent
        
        # Check for numbers (might be asking about specific amounts)
        if re.search(r'\d+', message):
            if any(word in message_lower for word in ["envoyer", "virement", "transférer"]):
                return "transfer_help"
            elif any(word in message_lower for word in ["payer", "paiement"]):
                return "payment_help"
        
        return "general"
    
    async def _generate_response(self, user_id: str, message: str, intent: str) -> Dict[str, Any]:
        """Generate contextual response based on intent and user data"""
        
        response = {
            "content": "",
            "suggestions": [],
            "actions": [],
            "metadata": {}
        }
        
        try:
            if intent == "balance_inquiry":
                response = await self._handle_balance_inquiry(user_id)
            elif intent == "transaction_history":
                response = await self._handle_transaction_history(user_id)
            elif intent == "transfer_help":
                response = await self._handle_transfer_help(user_id, message)
            elif intent == "payment_help":
                response = await self._handle_payment_help(user_id)
            elif intent == "security_info":
                response = await self._handle_security_info(user_id)
            elif intent == "help_support":
                response = await self._handle_help_support()
            else:
                response = await self._handle_general_query(user_id, message)
                
        except Exception as e:
            response["content"] = "Je rencontre une difficulté technique. Veuillez réessayer ou contacter notre support."
            response["suggestions"] = ["Contacter le support", "Réessayer plus tard"]
        
        return response
    
    async def _handle_balance_inquiry(self, user_id: str) -> Dict[str, Any]:
        """Handle balance inquiry"""
        try:
            accounts = await self.transaction_service.get_user_accounts(user_id)
            if accounts:
                primary_account = next((acc for acc in accounts if acc.is_primary), accounts[0])
                
                return {
                    "content": f"Votre solde actuel est de {primary_account.balance:,.0f} DZD. Votre solde disponible est de {primary_account.available_balance:,.0f} DZD.",
                    "suggestions": [
                        "Voir l'historique",
                        "Faire un virement",
                        "Voir les insights IA"
                    ],
                    "actions": [
                        {"type": "view_history", "label": "Voir l'historique"},
                        {"type": "make_transfer", "label": "Faire un virement"}
                    ],
                    "metadata": {
                        "balance": primary_account.balance,
                        "available_balance": primary_account.available_balance
                    }
                }
            else:
                return {
                    "content": "Je ne peux pas accéder à vos informations de compte pour le moment. Veuillez réessayer.",
                    "suggestions": ["Réessayer", "Contacter le support"]
                }
        except Exception:
            return {
                "content": "Impossible d'accéder aux informations de solde pour le moment.",
                "suggestions": ["Réessayer plus tard", "Contacter le support"]
            }
    
    async def _handle_transaction_history(self, user_id: str) -> Dict[str, Any]:
        """Handle transaction history request"""
        try:
            transactions = await self.transaction_service.get_transaction_history(user_id, limit=5)
            
            if transactions:
                recent_count = len(transactions)
                total_amount = sum(abs(t.amount) for t in transactions if t.from_user_id == ObjectId(user_id))
                
                content = f"Vous avez effectué {recent_count} transactions récemment. "
                if total_amount > 0:
                    content += f"Le montant total de vos dépenses récentes est de {total_amount:,.0f} DZD."
                
                return {
                    "content": content,
                    "suggestions": [
                        "Voir toutes les transactions",
                        "Analyser mes dépenses",
                        "Faire un virement"
                    ],
                    "actions": [
                        {"type": "view_full_history", "label": "Historique complet"},
                        {"type": "spending_analysis", "label": "Analyse des dépenses"}
                    ],
                    "metadata": {
                        "transaction_count": recent_count,
                        "total_amount": total_amount
                    }
                }
            else:
                return {
                    "content": "Vous n'avez pas encore effectué de transactions. Commencez par faire un virement ou un paiement !",
                    "suggestions": [
                        "Faire un virement",
                        "Effectuer un paiement",
                        "Aide pour débuter"
                    ]
                }
        except Exception:
            return {
                "content": "Impossible d'accéder à votre historique pour le moment.",
                "suggestions": ["Réessayer plus tard"]
            }
    
    async def _handle_transfer_help(self, user_id: str, message: str) -> Dict[str, Any]:
        """Handle transfer assistance"""
        # Check if user mentioned an amount
        amount_match = re.search(r'(\d+(?:\.\d+)?)', message)
        amount = amount_match.group(1) if amount_match else None
        
        content = "Je peux vous aider à effectuer un virement. "
        if amount:
            content += f"Vous souhaitez envoyer {amount} DZD ? "
        
        content += "Vous pouvez envoyer de l'argent en utilisant le numéro de téléphone ou l'email du destinataire."
        
        return {
            "content": content,
            "suggestions": [
                "Commencer un virement",
                "Voir mes contacts",
                "Aide sur les virements"
            ],
            "actions": [
                {"type": "start_transfer", "label": "Nouveau virement", "data": {"amount": amount}},
                {"type": "view_contacts", "label": "Mes contacts"}
            ],
            "metadata": {"suggested_amount": amount}
        }
    
    async def _handle_payment_help(self, user_id: str) -> Dict[str, Any]:
        """Handle payment assistance"""
        return {
            "content": "Je peux vous aider avec vos paiements. Vous pouvez régler vos factures (électricité, téléphone, internet) ou effectuer des paiements marchands.",
            "suggestions": [
                "Payer une facture",
                "Paiement marchand",
                "Voir les factures récurrentes"
            ],
            "actions": [
                {"type": "pay_bill", "label": "Payer une facture"},
                {"type": "merchant_payment", "label": "Paiement marchand"}
            ]
        }
    
    async def _handle_security_info(self, user_id: str) -> Dict[str, Any]:
        """Handle security information request"""
        return {
            "content": "Votre compte SATIM Pay est protégé par un chiffrement SSL 256-bit, une authentification biométrique, et une surveillance IA en temps réel contre la fraude. Toutes vos transactions sont sécurisées selon les standards bancaires internationaux.",
            "suggestions": [
                "Configurer la biométrie",
                "Voir les paramètres de sécurité",
                "Signaler un problème"
            ],
            "actions": [
                {"type": "security_settings", "label": "Paramètres de sécurité"},
                {"type": "report_issue", "label": "Signaler un problème"}
            ]
        }
    
    async def _handle_help_support(self) -> Dict[str, Any]:
        """Handle general help request"""
        return {
            "content": "Je suis votre assistant SATIM Pay ! Je peux vous aider avec vos comptes, transactions, virements, paiements, et questions de sécurité. Utilisez les actions rapides ci-dessous ou posez-moi directement vos questions.",
            "suggestions": [
                "Voir mon solde",
                "Faire un virement",
                "Historique des transactions",
                "Contacter le support humain"
            ],
            "actions": [
                {"type": "balance_inquiry", "label": "Mon solde"},
                {"type": "start_transfer", "label": "Nouveau virement"},
                {"type": "view_history", "label": "Historique"},
                {"type": "human_support", "label": "Support humain"}
            ]
        }
    
    async def _handle_general_query(self, user_id: str, message: str) -> Dict[str, Any]:
        """Handle general queries using AI"""
        # Use the existing chatbot for general queries
        from chatbot import ask_assistant
        
        # Enhanced context for banking
        banking_context = f"""
        Tu es un assistant bancaire pour SATIM Pay en Algérie. 
        Réponds en français de manière professionnelle et utile.
        
        Contexte bancaire:
        - Plateforme de paiement algérienne
        - Services: virements, paiements, gestion de compte
        - Sécurité: biométrie, chiffrement SSL, surveillance IA
        - Devise: Dinar algérien (DZD)
        
        Question de l'utilisateur: {message}
        """
        
        ai_response = ask_assistant(banking_context)
        
        return {
            "content": ai_response,
            "suggestions": [
                "Voir mon solde",
                "Faire un virement",
                "Aide et support",
                "Paramètres de sécurité"
            ],
            "actions": [
                {"type": "balance_inquiry", "label": "Mon solde"},
                {"type": "help", "label": "Plus d'aide"}
            ]
        }
    
    async def get_chat_history(self, user_id: str, session_id: str) -> List[ChatMessage]:
        """Get chat history for a session"""
        session = await self.db.chat_sessions.find_one({
            "user_id": ObjectId(user_id),
            "session_id": session_id
        })
        
        if session and "messages" in session:
            return [ChatMessage(**msg) for msg in session["messages"]]
        
        return []
    
    async def end_session(self, user_id: str, session_id: str):
        """End a chat session"""
        await self.db.chat_sessions.update_one(
            {
                "user_id": ObjectId(user_id),
                "session_id": session_id
            },
            {
                "$set": {
                    "status": "ended",
                    "ended_at": datetime.utcnow()
                }
            }
        )

