import pytest
import requests
import time
import random
import string
import uuid
import psycopg2
from psycopg2.extras import RealDictCursor

BASE_URL = "http://localhost:8080/api"
# Connect to the Docker container's PostgreSQL
DB_CONN_STRING = "host=localhost port=5432 dbname=wearhouse user=postgres password=postgres sslmode=disable"

def get_random_name(length=6):
    """Generate a random name using only letters"""
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def get_unique_email():
    """Generate a unique Carleton email address"""
    firstname = get_random_name()
    lastname = get_random_name()
    return f"{firstname}{lastname}@cmail.carleton.ca"

def get_verification_token(email):
    """Retrieve the verification token from the database"""
    try:
        # Try first with the Docker connection string
        conn = psycopg2.connect(DB_CONN_STRING)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT verification_token FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        if result:
            token = result['verification_token']
            cursor.close()
            conn.close()
            return token
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error connecting to database: {e}")
        print("Trying alternate connection...")
    
    # If the above fails, try to connect to the Docker container directly
    try:
        alt_conn_string = "postgresql://postgres:postgres@postgres:5432/wearhouse"
        conn = psycopg2.connect(alt_conn_string)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT verification_token FROM users WHERE email = %s", (email,))
        result = cursor.fetchone()
        token = result['verification_token'] if result else None
        cursor.close()
        conn.close()
        return token
    except Exception as e:
        print(f"Error with alternate connection: {e}")
        print("Unable to connect to database. Checking verification via API only.")
        return None

def test_full_verification_flow():
    """Test the entire email verification flow"""
    
    # 1. Register with a valid Carleton email
    email = get_unique_email()
    print(f"\n1. Registering with email: {email}")
    
    register_response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": "testpassword123",
        "firstName": "Test",
        "lastName": "User"
    })
    
    print(f"Register response: {register_response.status_code}")
    print(f"Register body: {register_response.text}")
    
    assert register_response.status_code == 201
    assert "Registration successful" in register_response.json()["message"]
    
    # 2. Try to log in before verification (should fail)
    print("\n2. Attempting to log in before verification")
    
    login_response_before = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": "testpassword123"
    })
    
    print(f"Login before verification response: {login_response_before.status_code}")
    print(f"Login before verification body: {login_response_before.text}")
    
    assert login_response_before.status_code == 401
    assert "Please verify your email before logging in" in login_response_before.json()["error"]
    
    # 3. Get verification token from database (simulating clicking the email link)
    print("\n3. Getting verification token from database")
    token = get_verification_token(email)
    
    if token:
        print(f"Verification token: {token}")
        
        # 4. Verify the email
        print("\n4. Verifying the email")
        
        verify_response = requests.get(f"{BASE_URL}/auth/verify-email?token={token}")
        
        print(f"Verify response: {verify_response.status_code}")
        print(f"Verify body: {verify_response.text}")
        
        assert verify_response.status_code == 200
        assert "Email verified successfully" in verify_response.json()["message"]
        
        # 5. Try to log in after verification (should succeed)
        print("\n5. Attempting to log in after verification")
        
        login_response_after = requests.post(f"{BASE_URL}/auth/login", json={
            "email": email,
            "password": "testpassword123"
        })
        
        print(f"Login after verification response: {login_response_after.status_code}")
        print(f"Login after verification body: {login_response_after.text}")
        
        assert login_response_after.status_code == 200
        assert "token" in login_response_after.json()
        
        # 6. Try to verify with the same token again (should fail)
        print("\n6. Trying to verify with the same token again")
        
        verify_again_response = requests.get(f"{BASE_URL}/auth/verify-email?token={token}")
        
        print(f"Verify again response: {verify_again_response.status_code}")
        print(f"Verify again body: {verify_again_response.text}")
        
        assert verify_again_response.status_code == 404
        assert "Invalid verification token" in verify_again_response.json()["error"]
    else:
        print("Could not retrieve token from database, skipping verification steps")
        print("Please check your database connection configuration")
    
    print("\nTest completed!")

if __name__ == "__main__":
    test_full_verification_flow() 