import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`btn btn-${variant} btn-${size} ${
        isLoading ? "btn-loading" : ""
      } ${className}`}
    >
      {isLoading ? (
        <span className="loading-spinner">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};
