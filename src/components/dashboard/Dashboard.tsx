import React, { useState } from "react";
import { Header } from "../layout/Header";
import { ScoreSubmission } from "../scores/ScoreSubmission";
import { UserScores } from "../scores/UserScores";
import { Leaderboard } from "../leaderboard/Leaderboard";
import { NotificationSystem } from "../notifications/NotificationSystem";
import { useAuth } from "../../contexts/AuthContext";
// NEW IMPORT: WebSocket hook for enhanced dashboard notifications
import { useWebSocket } from "../../hooks/useWebSocket";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // NEW STATE: Enhanced high score notification state for dashboard
  const [dashboardHighScoreAlert, setDashboardHighScoreAlert] = useState<{
    visible: boolean;
    message: string;
    user: string;
    score: number;
    timestamp: number;
  } | null>(null);

  // NEW HOOK: WebSocket subscription for dashboard-specific notifications
  const { subscribe } = useWebSocket();

  const handleScoreSubmitted = () => {
    // Force refresh of components by updating key
    setRefreshKey((prev) => prev + 1);
  };

  const handleHighScoreNotification = () => {
    // ORIGINAL CODE (commented out):
    // Could trigger additional UI updates here
    // console.log("High score notification received!");

    // NEW IMPLEMENTATION: Enhanced dashboard notification handling
    console.log("High score notification received on dashboard!");
  };

  // NEW EFFECT: Subscribe to high score notifications for dashboard alerts
  React.useEffect(() => {
    const unsubscribe = subscribe("high-score", (data: any) => {
      // Show prominent dashboard alert for scores > 1000
      if (data && data.score && data.user_name) {
        setDashboardHighScoreAlert({
          visible: true,
          message: `🎉 ${
            data.user_name
          } just achieved a fantastic score of ${data.score.toLocaleString()} points!`,
          user: data.user_name,
          score: data.score,
          timestamp: Date.now(),
        });

        // Auto-hide the alert after 10 seconds
        setTimeout(() => {
          setDashboardHighScoreAlert(null);
        }, 10000);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  // NEW FUNCTION: Handle dismissing dashboard alert
  const dismissDashboardAlert = () => {
    setDashboardHighScoreAlert(null);
  };

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* NEW SECTION: High Score Dashboard Alert */}
          {dashboardHighScoreAlert && (
            <section className="dashboard-alert-section">
              <div className="dashboard-high-score-alert">
                <div className="alert-content">
                  <div className="alert-icon">🎉</div>
                  <div className="alert-text">
                    <h3>Amazing High Score Achievement!</h3>
                    <p>{dashboardHighScoreAlert.message}</p>
                    <div className="alert-details">
                      <span className="score-highlight">
                        {dashboardHighScoreAlert.score.toLocaleString()} points
                      </span>
                      <span className="user-highlight">
                        by {dashboardHighScoreAlert.user}
                      </span>
                    </div>
                  </div>
                  <button
                    className="alert-dismiss"
                    onClick={dismissDashboardAlert}
                    aria-label="Dismiss alert"
                  >
                    ×
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Welcome Section */}
          <section className="welcome-section">
            <h2 className="welcome-title">
              Welcome back, {user?.name || user?.preferred_username}! 🎮
            </h2>
            <p className="welcome-subtitle">
              Track your gaming progress and compete with others on the
              leaderboard.
            </p>
          </section>

          {/* Score Submission Section */}
          <section className="score-section">
            <div className="section-card">
              <ScoreSubmission
                key={`score-submission-${refreshKey}`}
                onScoreSubmitted={handleScoreSubmitted}
              />
            </div>
          </section>

          {/* Dashboard Grid */}
          <div className="dashboard-grid">
            {/* User Scores Column */}
            <div className="dashboard-column">
              <div className="section-card">
                <UserScores
                  key={`user-scores-${refreshKey}`}
                  showBestScore={true}
                  maxScores={5}
                />
              </div>
            </div>

            {/* Leaderboard Column */}
            <div className="dashboard-column">
              <div className="section-card">
                <Leaderboard
                  key={`leaderboard-${refreshKey}`}
                  defaultLimit={10}
                  showTopScore={true}
                  showControls={true}
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="section-card">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-label">Total Scores</div>
                    <div className="stat-value">-</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-content">
                    <div className="stat-label">Best Score</div>
                    <div className="stat-value">-</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">📈</div>
                  <div className="stat-content">
                    <div className="stat-label">Average Score</div>
                    <div className="stat-value">-</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon">👥</div>
                  <div className="stat-content">
                    <div className="stat-label">Rank</div>
                    <div className="stat-value">-</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Notification System */}
      <NotificationSystem onHighScore={handleHighScoreNotification} />
    </div>
  );
};
