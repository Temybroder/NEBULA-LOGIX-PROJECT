# GameScore Pro - React Client

A modern React application for tracking game scores with real-time leaderboard updates and AWS integration.

## Features

- 🔐 **AWS Cognito Authentication** - Secure user registration, login, and email confirmation
- 🏆 **Score Management** - Submit and track personal scores with history
- 📊 **Real-time Leaderboard** - Live leaderboard updates with WebSocket integration
- 🔔 **Live Notifications** - Real-time notifications for high scores and leaderboard changes
- 📱 **Responsive Design** - Modern, mobile-friendly interface
- ⚡ **TypeScript** - Full type safety and excellent developer experience

## Tech Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **WebSocket** for real-time updates
- **Modern CSS** with CSS Variables and Grid/Flexbox
- **AWS Lambda** backend integration

## Prerequisites

- Node.js 16+ and npm
- AWS Lambda backend deployed (see `../api/` directory)
- API Gateway URL and WebSocket URL from your deployment

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoints

Update the API configuration in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  // Replace with your actual API Gateway URL
  BASE_URL:
    "https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev",
  WEBSOCKET_URL:
    "wss://your-websocket-api-id.execute-api.us-east-1.amazonaws.com/dev",
  // ... other config
};
```

### 3. Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev
REACT_APP_WEBSOCKET_URL=wss://your-websocket-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### 4. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`.

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (one-way operation)

## Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── common/          # Reusable UI components
│   ├── dashboard/       # Main dashboard
│   ├── leaderboard/     # Leaderboard components
│   ├── layout/          # Layout components
│   ├── notifications/   # Notification system
│   └── scores/          # Score-related components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── services/            # API and WebSocket services
├── styles/              # CSS modules
├── types/               # TypeScript type definitions
├── config/              # Configuration files
└── App.tsx              # Main application component
```

## API Integration

The client integrates with the AWS Lambda backend through the following endpoints:

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/confirm` - Email confirmation
- `POST /auth/signin` - User login
- `GET /auth/profile` - Get user profile

### Scores

- `POST /scores/submit` - Submit a new score
- `GET /scores/user` - Get user's scores
- `GET /scores/user/best` - Get user's best score

### Leaderboard

- `GET /leaderboard` - Get leaderboard (with limit parameter)
- `GET /leaderboard/top` - Get top score

### WebSocket Events

- `high-score` - Triggered when someone scores above threshold
- `new-leader` - Triggered when leaderboard changes
- `notification` - General notifications

## Features Overview

### Authentication Flow

1. **Sign Up** - Create account with email, username, and password
2. **Email Confirmation** - Confirm email with 6-digit code
3. **Sign In** - Login with email and password
4. **Protected Routes** - Automatic redirect to login for unauthenticated users

### Dashboard

- **Welcome Section** - Personalized greeting
- **Score Submission** - Quick score entry form
- **Personal Scores** - User's score history and best score
- **Global Leaderboard** - Top scores from all users
- **Live Statistics** - Real-time stats and rankings

### Real-time Features

- **WebSocket Connection** - Automatic connection with reconnection
- **Live Notifications** - Toast notifications for events
- **Auto-refresh** - Leaderboard updates when new scores are submitted
- **Connection Status** - Visual indicator for WebSocket connection

## Customization

### Styling

The application uses CSS variables for easy theming. Modify the variables in `src/App.css`:

```css
:root {
  --primary-500: #3b82f6; /* Primary color */
  --primary-600: #2563eb; /* Primary hover */
  /* ... other variables */
}
```

### API Configuration

Update `src/config/api.ts` to change API endpoints, add new endpoints, or modify configuration.

### Components

All components are modular and can be easily customized or replaced. Each component has clear props interfaces for easy integration.

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `build/` directory with optimized production files.

### Deploy to AWS S3 + CloudFront

1. Build the application
2. Upload `build/` contents to S3 bucket
3. Configure CloudFront distribution
4. Update CORS settings in API Gateway if needed

### Environment-specific Configuration

For different environments (dev, staging, prod), use environment variables or create separate config files.

## Troubleshooting

### Common Issues

1. **CORS Errors** - Ensure API Gateway has CORS configured for your domain
2. **WebSocket Connection Failed** - Check WebSocket URL and network connectivity
3. **Authentication Errors** - Verify Cognito configuration and user pool settings
4. **Build Errors** - Clear `node_modules` and reinstall dependencies

### Development Tips

- Use browser DevTools Network tab to debug API calls
- Check Console for WebSocket connection status
- Use React Developer Tools for component debugging
- Enable source maps for better error tracing

## Contributing

1. Follow the existing code style and structure
2. Add TypeScript types for new features
3. Update tests for new components
4. Follow DRY (Don't Repeat Yourself) and Single Responsibility principles
5. Ensure responsive design for new components

## License

This project is part of a portfolio demonstration.
