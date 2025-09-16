// Types that match the backend API
export interface User {
  user_id: string;
  email: string;
  preferred_username: string;
  name: string;
}

export interface Score {
  id: string;
  user_id: string;
  user_name: string;
  score: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  user_name: string;
  score: number;
  timestamp: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: User;
}

export interface ScoreSubmissionRequest {
  score: number;
}

export interface WebSocketMessage {
  action: string;
  connectionId: string;
  data?: any;
}

export interface APIResponse<T = any> {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

// Frontend-specific types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  preferred_username: string;
  name: string;
}

export interface ConfirmSignUpRequest {
  email: string;
  confirmation_code: string;
}

export interface ScoreSubmissionResponse {
  message: string;
  score: Score;
  highScoreNotification: boolean;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total_entries: number;
  limit: number;
}

export interface TopScoreResponse {
  top_score: LeaderboardEntry | null;
}

export interface UserScoresResponse {
  user_id: string;
  scores: Score[];
}

export interface UserBestScoreResponse {
  user_id: string;
  best_score: Score | null;
}

export interface ProfileResponse {
  user: User;
}
