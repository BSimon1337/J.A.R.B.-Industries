# CalenDO Setup Instructions

This guide will help you run the CalenDO application with the Django backend.

## Step 1: Start the Django Backend

1. Open a terminal and navigate to the backend directory:
   ```
   cd CalenDO-backend
   ```

2. Run the Django server:
   ```
   python manage.py runserver
   ```
   This will start the backend server at http://localhost:8000/

3. Verify the backend is running by visiting http://localhost:8000/api/ in your browser.
   You should see a welcome message with available endpoints.

## Step 2: Start the Angular Frontend

1. Open a new terminal window and navigate to the frontend directory:
   ```
   cd CalenDO
   ```

2. Run the Angular development server:
   ```
   ng serve
   ```
   This will start the frontend at http://localhost:4200/

## Step 3: Use the Application

1. Open your browser and go to http://localhost:4200/
2. You'll be directed to the login page, but you can also access most features without logging in
3. To use the settings feature, you'll need to register an account by clicking on the "Register" link
4. After logging in, your data will be persisted to the backend

The application now works in two modes:
- **Guest mode**: Access all features except settings without logging in (data stored in memory)
- **Authenticated mode**: Access all features with data persisted to the backend

## Troubleshooting

### Backend Issues

- If you see a 401 Unauthorized error, this is expected for endpoints that require authentication. You need to log in through the frontend to get an authentication token.
- If the Django server fails to start, make sure you've applied all migrations:
  ```
  python manage.py migrate
  ```

### Frontend Issues

- If you see TypeScript errors related to Observables, make sure you've updated all components to handle asynchronous data.
- If the login/register functionality doesn't work, check that the backend server is running and accessible.

## Testing the API Directly

You can use the included test script to verify that the API is working correctly:
```
cd CalenDO-backend
python test_api.py
```

This will test the API endpoints and show you the responses.