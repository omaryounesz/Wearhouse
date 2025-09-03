import requests
import json

# Base URL of your backend
BASE_URL = "http://localhost:8080"

# Test user credentials
login_data = {
    "email": "test@university.edu",
    "password": "password123"
}

# Login to get token
print("Logging in...")
response = requests.post(
    f"{BASE_URL}/api/auth/login",
    json=login_data
)

print(f"Status Code: {response.status_code}")
print("Response:")
print(json.dumps(response.json(), indent=2)) 