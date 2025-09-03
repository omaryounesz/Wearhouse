import requests
import json

BASE_URL = "http://localhost:8080"

# Your authentication token
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTk1NTVhMTItY2M3Yy00M2Q2LTlkYjAtZTAxN2I0MjgzMmQxIiwiZW1haWwiOiJ0ZXN0QHVuaXZlcnNpdHkuZWR1IiwiZXhwIjoxNzQyMTg2MzUzLCJpYXQiOjE3NDIwOTk5NTN9.S0LaL_MzcCXgHwiDxUhBJc3WkRHAEioxIIUlGEYJ-3Y"

# Test data for order
order_data = {
    "items": [
        {
            "product_id": "8947a3a0-e2bf-4b4f-be7e-275b116d5658",  # Product ID from previous step
            "quantity": 1
        }
    ],
    "shipping_addr": "123 Test St, Test City, TS 12345",
    "billing_addr": "123 Test St, Test City, TS 12345",
    "payment_method": "credit_card"
}

print("Creating order...")
response = requests.post(
    f"{BASE_URL}/api/orders",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}"
    },
    json=order_data
)

print(f"Status Code: {response.status_code}")
try:
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except json.JSONDecodeError:
    print("Raw Response:", response.text) 