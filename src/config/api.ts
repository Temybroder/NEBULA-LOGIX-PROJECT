// API Configuration

const getEnvVariable = (variable: string) => {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Environment variable ${variable} is not set`);
  }
  return value;
};

export const API_CONFIG = {
  BASE_URL: getEnvVariable("REACT_APP_API_BASE_URL"),
  WEBSOCKET_URL: getEnvVariable("REACT_APP_WEBSOCKET_URL"),

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    SIGNUP: "/auth/signup",
    CONFIRM: "/auth/confirm",
    SIGNIN: "/auth/signin",
    PROFILE: "/auth/profile",

    // Scores
    SUBMIT_SCORE: "/scores/submit",
    USER_SCORES: "/scores/user",
    USER_BEST_SCORE: "/scores/user/best",

    // Leaderboard
    LEADERBOARD: "/leaderboard",
    TOP_SCORE: "/leaderboard/top",

    // Notifications
    TEST_NOTIFICATION: "/notifications/test",
  },
};

// Storage keys for local storage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
};
