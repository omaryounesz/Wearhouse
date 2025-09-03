import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8080/api"
TOKEN = None  # Will be set after login

def print_response(response):
    print(f"Status: {response.status_code}")
    try:
        print("Response:", json.dumps(response.json(), indent=2))
    except:
        print("Response:", response.text)
    print()

# Register a new user
def register():
    print("Registering user...")
    response = requests.post(f"{BASE_URL}/auth/register", json={
        "email": "test@university.edu",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "university": "Test University"
    })
    print_response(response)
    if response.status_code not in [201, 409]:  # 409 means user already exists
        print("Registration failed")
        sys.exit(1)

# Login to get token
def login():
    global TOKEN
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "test@university.edu",
        "password": "password123"
    })
    print_response(response)
    if response.status_code != 200:
        print("Login failed")
        sys.exit(1)
    TOKEN = response.json().get("token")
    if not TOKEN:
        print("No token in response")
        sys.exit(1)
    return TOKEN

# Helper function to make authenticated requests
def auth_request(method, endpoint, json=None):
    headers = {"Authorization": f"Bearer {TOKEN}"}
    return requests.request(method, f"{BASE_URL}{endpoint}", headers=headers, json=json)

def main():
    # Register and login
    register()
    print("Logging in...")
    token = login()
    print(f"Got token: {token[:20]}...")
    print()

    # Create a test product
    print("Creating test product...")
    product_response = auth_request("POST", "/products", json={
        "title": "Test Product",
        "description": "A test product for order testing",
        "category": "Test",
        "size": "M",
        "brand": "Test Brand",
        "condition": "new",
        "price": 10.00
    })
    print_response(product_response)
    product_id = product_response.json()["id"]

    # Add product to cart
    print("Adding product to cart...")
    cart_response = auth_request("POST", "/cart/items", json={
        "product_id": product_id,
        "quantity": 2
    })
    print_response(cart_response)

    # Create order
    print("Creating order...")
    order_response = auth_request("POST", "/orders", json={
        "shipping_addr": "123 Test St, Test City, TS 12345",
        "billing_addr": "123 Test St, Test City, TS 12345",
        "payment_method": "credit_card"
    })
    print_response(order_response)
    order_id = order_response.json()["id"]

    # Get all orders
    print("Getting all orders...")
    orders_response = auth_request("GET", "/orders")
    print_response(orders_response)

    # Get specific order
    print("Getting specific order...")
    order_response = auth_request("GET", f"/orders/{order_id}")
    print_response(order_response)

    # Update order status
    print("Updating order status...")
    status_response = auth_request("PUT", f"/orders/{order_id}/status", json={
        "status": "paid"
    })
    print_response(status_response)

if __name__ == "__main__":
    main() 