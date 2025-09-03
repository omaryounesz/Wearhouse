import requests
import json

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTdmODMwNmItYzhiZC00MDlkLTkyY2QtZTU2OWYxM2I3OWUyIiwiZW1haWwiOiJ0ZXN0QHVuaXZlcnNpdHkuZWR1IiwiZXhwIjoxNzQyMTc5MTkwLCJpYXQiOjE3NDIwOTI3OTB9.lSwJNdAVJWZIF3-fvwMMzHguiontRRqBwnePolqoBKs'
base_url = 'http://localhost:8080/api'
headers = {'Authorization': f'Bearer {token}'}

def print_response(response):
    print(f"Status: {response.status_code}")
    print("Response:", json.dumps(response.json(), indent=2))
    print()

# Get empty cart
print("Getting empty cart...")
response = requests.get(f"{base_url}/cart", headers=headers)
print_response(response)

# Create a test product
print("Creating test product...")
product_data = {
    'title': 'Test Product',
    'description': 'A test product for cart testing',
    'category': 'Test',
    'size': 'M',
    'brand': 'Test Brand',
    'condition': 'new',
    'price': 10.00
}
response = requests.post(f"{base_url}/products", headers=headers, json=product_data)
print_response(response)
product_id = response.json()['id']

# Add item to cart
print("Adding item to cart...")
cart_data = {
    'product_id': product_id,
    'quantity': 2
}
response = requests.post(f"{base_url}/cart/items", headers=headers, json=cart_data)
print_response(response)

# Update item quantity
print("Updating item quantity...")
cart_item_id = response.json()['items'][0]['id']
update_data = {
    'quantity': 3
}
response = requests.put(f"{base_url}/cart/items/{cart_item_id}", headers=headers, json=update_data)
print_response(response)

# Get cart again
print("Getting updated cart...")
response = requests.get(f"{base_url}/cart", headers=headers)
print_response(response)

# Remove item from cart
print("Removing item from cart...")
response = requests.delete(f"{base_url}/cart/items/{cart_item_id}", headers=headers)
print_response(response)

# Clear cart
print("Clearing cart...")
response = requests.delete(f"{base_url}/cart", headers=headers)
print_response(response) 