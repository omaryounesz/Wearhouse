import pytest
import requests
import time
import uuid
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8080/api"

def test_registration_with_invalid_email():
    """Test registration with non-Carleton email address"""
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "test@gmail.com",
        "password": "testpassword123",
        "firstName": "Test",
        "lastName": "User"
    })
    
    assert response.status_code == 400
    assert "Must use a valid Carleton University email address" in response.json()["error"]

def test_registration_with_valid_email():
    """Test registration with valid Carleton email address"""
    unique_id = str(uuid.uuid4())[:8]
    email = f"test{unique_id}@cmail.carleton.ca"
    
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": "testpassword123",
        "firstName": "John",
        "lastName": "Doe"
    })
    
    print(f"Response status: {response.status_code}")
    print(f"Response body: {response.text}")
    
    assert response.status_code == 201
    assert "Registration successful" in response.json()["message"]
    
    return email  # Return email for use in subsequent tests

def test_login_before_verification():
    """Test login attempt before email verification"""
    email = test_registration_with_valid_email()  # Get the email from registration
    
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": "testpassword123"
    })
    
    assert response.status_code == 401
    assert "Please verify your email before logging in" in response.json()["error"]

def test_verify_email_invalid_token():
    """Test email verification with invalid token"""
    response = requests.get(f"{BASE_URL}/auth/verify-email?token=invalid_token")
    
    assert response.status_code == 404
    assert "Invalid verification token" in response.json()["error"]

# Note: We can't fully test the email verification process in an automated way
# because we need to extract the verification token from the email.
# In a real testing environment, you might want to:
# 1. Mock the email sending service
# 2. Directly extract the token from the database
# 3. Use a test email service that allows programmatic access to received emails 