import requests
import json

# Base URL of your backend
BASE_URL = "http://localhost:8080"

# Test user data
register_data = {
    "email": "test@university.edu",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User",
    "university": "Test University"
}

# Register user
print("Registering user...")
response = requests.post(
    f"{BASE_URL}/api/auth/register",
    json=register_data
)

print(f"Status Code: {response.status_code}")
try:
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except json.JSONDecodeError:
    print("Raw Response:", response.text) 