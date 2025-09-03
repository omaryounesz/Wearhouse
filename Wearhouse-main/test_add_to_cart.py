import requests
import json

# Base URL of your backend
BASE_URL = "http://localhost:8080"

# Your authentication token
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTk1NTVhMTItY2M3Yy00M2Q2LTlkYjAtZTAxN2I0MjgzMmQxIiwiZW1haWwiOiJ0ZXN0QHVuaXZlcnNpdHkuZWR1IiwiZXhwIjoxNzQyMTg2MzUzLCJpYXQiOjE3NDIwOTk5NTN9.S0LaL_MzcCXgHwiDxUhBJc3WkRHAEioxIIUlGEYJ-3Y"

# Test data for cart
cart_data = {
    "product_id": "ce1e648c-7cae-4126-86d7-ea0e81bc9577",  # Product ID from previous step
    "quantity": 1
}

print("Adding item to cart...")
response = requests.post(
    f"{BASE_URL}/api/cart/items",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}"
    },
    json=cart_data
)

print(f"Status Code: {response.status_code}")
try:
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except json.JSONDecodeError:
    print("Raw Response:", response.text) 