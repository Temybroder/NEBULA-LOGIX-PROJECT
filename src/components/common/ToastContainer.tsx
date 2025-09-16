import React, { useState, useCallback, useEffect } from "react";
import { Toast, ToastProps } from "./Toast";

export interface ToastData {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
}

export interface ToastContainerProps {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center";
  maxToasts?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "bottom-right",
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toastData: ToastData) => {
      const newToast: ToastProps = {
        ...toastData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        onClose: removeToast,
      };

      setToasts((prev) => {
        const updatedToasts = [...prev, newToast];
        // Limit the number of toasts
        if (updatedToasts.length > maxToasts) {
          return updatedToasts.slice(-maxToasts);
        }
        return updatedToasts;
      });

      return newToast.id;
    },
    [maxToasts, removeToast]
  );

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Expose methods globally for easy access
  useEffect(() => {
    // Create global toast methods
    (window as any).showToast = addToast;
    (window as any).clearToasts = clearAllToasts;

    return () => {
      delete (window as any).showToast;
      delete (window as any).clearToasts;
    };
  }, [addToast, clearAllToasts]);

  const getContainerClass = (): string => {
    return `toast-container toast-container-${position}`;
  };

  return (
    <div className={getContainerClass()}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

// Export methods for direct use in components
export const useToast = () => {
  const showToast = useCallback((toastData: ToastData) => {
    if ((window as any).showToast) {
      return (window as any).showToast(toastData);
    }
    console.warn(
      "ToastContainer not found. Make sure it's rendered in your app."
    );
    return null;
  }, []);

  const clearToasts = useCallback(() => {
    if ((window as any).clearToasts) {
      (window as any).clearToasts();
    }
  }, []);

  return { showToast, clearToasts };
};
