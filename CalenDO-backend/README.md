# CalenDO Backend

This is the Django backend for the CalenDO application, providing user authentication, settings management, and data persistence.

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Installation

1. Clone the repository (if you haven't already)
2. Navigate to the backend directory:
   ```
   cd CalenDO-backend
   ```
3. Install the required packages:
   ```
   pip install django djangorestframework django-cors-headers
   ```
4. Apply migrations to set up the database:
   ```
   python manage.py migrate
   ```
5. Create a superuser (admin) account:
   ```
   python manage.py createsuperuser
   ```

### Running the Server

Start the development server:
```
python manage.py runserver
```

The API will be available at http://localhost:8000/api/

### API Endpoints

- **API Root**: `GET /api/` - Shows available endpoints
- **Register**: `POST /api/register/` - Register a new user
  - Required fields: `username`, `password`
  - Optional fields: `email`
- **Login**: `POST /api/login/` - Login and get authentication token
  - Required fields: `username`, `password`
- **Logout**: `POST /api/logout/` - Logout (requires authentication)
- **User Settings**: `GET /api/settings/my_settings/` - Get current user's settings (requires authentication)
- **Calendar Events**: `GET/POST /api/calendar-events/` - List or create calendar events (requires authentication)
- **Todo Tasks**: `GET/POST /api/todo-tasks/` - List or create todo tasks (requires authentication)
- **School Classes**: `GET/POST /api/school-classes/` - List or create school classes (requires authentication)

### Testing the API

You can use the included test script to verify that the API is working correctly:
```
python test_api.py
```

## Integration with Angular Frontend

The Angular frontend needs to be configured to communicate with this backend. The frontend services have been updated to use HTTP requests to interact with these API endpoints.

### Authentication Flow

1. User registers or logs in through the frontend
2. Backend returns an authentication token
3. Frontend stores the token in localStorage
4. Frontend includes the token in the Authorization header for subsequent requests
5. Backend validates the token and returns the requested data

## Troubleshooting

- **401 Unauthorized**: This means you're trying to access an endpoint that requires authentication without providing a valid token. Make sure you're including the token in the Authorization header.
- **400 Bad Request**: Check that you're providing all required fields in the correct format.
- **500 Server Error**: Check the server logs for more information.