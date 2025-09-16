import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="input-group">
      <label htmlFor={props.id} className="input-label">
        {label}
      </label>
      <input
        {...props}
        className={`input ${error ? "input-error" : ""} ${className}`}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
