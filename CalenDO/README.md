# CalenDO Frontend

This is the Angular frontend for the CalenDO application, now updated to work with a Django backend for user authentication, settings management, and data persistence.

## Setup Instructions

### Prerequisites
- Node.js and npm
- Angular CLI

### Installation

1. Navigate to the frontend directory:
   ```
   cd CalenDO
   ```
2. Install the required packages:
   ```
   npm install
   ```

### Running the Application

Start the development server:
```
ng serve
```

The application will be available at http://localhost:4200/

## Integration with Django Backend

This frontend is designed to work with the Django backend. Make sure the backend server is running at http://localhost:8000/ before using the application.

### Authentication Flow

1. When you first access the application, you'll be redirected to the login page
2. You can register a new account or log in with an existing one
3. After successful authentication, you'll be redirected to the dashboard
4. Your authentication token will be stored in localStorage and automatically included in API requests

### Features Added

1. **User Authentication**
   - Login and registration pages
   - Token-based authentication
   - Protected routes with auth guard

2. **User Settings**
   - Theme selection (light, dark, blue)
   - Notification preferences
   - Calendar view options

3. **Data Persistence**
   - All data (calendar events, todo tasks, classes) is now stored on the server
   - Data is synchronized across devices when you log in
   - Fallback to local storage when offline

## Service Changes

All services have been updated to use HTTP requests instead of in-memory storage:

- **AuthService**: Handles user authentication and token management
- **SettingsService**: Manages user settings
- **CalendarService**: Now uses API for calendar events
- **TodoService**: Now uses API for todo tasks
- **ClassesService**: Now uses API for school classes

## Offline Support

The application includes fallback mechanisms for when the API is unavailable:

1. Services will use cached data when offline
2. New data will be stored locally until connectivity is restored
3. Authentication state is preserved across page reloads

## Troubleshooting

- **API Connection Issues**: Make sure the Django backend is running at http://localhost:8000/
- **Authentication Errors**: Try clearing localStorage and logging in again
- **CORS Errors**: The backend is configured to allow requests from http://localhost:4200/, but you may need to adjust this if using a different port

## Development Notes

- The application uses Angular's standalone components
- HTTP requests are handled through Angular's HttpClient
- Authentication tokens are automatically added to requests via an HTTP interceptor
