import requests

BASE_URL = "http://localhost:8080/api"

def verify_and_login(email, token, password):
    """Verify an email and try to login"""
    
    # 1. Verify the email
    print(f"\n1. Verifying email: {email}")
    print(f"Using token: {token}")
    
    verify_response = requests.get(f"{BASE_URL}/auth/verify-email?token={token}")
    
    print(f"Verify response: {verify_response.status_code}")
    print(f"Verify body: {verify_response.text}")
    
    if verify_response.status_code != 200:
        print("Verification failed. The token might be invalid or already used.")
        return
    
    # 2. Try to login after verification
    print("\n2. Attempting to login after verification")
    
    login_response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    
    print(f"Login response: {login_response.status_code}")
    print(f"Login body: {login_response.text}")
    
    if login_response.status_code == 200:
        print("\nSuccess! Login successful after verification.")
        print(f"JWT Token: {login_response.json().get('token', 'N/A')[:30]}...")
    else:
        print("\nLogin failed after verification.")
    
    # 3. Try to verify with the same token again (should fail)
    print("\n3. Trying to verify with the same token again")
    
    verify_again_response = requests.get(f"{BASE_URL}/auth/verify-email?token={token}")
    
    print(f"Verify again response: {verify_again_response.status_code}")
    print(f"Verify again body: {verify_again_response.text}")

if __name__ == "__main__":
    # Update these with your specific values from the logs
    EMAIL = "nlqlmdkuanzd@cmail.carleton.ca"  # Replace with your test email
    TOKEN = "d1d81a8a2aa6073c7c2b74c6c1da10dd41734c80d8a9e366b8c0658fb3461f49"  # Replace with the token from logs
    PASSWORD = "testpassword123"
    
    verify_and_login(EMAIL, TOKEN, PASSWORD) 