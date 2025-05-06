import requests
import json

# API base URL
BASE_URL = 'http://localhost:8000/api/'

def test_api_root():
    """Test the API root endpoint which doesn't require authentication"""
    response = requests.get(BASE_URL)
    print("\n=== API Root ===")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def register_user(username, password, email=None):
    """Register a new user"""
    data = {
        'username': username,
        'password': password
    }
    if email:
        data['email'] = email
    
    response = requests.post(BASE_URL + 'register/', json=data)
    print("\n=== Register User ===")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 201:
        return response.json().get('token')
    return None

def login_user(username, password):
    """Login a user"""
    data = {
        'username': username,
        'password': password
    }
    
    response = requests.post(BASE_URL + 'login/', json=data)
    print("\n=== Login User ===")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code == 200:
        return response.json().get('token')
    return None

def get_user_settings(token):
    """Get user settings"""
    headers = {'Authorization': f'Token {token}'}
    response = requests.get(BASE_URL + 'settings/my_settings/', headers=headers)
    print("\n=== User Settings ===")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def create_calendar_event(token, title, date):
    """Create a calendar event"""
    headers = {'Authorization': f'Token {token}'}
    data = {
        'title': title,
        'date': date
    }
    
    response = requests.post(BASE_URL + 'calendar-events/', json=data, headers=headers)
    print("\n=== Create Calendar Event ===")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def main():
    """Main test function"""
    # Test API root (no auth required)
    test_api_root()
    
    # Register a new test user
    username = 'testuser'
    password = 'testpassword'
    token = register_user(username, password)
    
    if not token:
        # Try logging in if registration fails (user might already exist)
        token = login_user(username, password)
    
    if token:
        # Test authenticated endpoints
        get_user_settings(token)
        create_calendar_event(token, 'Test Event', '2025-05-15T10:00:00Z')
    else:
        print("Failed to get authentication token")

if __name__ == "__main__":
    main()