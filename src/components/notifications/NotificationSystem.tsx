import React, { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useToast } from "../common/ToastContainer";

interface Notification {
  id: string;
  type: "high-score" | "new-leader" | "general";
  title: string;
  message: string;
  timestamp: number;
  duration?: number;
}

interface NotificationSystemProps {
  onHighScore?: () => void;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  onHighScore,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { subscribe, isConnected } = useWebSocket();
  const { refreshLeaderboard } = useLeaderboard();
  const { showToast } = useToast();

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Add a new notification
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: Date.now(),
        duration: notification.duration || 5000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove notification after duration
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    },
    [removeNotification]
  );

  // Handle high score notifications
  const handleHighScoreNotification = useCallback(
    (message: any) => {
      const { data, toast } = message;
      const { score, user_name } = data;

      // Show both notification and toast
      addNotification({
        type: "high-score",
        title: "🎉 High Score Alert!",
        message: `${user_name} just scored ${score.toLocaleString()} points!`,
        duration: 7000,
      });

      // Show toast notification using data from backend
      if (toast) {
        showToast(toast);
      } else {
        // Fallback toast if not provided from backend
        showToast({
          type: "success",
          title: "High Score Achievement!",
          message: `${user_name} achieved an amazing score of ${score.toLocaleString()} points!`,
          duration: 6000,
        });
      }

      // Refresh leaderboard to show new scores
      refreshLeaderboard();

      // Call callback if provided
      if (onHighScore) {
        onHighScore();
      }
    },
    [addNotification, refreshLeaderboard, onHighScore, showToast]
  );

  // Handle new leader notifications
  const handleNewLeaderNotification = useCallback(
    (message: any) => {
      const { data, toast } = message;
      const { score, user_name } = data;

      // Show both notification and toast
      addNotification({
        type: "new-leader",
        title: "👑 New Leader!",
        message: `${user_name} is now in the lead with ${score.toLocaleString()} points!`,
        duration: 8000,
      });

      // Show toast notification using data from backend
      if (toast) {
        showToast(toast);
      } else {
        // Fallback toast if not provided from backend
        showToast({
          type: "warning",
          title: "New Leaderboard Leader!",
          message: `${user_name} has taken the lead with ${score.toLocaleString()} points!`,
          duration: 7000,
        });
      }

      // Refresh leaderboard
      refreshLeaderboard();
    },
    [addNotification, refreshLeaderboard, showToast]
  );

  // Handle general notifications
  const handleGeneralNotification = useCallback(
    (data: any) => {
      const { title, message, duration } = data;

      addNotification({
        type: "general",
        title: title || "Notification",
        message: message || "You have a new notification",
        duration: duration || 5000,
      });
    },
    [addNotification]
  );

  // Subscribe to WebSocket events
  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    // Subscribe to different notification types
    unsubscribers.push(subscribe("high-score", handleHighScoreNotification));
    unsubscribers.push(subscribe("new-leader", handleNewLeaderNotification));
    unsubscribers.push(subscribe("notification", handleGeneralNotification));

    // Cleanup on unmount
    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [
    subscribe,
    handleHighScoreNotification,
    handleNewLeaderNotification,
    handleGeneralNotification,
  ]);

  const getNotificationIcon = (type: Notification["type"]): string => {
    switch (type) {
      case "high-score":
        return "🎉";
      case "new-leader":
        return "👑";
      default:
        return "📢";
    }
  };

  const getNotificationClass = (type: Notification["type"]): string => {
    switch (type) {
      case "high-score":
        return "notification-high-score";
      case "new-leader":
        return "notification-new-leader";
      default:
        return "notification-general";
    }
  };

  return (
    <div className="notification-system">
      {/* Connection status indicator */}
      <div
        className={`connection-status ${
          isConnected() ? "connected" : "disconnected"
        }`}
      >
        <span className="connection-indicator"></span>
        <span className="connection-text">
          {isConnected() ? "Live updates active" : "Connecting..."}
        </span>
      </div>

      {/* Notifications container */}
      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${getNotificationClass(
              notification.type
            )}`}
          >
            <div className="notification-icon">
              {getNotificationIcon(notification.type)}
            </div>

            <div className="notification-content">
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
            </div>

            <button
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
