import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { SignUpRequest } from "../../types/api";

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState<SignUpRequest>({
    email: "",
    password: "",
    preferred_username: "",
    name: "",
  });

  const [errors, setErrors] = useState<
    Partial<SignUpRequest & { confirmPassword: string }>
  >({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpRequest & { confirmPassword: string }> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.preferred_username) {
      newErrors.preferred_username = "Username is required";
    } else if (formData.preferred_username.length < 3) {
      newErrors.preferred_username = "Username must be at least 3 characters";
    }

    if (!formData.name) {
      newErrors.name = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear errors when user starts typing
    if (errors[name as keyof (SignUpRequest & { confirmPassword: string })]) {
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
      setSuccessMessage("");

      const response = await signUp(formData);

      if (response.success) {
        setSuccessMessage(
          "Account created successfully! Please check your email for a confirmation code."
        );
        // Navigate to confirmation page with email
        navigate(`/confirm?email=${encodeURIComponent(formData.email)}`);
      } else {
        setAuthError(response.message || "Sign up failed");
      }
    } catch (error: any) {
      setAuthError(error.message || "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Create a new account to get started.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="Enter your full name"
            autoComplete="name"
          />

          <Input
            id="preferred_username"
            name="preferred_username"
            type="text"
            label="Username"
            value={formData.preferred_username}
            onChange={handleInputChange}
            error={errors.preferred_username}
            placeholder="Choose a username"
            autoComplete="username"
          />

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
            placeholder="Create a password"
            autoComplete="new-password"
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />

          {authError && (
            <div className="error-message auth-error">{authError}</div>
          )}

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="auth-submit-btn"
          >
            Sign Up
          </Button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
