import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { LoginRequest } from "../../types/api";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (errors[name as keyof LoginRequest]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear auth error
    if (authError) {
      setAuthError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setAuthError("");

      const response = await signIn(formData);

      if (response.success) {
        navigate("/dashboard");
      } else {
        setAuthError(response.message || "Login failed");
      }
    } catch (error: any) {
      setAuthError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">GameScorePro</h1>
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">
          Welcome back! Please sign in to your account.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="Enter your email"
            autoComplete="email"
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Enter your password"
            autoComplete="current-password"
          />

          {authError && (
            <div className="error-message auth-error">{authError}</div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="auth-submit-btn"
          >
            Sign In
          </Button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};