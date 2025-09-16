import React, { useEffect, useState, useCallback } from "react";

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  }, [id, onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getToastIcon = (): string => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getToastClass = (): string => {
    const baseClass = "toast";
    const typeClass = `toast-${type}`;
    const visibilityClass = isVisible ? "toast-visible" : "";
    const leavingClass = isLeaving ? "toast-leaving" : "";

    return [baseClass, typeClass, visibilityClass, leavingClass]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className={getToastClass()}>
      <div className="toast-icon">{getToastIcon()}</div>

      <div className="toast-content">
        <div className="toast-title">{title}</div>
        <div className="toast-message">{message}</div>
      </div>

      <button
        className="toast-close"
        onClick={handleClose}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
};
