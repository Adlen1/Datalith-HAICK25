#!/usr/bin/env python3
"""
Simple test script that doesn't require MongoDB
Tests basic functionality and API structure
"""

import requests
import json

BASE_URL = "http://localhost:8000"
API_V1 = f"{BASE_URL}/api/v1"

def test_basic_endpoints():
    """Test endpoints that don't require database"""
    print("🔍 Testing basic endpoints...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
        
        # Test health endpoint
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health endpoint: {response.status_code} - {response.json()}")
        
        # Test OpenAPI docs
        response = requests.get(f"{BASE_URL}/openapi.json")
        if response.status_code == 200:
            openapi_spec = response.json()
            print(f"✅ OpenAPI spec available - {len(openapi_spec.get('paths', {}))} endpoints defined")
            
            # List available endpoints
            print("\n📋 Available API endpoints:")
            for path, methods in openapi_spec.get('paths', {}).items():
                for method in methods.keys():
                    if method.upper() in ['GET', 'POST', 'PUT', 'DELETE']:
                        print(f"   {method.upper()} {path}")
        else:
            print(f"❌ OpenAPI spec failed: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing basic endpoints: {e}")

def test_legacy_chatbot():
    """Test legacy chatbot endpoint"""
    print("\n🔍 Testing legacy chatbot...")
    
    try:
        chat_data = {"message": "Hello"}
        response = requests.post(f"{BASE_URL}/ask", json=chat_data)
        print(f"Legacy chatbot: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Response: {data.get('response', 'No response')[:100]}...")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error testing chatbot: {e}")

def test_auth_endpoints_structure():
    """Test auth endpoints structure (without database)"""
    print("\n🔍 Testing auth endpoints structure...")
    
    # Test registration endpoint structure
    try:
        invalid_data = {"email": "invalid"}
        response = requests.post(f"{API_V1}/auth/register", json=invalid_data)
        print(f"Registration endpoint: {response.status_code}")
        if response.status_code == 422:
            print("✅ Registration endpoint validates input correctly")
        elif response.status_code == 500:
            print("⚠️  Registration endpoint exists but has database connection issues")
    except Exception as e:
        print(f"❌ Error testing registration: {e}")

def main():
    """Run basic tests"""
    print("🚀 Starting SATIM Pay Backend Basic Tests")
    print("=" * 50)
    
    test_basic_endpoints()
    test_legacy_chatbot()
    test_auth_endpoints_structure()
    
    print("\n" + "=" * 50)
    print("🎉 Basic tests completed!")

if __name__ == "__main__":
    main()

