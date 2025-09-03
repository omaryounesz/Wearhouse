import requests
import json
from PIL import Image
import io
import os

# Base URL for the backend
BASE_URL = "http://localhost:8080"

# Authentication token (replace with your actual token)
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTk1NTVhMTItY2M3Yy00M2Q2LTlkYjAtZTAxN2I0MjgzMmQxIiwiZW1haWwiOiJ0ZXN0QHVuaXZlcnNpdHkuZWR1IiwiZXhwIjoxNzQyMjMxMDY0LCJpYXQiOjE3NDIxNDQ2NjR9.JQA6rVstAZUtwweyN55QLAC7MZDoxufANGDieRRMef8"

# Test data
product_data = {
    "title": "Test Product with Image",
    "description": "A test product with an uploaded image",
    "category": "Clothing",
    "size": "M",
    "brand": "Test Brand",
    "condition": "New",
    "price": "29.99"
}

def create_test_image():
    # Create a simple red image
    img = Image.new('RGB', (100, 100), color='red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    return img_byte_arr

def main():
    # Create test image
    image_data = create_test_image()
    
    # Prepare the multipart form data
    files = {
        'images[]': ('test_image.jpg', image_data, 'image/jpeg')
    }
    
    # Make the request
    try:
        response = requests.post(
            f"{BASE_URL}/api/products/admin",
            data=product_data,
            files=files,
            headers={
                "Authorization": f"Bearer {TOKEN}"
            }
        )
        
        print(f"Status Code: {response.status_code}")
        try:
            print("Response:")
            print(json.dumps(response.json(), indent=2))
        except json.JSONDecodeError:
            print("Raw Response:", response.text)
            
    except requests.exceptions.RequestException as e:
        print(f"Error making request: {e}")

if __name__ == "__main__":
    main()

# Clean up test image
if os.path.exists("test_image.jpg"):
    os.remove("test_image.jpg") 