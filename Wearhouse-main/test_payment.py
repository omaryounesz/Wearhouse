import requests
import json

# Base URL of your backend
BASE_URL = "http://localhost:8080"

# Your authentication token
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTk1NTVhMTItY2M3Yy00M2Q2LTlkYjAtZTAxN2I0MjgzMmQxIiwiZW1haWwiOiJ0ZXN0QHVuaXZlcnNpdHkuZWR1IiwiZXhwIjoxNzQyMTg2MzUzLCJpYXQiOjE3NDIwOTk5NTN9.S0LaL_MzcCXgHwiDxUhBJc3WkRHAEioxIIUlGEYJ-3Y"

# Test data for payment intent
payment_data = {
    "order_id": "7db1b68b-d970-4ea1-9574-117446c8356e",  # Order ID from previous step
    "amount": 1000,  # $10.00 in cents
    "currency": "usd",
    "description": "Test payment for order"
}

# Create payment intent
print("Creating payment intent...")
response = requests.post(
    f"{BASE_URL}/api/payments/create-intent",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}"
    },
    json=payment_data
)

print(f"Status Code: {response.status_code}")
try:
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except json.JSONDecodeError:
    print("Raw Response:", response.text) 