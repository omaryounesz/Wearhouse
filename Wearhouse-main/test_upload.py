import requests

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTdmODMwNmItYzhiZC00MDlkLTkyY2QtZTU2OWYxM2I3OWUyIiwiZW1haWwiOiJ0ZXN0QHVuaXZlcnNpdHkuZWR1IiwiZXhwIjoxNzQyMTc5MTkwLCJpYXQiOjE3NDIwOTI3OTB9.lSwJNdAVJWZIF3-fvwMMzHguiontRRqBwnePolqoBKs'

url = 'http://localhost:8080/api/products'
headers = {'Authorization': f'Bearer {token}'}

# Create a multipart form-data request
with open('backend/test-image.jpg', 'rb') as f:
    files = [
        ('images[]', ('test-image.jpg', f, 'image/jpeg'))
    ]
    data = {
        'title': 'Nike Air Max',
        'description': 'Brand new Nike Air Max sneakers',
        'category': 'Shoes',
        'size': '10',
        'brand': 'Nike',
        'condition': 'new',
        'price': '150.00'
    }
    response = requests.post(url, headers=headers, data=data, files=files)
    print(response.status_code)
    print(response.json()) 