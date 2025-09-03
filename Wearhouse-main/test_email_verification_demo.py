import requests
import random
import string
import time

BASE_URL = "http://localhost:8080/api"

def get_random_name(length=6):
    """Generate a random name using only letters"""
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def get_unique_email():
    """Generate a unique Carleton email address"""
    firstname = get_random_name()
    lastname = get_random_name()
    return f"{firstname}{lastname}@cmail.carleton.ca"

def demo_verification_flow():
    """Demonstrate the entire email verification flow"""
    
    # 1. Register with a valid Carleton email
    email = get_unique_email()
    print(f"\n1. Registering with email: {email}")
    print(f"This would send a verification email to: {email}")
    
    register_response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": "testpassword123",
        "firstName": "Test",
        "lastName": "User"
    })
    
    print(f"Register response: {register_response.status_code}")
    print(f"Register body: {register_response.text}")
    
    if register_response.status_code != 201:
        print("Registration failed. Exiting demo.")
        return
    
    # 2. Try to log in before verification (should fail)
    print("\n2. Attempting to log in before verification")
    
    login_response_before = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": "testpassword123"
    })
    
    print(f"Login before verification response: {login_response_before.status_code}")
    print(f"Login before verification body: {login_response_before.text}")
    
    # 3. Get verification token from user input (simulating clicking the email link)
    print("\n3. In a real scenario, the user would receive an email with a verification link")
    print("   The email would contain a link like: http://yourdomain.com/verify-email?token=VERIFICATION_TOKEN")
    
    print("\n   Since we can't access the database directly or view the email,")
    print("   we'll simulate this step by having you check the Docker logs to find the token.")
    
    print("\n   Please run this command in another terminal:")
    print(f'   docker logs wearhouse-backend-1 | grep -A 10 "{email}"')
    print("\n   You should look for a verification token or a log message showing the token.")
    
    token = input("\nEnter the verification token you found (or press Enter to skip this step): ").strip()
    
    if not token:
        print("Skipping verification. In a real scenario, the user would click the link in their email.")
        print("Demo completed with partial flow.")
        return
    
    # 4. Verify the email
    print("\n4. Verifying the email using token")
    
    verify_response = requests.get(f"{BASE_URL}/auth/verify-email?token={token}")
    
    print(f"Verify response: {verify_response.status_code}")
    print(f"Verify body: {verify_response.text}")
    
    if verify_response.status_code != 200:
        print("Verification failed. Either the token is invalid or it has already been used.")
        print("Demo completed with partial flow.")
        return
    
    # 5. Try to log in after verification (should succeed)
    print("\n5. Attempting to log in after verification")
    
    login_response_after = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": "testpassword123"
    })
    
    print(f"Login after verification response: {login_response_after.status_code}")
    print(f"Login after verification body: {login_response_after.text}")
    
    if login_response_after.status_code == 200:
        print("\nSuccess! The user has successfully verified their email and logged in.")
        print(f"JWT Token: {login_response_after.json().get('token', 'N/A')[:30]}...")
    else:
        print("\nSomething went wrong during login after verification.")
    
    # 6. Try to verify with the same token again (should fail)
    print("\n6. Trying to verify with the same token again")
    
    verify_again_response = requests.get(f"{BASE_URL}/auth/verify-email?token={token}")
    
    print(f"Verify again response: {verify_again_response.status_code}")
    print(f"Verify again body: {verify_again_response.text}")
    
    print("\nFull verification flow demo completed!")
    print(f"\nEmail used: {email}")
    print("Password: testpassword123")

if __name__ == "__main__":
    demo_verification_flow() 