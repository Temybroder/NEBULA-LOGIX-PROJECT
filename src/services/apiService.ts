import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG, STORAGE_KEYS } from "../config/api";
import {
  AuthResponse,
  LoginRequest,
  SignUpRequest,
  ConfirmSignUpRequest,
  ScoreSubmissionRequest,
  ScoreSubmissionResponse,
  LeaderboardResponse,
  TopScoreResponse,
  UserScoresResponse,
  UserBestScoreResponse,
  ProfileResponse,
} from "../types/api";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include authorization token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage and redirect to login
          this.clearAuth();
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Helper method to extract data from response
  private extractData<T>(response: AxiosResponse): T {
    return response.data;
  }

  // Helper method to clear authentication data
  private clearAuth(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Authentication endpoints
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.SIGNUP,
      data
    );
    return this.extractData(response);
  }

  async confirmSignUp(data: ConfirmSignUpRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.CONFIRM,
      data
    );
    return this.extractData(response);
  }

  async signIn(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.SIGNIN,
      data
    );
    const authData: AuthResponse = this.extractData(response);

    // Store tokens and user data on successful login
    if (authData.success && authData.accessToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
      }
      if (authData.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));
      }
    }

    return authData;
  }

  async getProfile(): Promise<ProfileResponse> {
    const response = await this.api.get<ProfileResponse>(
      API_CONFIG.ENDPOINTS.PROFILE
    );
    return this.extractData(response);
  }

  // Score endpoints
  async submitScore(
    data: ScoreSubmissionRequest
  ): Promise<ScoreSubmissionResponse> {
    const response = await this.api.post<ScoreSubmissionResponse>(
      API_CONFIG.ENDPOINTS.SUBMIT_SCORE,
      data
    );
    return this.extractData(response);
  }

  async getUserScores(): Promise<UserScoresResponse> {
    const response = await this.api.get<UserScoresResponse>(
      API_CONFIG.ENDPOINTS.USER_SCORES
    );
    return this.extractData(response);
  }

  async getUserBestScore(): Promise<UserBestScoreResponse> {
    const response = await this.api.get<UserBestScoreResponse>(
      API_CONFIG.ENDPOINTS.USER_BEST_SCORE
    );
    return this.extractData(response);
  }

  // Leaderboard endpoints
  async getLeaderboard(limit: number = 10): Promise<LeaderboardResponse> {
    const response = await this.api.get<LeaderboardResponse>(
      `${API_CONFIG.ENDPOINTS.LEADERBOARD}?limit=${limit}`
    );
    return this.extractData(response);
  }

  async getTopScore(): Promise<TopScoreResponse> {
    const response = await this.api.get<TopScoreResponse>(
      API_CONFIG.ENDPOINTS.TOP_SCORE
    );
    return this.extractData(response);
  }

  // Utility methods
  signOut(): void {
    this.clearAuth();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    return userJson ? JSON.parse(userJson) : null;
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
