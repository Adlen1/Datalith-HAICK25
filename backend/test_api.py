#!/usr/bin/env python3
"""
Test script for SATIM Pay Backend API
Tests all major endpoints and functionality
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"

def test_health_endpoints():
    """Test basic health endpoints"""
    print("🔍 Testing health endpoints...")
    
    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    print("✅ Root endpoint working")
    
    # Test health endpoint
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    print("✅ Health endpoint working")

def test_user_registration():
    """Test user registration"""
    print("\n🔍 Testing user registration...")
    
    user_data = {
        "email": "test@example.com",
        "phone": "+213555123456",
        "first_name": "Ahmed",
        "last_name": "Benali",
        "password": "SecurePassword123!"
    }
    
    response = requests.post(f"{API_V1}/auth/register", json=user_data)
    print(f"Registration response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ User registration successful")
        print(f"   User ID: {data['id']}")
        print(f"   Email: {data['email']}")
        return data
    else:
        print(f"❌ Registration failed: {response.text}")
        return None

def test_user_login(email, password):
    """Test user login"""
    print("\n🔍 Testing user login...")
    
    login_data = {
        "email_or_phone": email,
        "password": password
    }
    
    response = requests.post(f"{API_V1}/auth/login", json=login_data)
    print(f"Login response status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ User login successful")
        print(f"   Token type: {data['token_type']}")
        return data["access_token"]
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_authenticated_endpoints(token):
    """Test endpoints that require authentication"""
    print("\n🔍 Testing authenticated endpoints...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test get current user
    response = requests.get(f"{API_V1}/auth/me", headers=headers)
    if response.status_code == 200:
        data = response.json()
        print("✅ Get current user working")
        print(f"   User: {data['first_name']} {data['last_name']}")
    else:
        print(f"❌ Get current user failed: {response.text}")
    
    # Test get accounts
    response = requests.get(f"{API_V1}/transactions/accounts", headers=headers)
    if response.status_code == 200:
        accounts = response.json()
        print(f"✅ Get accounts working - Found {len(accounts)} accounts")
        if accounts:
            account_id = str(accounts[0]["id"])
            
            # Test get balance
            response = requests.get(f"{API_V1}/transactions/accounts/{account_id}/balance", headers=headers)
            if response.status_code == 200:
                balance_data = response.json()
                print(f"✅ Get balance working - Balance: {balance_data['balance']} DZD")
            else:
                print(f"❌ Get balance failed: {response.text}")
    else:
        print(f"❌ Get accounts failed: {response.text}")

def test_ai_endpoints(token):
    """Test AI-related endpoints"""
    print("\n🔍 Testing AI endpoints...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test AI insights
    response = requests.get(f"{API_V1}/ai/insights", headers=headers)
    if response.status_code == 200:
        insights = response.json()
        print(f"✅ AI insights working - Found {len(insights['insights'])} insights")
    else:
        print(f"❌ AI insights failed: {response.text}")
    
    # Test chatbot
    chat_data = {
        "message": "Bonjour, quel est mon solde ?",
        "session_id": "test-session-123"
    }
    
    response = requests.post(f"{API_V1}/ai/chat", json=chat_data, headers=headers)
    if response.status_code == 200:
        chat_response = response.json()
        print("✅ AI chatbot working")
        print(f"   Response: {chat_response['response'][:100]}...")
        print(f"   Suggestions: {len(chat_response['suggestions'])}")
    else:
        print(f"❌ AI chatbot failed: {response.text}")

def test_legacy_chatbot():
    """Test legacy chatbot endpoint"""
    print("\n🔍 Testing legacy chatbot endpoint...")
    
    chat_data = {"message": "Hello, how can you help me?"}
    
    response = requests.post(f"{BASE_URL}/ask", json=chat_data)
    if response.status_code == 200:
        data = response.json()
        print("✅ Legacy chatbot working")
        print(f"   Response: {data['response'][:100]}...")
    else:
        print(f"❌ Legacy chatbot failed: {response.text}")

def main():
    """Run all tests"""
    print("🚀 Starting SATIM Pay Backend API Tests")
    print("=" * 50)
    
    try:
        # Test basic endpoints
        test_health_endpoints()
        
        # Test legacy chatbot
        test_legacy_chatbot()
        
        # Test user registration
        user_data = test_user_registration()
        if not user_data:
            print("❌ Cannot continue tests without user registration")
            return
        
        # Test user login
        token = test_user_login(user_data["email"], "SecurePassword123!")
        if not token:
            print("❌ Cannot continue tests without authentication")
            return
        
        # Test authenticated endpoints
        test_authenticated_endpoints(token)
        
        # Test AI endpoints
        test_ai_endpoints(token)
        
        print("\n" + "=" * 50)
        print("🎉 All tests completed!")
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

