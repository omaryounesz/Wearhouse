import pytest
import requests
import uuid
import random
import string

BASE_URL = "http://localhost:8080/api"

def get_random_name(length=6):
    """Generate a random name using only letters"""
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def get_unique_email():
    """Generate a unique Carleton email address"""
    firstname = get_random_name()
    lastname = get_random_name()
    return f"{firstname}{lastname}@cmail.carleton.ca"

def test_valid_carleton_emails():
    """Test valid Carleton email formats"""
    # Test with some realistic name combinations
    test_cases = [
        "johnsmith@cmail.carleton.ca",
        "janesmith@cmail.carleton.ca",
        get_unique_email(),  # Random valid email
        get_unique_email()   # Another random valid email
    ]
    
    for email in test_cases:
        print(f"\nTesting valid email: {email}")
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": "testpassword123",
            "firstName": "Test",
            "lastName": "User"
        })
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        assert response.status_code == 201, f"Expected valid email {email} to be accepted"
        assert "Registration successful" in response.json()["message"]

def test_invalid_emails():
    """Test invalid email formats"""
    invalid_emails = [
        "test@gmail.com",                    # Wrong domain
        "test@carleton.ca",                  # Wrong subdomain
        "test.name@cmail.carleton.ca",       # Contains period
        "test123@cmail.carleton.ca",         # Contains numbers
        "test-name@cmail.carleton.ca",       # Contains hyphen
        "@cmail.carleton.ca",                # No username
        "test@cmail.ca",                     # Incomplete domain
        "john_smith@cmail.carleton.ca",      # Contains underscore
        "john.smith@cmail.carleton.ca",      # Contains period
        "johnsmith123@cmail.carleton.ca"     # Contains numbers
    ]
    
    for email in invalid_emails:
        print(f"\nTesting invalid email: {email}")
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "email": email,
            "password": "testpassword123",
            "firstName": "Test",
            "lastName": "User"
        })
        
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        assert response.status_code == 400, f"Expected invalid email {email} to be rejected"
        assert "Must use a valid Carleton University email address" in response.json()["error"]

if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 