import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { ConfirmSignUpRequest } from "../../types/api";

export const ConfirmSignUp: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirmSignUp } = useAuth();

  const [formData, setFormData] = useState<ConfirmSignUpRequest>({
    email: "",
    confirmation_code: "",
  });

  const [errors, setErrors] = useState<Partial<ConfirmSignUpRequest>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pre-fill email from URL params
  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ConfirmSignUpRequest> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.confirmation_code) {
      newErrors.confirmation_code = "Confirmation code is required";
    } else if (formData.confirmation_code.length !== 6) {
      newErrors.confirmation_code = "Confirmation code must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For confirmation code, only allow digits and limit to 6 characters
    if (name === "confirmation_code") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear errors when user starts typing
    if (errors[name as keyof ConfirmSignUpRequest]) {
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

      const response = await confirmSignUp(formData);

      if (response.success) {
        setSuccessMessage("Email confirmed successfully! You can now sign in.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setAuthError(response.message || "Confirmation failed");
      }
    } catch (error: any) {
      setAuthError(error.message || "Confirmation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Confirm Your Email</h1>
        <p className="auth-subtitle">
          We've sent a confirmation code to your email. Please enter it below.
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
            id="confirmation_code"
            name="confirmation_code"
            type="text"
            label="Confirmation Code"
            value={formData.confirmation_code}
            onChange={handleInputChange}
            error={errors.confirmation_code}
            placeholder="Enter 6-digit code"
            maxLength={6}
            autoComplete="one-time-code"
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
            Confirm Email
          </Button>
        </form>

        <div className="auth-links">
          <p>
            Didn't receive the code?{" "}
            <Link to="/signup" className="auth-link">
              Try signing up again
            </Link>
          </p>
          <p>
            Already confirmed?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
