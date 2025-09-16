import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  AuthResponse,
  LoginRequest,
  SignUpRequest,
  ConfirmSignUpRequest,
} from "../types/api";
import { apiService } from "../services/apiService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (data: SignUpRequest) => Promise<AuthResponse>;
  confirmSignUp: (data: ConfirmSignUpRequest) => Promise<AuthResponse>;
  signIn: (data: LoginRequest) => Promise<AuthResponse>;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          // Try to get current user profile
          const storedUser = apiService.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // If no stored user, fetch from API
            await refreshProfile();
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // If profile fetch fails, sign out to clear invalid tokens
        apiService.signOut();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (data: SignUpRequest): Promise<AuthResponse> => {
    try {
      const response = await apiService.signUp(data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Sign up failed");
    }
  };

  const confirmSignUp = async (
    data: ConfirmSignUpRequest
  ): Promise<AuthResponse> => {
    try {
      const response = await apiService.confirmSignUp(data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Confirmation failed");
    }
  };

  const signIn = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiService.signIn(data);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Sign in failed");
    }
  };

  const signOut = () => {
    apiService.signOut();
    setUser(null);
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      const response = await apiService.getProfile();
      setUser(response.user);
    } catch (error: any) {
      console.error("Failed to refresh profile:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    confirmSignUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
