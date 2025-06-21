from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.core.database import get_database
from app.models.schemas import AIInsight, Transaction, User
from bson import ObjectId
import statistics

class AIInsightsService:
    def __init__(self):
        self.db = get_database()
    
    async def generate_spending_insights(self, user_id: str) -> List[Dict[str, Any]]:
        """Generate AI-powered spending insights for a user"""
        insights = []
        
        # Get user's transactions from last 3 months
        three_months_ago = datetime.utcnow() - timedelta(days=90)
        transactions = []
        
        async for transaction in self.db.transactions.find({
            "from_user_id": ObjectId(user_id),
            "status": "completed",
            "created_at": {"$gte": three_months_ago}
        }):
            transactions.append(transaction)
        
        if not transactions:
            return [{
                "type": "welcome",
                "title": "Bienvenue sur SATIM Pay",
                "description": "Commencez à utiliser votre compte pour recevoir des insights personnalisés sur vos finances.",
                "confidence": 1.0,
                "category": "general"
            }]
        
        # Analyze spending patterns
        insights.extend(await self._analyze_spending_patterns(transactions))
        insights.extend(await self._analyze_spending_categories(transactions))
        insights.extend(await self._generate_savings_recommendations(transactions))
        insights.extend(await self._analyze_spending_trends(transactions))
        
        return insights
    
    async def _analyze_spending_patterns(self, transactions: List[Dict]) -> List[Dict[str, Any]]:
        """Analyze spending patterns and frequency"""
        insights = []
        
        # Calculate daily spending
        daily_spending = {}
        for transaction in transactions:
            date = transaction["created_at"].date()
            amount = transaction["amount"]
            if date not in daily_spending:
                daily_spending[date] = 0
            daily_spending[date] += amount
        
        if len(daily_spending) > 7:
            avg_daily_spending = statistics.mean(daily_spending.values())
            recent_week = list(daily_spending.values())[-7:]
            recent_avg = statistics.mean(recent_week)
            
            if recent_avg > avg_daily_spending * 1.2:
                insights.append({
                    "type": "spending_alert",
                    "title": "Dépenses élevées détectées",
                    "description": f"Vos dépenses cette semaine ({recent_avg:.0f} DZD/jour) sont 20% plus élevées que votre moyenne habituelle ({avg_daily_spending:.0f} DZD/jour).",
                    "confidence": 0.85,
                    "category": "spending",
                    "action_items": [
                        "Vérifiez vos dépenses récentes",
                        "Identifiez les achats non essentiels",
                        "Définissez un budget quotidien"
                    ]
                })
            elif recent_avg < avg_daily_spending * 0.8:
                insights.append({
                    "type": "savings_success",
                    "title": "Excellente gestion des dépenses",
                    "description": f"Félicitations ! Vos dépenses cette semaine sont 20% inférieures à votre moyenne habituelle. Vous économisez environ {(avg_daily_spending - recent_avg) * 7:.0f} DZD par semaine.",
                    "confidence": 0.9,
                    "category": "savings"
                })
        
        return insights
    
    async def _analyze_spending_categories(self, transactions: List[Dict]) -> List[Dict[str, Any]]:
        """Analyze spending by categories"""
        insights = []
        
        # Categorize transactions based on description
        categories = {
            "alimentation": ["supermarché", "restaurant", "café", "boulangerie", "épicerie"],
            "transport": ["taxi", "bus", "métro", "carburant", "parking"],
            "services": ["télécom", "électricité", "gaz", "internet", "mobile"],
            "shopping": ["vêtements", "chaussures", "mode", "magasin"],
            "santé": ["pharmacie", "médecin", "clinique", "hôpital"],
            "loisirs": ["cinéma", "sport", "gym", "divertissement"]
        }
        
        category_spending = {cat: 0 for cat in categories.keys()}
        category_spending["autres"] = 0
        
        for transaction in transactions:
            description = transaction.get("description", "").lower()
            categorized = False
            
            for category, keywords in categories.items():
                if any(keyword in description for keyword in keywords):
                    category_spending[category] += transaction["amount"]
                    categorized = True
                    break
            
            if not categorized:
                category_spending["autres"] += transaction["amount"]
        
        total_spending = sum(category_spending.values())
        if total_spending > 0:
            # Find highest spending category
            max_category = max(category_spending, key=category_spending.get)
            max_percentage = (category_spending[max_category] / total_spending) * 100
            
            if max_percentage > 40:
                insights.append({
                    "type": "category_analysis",
                    "title": f"Dépenses concentrées en {max_category}",
                    "description": f"{max_percentage:.1f}% de vos dépenses sont liées à {max_category} ({category_spending[max_category]:.0f} DZD). Considérez diversifier vos dépenses ou optimiser cette catégorie.",
                    "confidence": 0.8,
                    "category": "analysis",
                    "data": category_spending
                })
        
        return insights
    
    async def _generate_savings_recommendations(self, transactions: List[Dict]) -> List[Dict[str, Any]]:
        """Generate personalized savings recommendations"""
        insights = []
        
        if len(transactions) < 10:
            return insights
        
        # Calculate monthly spending
        monthly_spending = sum(t["amount"] for t in transactions) / 3  # 3 months average
        
        # Suggest savings based on spending level
        if monthly_spending > 50000:  # High spender
            potential_savings = monthly_spending * 0.15
            insights.append({
                "type": "savings_opportunity",
                "title": "Opportunité d'épargne importante",
                "description": f"Avec vos dépenses mensuelles de {monthly_spending:.0f} DZD, vous pourriez économiser jusqu'à {potential_savings:.0f} DZD par mois en optimisant vos achats de 15%.",
                "confidence": 0.75,
                "category": "savings",
                "action_items": [
                    "Créez un budget mensuel",
                    "Identifiez les dépenses récurrentes",
                    "Négociez vos abonnements",
                    "Utilisez des comparateurs de prix"
                ]
            })
        elif monthly_spending > 20000:  # Medium spender
            potential_savings = monthly_spending * 0.10
            insights.append({
                "type": "savings_tip",
                "title": "Conseil d'épargne personnalisé",
                "description": f"Vous pourriez économiser environ {potential_savings:.0f} DZD par mois en réduisant vos dépenses non essentielles de 10%.",
                "confidence": 0.7,
                "category": "savings"
            })
        
        return insights
    
    async def _analyze_spending_trends(self, transactions: List[Dict]) -> List[Dict[str, Any]]:
        """Analyze spending trends over time"""
        insights = []
        
        # Group transactions by month
        monthly_data = {}
        for transaction in transactions:
            month_key = transaction["created_at"].strftime("%Y-%m")
            if month_key not in monthly_data:
                monthly_data[month_key] = 0
            monthly_data[month_key] += transaction["amount"]
        
        if len(monthly_data) >= 2:
            months = sorted(monthly_data.keys())
            current_month = monthly_data[months[-1]]
            previous_month = monthly_data[months[-2]]
            
            change_percent = ((current_month - previous_month) / previous_month) * 100
            
            if change_percent > 20:
                insights.append({
                    "type": "trend_alert",
                    "title": "Augmentation des dépenses",
                    "description": f"Vos dépenses ont augmenté de {change_percent:.1f}% ce mois-ci ({current_month:.0f} DZD) par rapport au mois dernier ({previous_month:.0f} DZD).",
                    "confidence": 0.9,
                    "category": "trend"
                })
            elif change_percent < -20:
                insights.append({
                    "type": "trend_positive",
                    "title": "Réduction des dépenses réussie",
                    "description": f"Excellente nouvelle ! Vos dépenses ont diminué de {abs(change_percent):.1f}% ce mois-ci. Vous économisez {previous_month - current_month:.0f} DZD par rapport au mois dernier.",
                    "confidence": 0.9,
                    "category": "savings"
                })
        
        return insights
    
    async def detect_fraud_patterns(self, user_id: str, transaction_data: Dict) -> Dict[str, Any]:
        """Detect potential fraud patterns in transactions"""
        fraud_score = 0.0
        risk_factors = []
        
        # Get user's transaction history
        user_transactions = []
        async for transaction in self.db.transactions.find({
            "from_user_id": ObjectId(user_id),
            "status": "completed"
        }).limit(100):
            user_transactions.append(transaction)
        
        if user_transactions:
            # Analyze amount patterns
            amounts = [t["amount"] for t in user_transactions]
            avg_amount = statistics.mean(amounts)
            max_amount = max(amounts)
            
            # Check for unusually large transaction
            if transaction_data["amount"] > avg_amount * 5:
                fraud_score += 0.3
                risk_factors.append("Montant inhabituellement élevé")
            
            if transaction_data["amount"] > max_amount * 1.5:
                fraud_score += 0.2
                risk_factors.append("Montant supérieur au maximum historique")
        
        # Check for rapid successive transactions
        recent_transactions = []
        one_hour_ago = datetime.utcnow() - timedelta(hours=1)
        async for transaction in self.db.transactions.find({
            "from_user_id": ObjectId(user_id),
            "created_at": {"$gte": one_hour_ago}
        }):
            recent_transactions.append(transaction)
        
        if len(recent_transactions) > 5:
            fraud_score += 0.4
            risk_factors.append("Transactions multiples en peu de temps")
        
        # Determine risk level
        if fraud_score >= 0.7:
            risk_level = "high"
        elif fraud_score >= 0.4:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "fraud_score": fraud_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "requires_additional_auth": fraud_score >= 0.5
        }
    
    async def generate_financial_forecast(self, user_id: str) -> Dict[str, Any]:
        """Generate financial forecast based on spending patterns"""
        # Get last 6 months of transactions
        six_months_ago = datetime.utcnow() - timedelta(days=180)
        transactions = []
        
        async for transaction in self.db.transactions.find({
            "from_user_id": ObjectId(user_id),
            "status": "completed",
            "created_at": {"$gte": six_months_ago}
        }):
            transactions.append(transaction)
        
        if len(transactions) < 10:
            return {
                "forecast_available": False,
                "message": "Données insuffisantes pour générer une prévision"
            }
        
        # Calculate monthly averages
        monthly_spending = {}
        for transaction in transactions:
            month_key = transaction["created_at"].strftime("%Y-%m")
            if month_key not in monthly_spending:
                monthly_spending[month_key] = 0
            monthly_spending[month_key] += transaction["amount"]
        
        avg_monthly_spending = statistics.mean(monthly_spending.values())
        
        # Simple trend analysis
        months = sorted(monthly_spending.keys())
        if len(months) >= 3:
            recent_trend = statistics.mean([monthly_spending[m] for m in months[-3:]])
            trend_direction = "increasing" if recent_trend > avg_monthly_spending else "decreasing"
        else:
            trend_direction = "stable"
        
        # Generate forecast
        next_month_forecast = avg_monthly_spending
        if trend_direction == "increasing":
            next_month_forecast *= 1.1
        elif trend_direction == "decreasing":
            next_month_forecast *= 0.9
        
        return {
            "forecast_available": True,
            "next_month_forecast": next_month_forecast,
            "average_monthly_spending": avg_monthly_spending,
            "trend_direction": trend_direction,
            "confidence": 0.75,
            "recommendations": [
                f"Budget recommandé pour le mois prochain: {next_month_forecast * 1.1:.0f} DZD",
                f"Épargne potentielle: {max(0, avg_monthly_spending - next_month_forecast):.0f} DZD"
            ]
        }

