import requests
import json

BASE_URL = "http://localhost:8080"

# Your authentication token
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTk1NTVhMTItY2M3Yy00M2Q2LTlkYjAtZTAxN2I0MjgzMmQxIiwiZW1haWwiOiJ0ZXN0QHVuaXZlcnNpdHkuZWR1IiwiZXhwIjoxNzQyMTg2MzUzLCJpYXQiOjE3NDIwOTk5NTN9.S0LaL_MzcCXgHwiDxUhBJc3WkRHAEioxIIUlGEYJ-3Y"

# Test data for product
product_data = {
    "title": "Test Product",
    "description": "A test product for payment testing with detailed description",
    "category": "Electronics",
    "size": "Medium",
    "brand": "Test Brand",
    "condition": "new",
    "price": 10.00
}

print("Creating product...")
response = requests.post(
    f"{BASE_URL}/api/products/admin",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {AUTH_TOKEN}"
    },
    json=product_data
)

print(f"Status Code: {response.status_code}")
try:
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except json.JSONDecodeError:
    print("Raw Response:", response.text) 