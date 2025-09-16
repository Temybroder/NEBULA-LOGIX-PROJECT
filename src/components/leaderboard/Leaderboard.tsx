import React, { useState } from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../common/Button";
import { LeaderboardEntry } from "../../types/api";

interface LeaderboardProps {
  defaultLimit?: number;
  showTopScore?: boolean;
  showControls?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  defaultLimit = 10,
  showTopScore = true,
  showControls = true,
}) => {
  const [limit, setLimit] = useState(defaultLimit);
  const { user } = useAuth();
  const {
    leaderboard,
    topScore,
    totalEntries,
    isLoading,
    error,
    refreshLeaderboard,
  } = useLeaderboard(limit);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  const isCurrentUser = (entry: LeaderboardEntry): boolean => {
    return user?.user_id === entry.user_id;
  };

  const getRankIcon = (rank: number): string => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
  };

  if (isLoading) {
    return (
      <div className="leaderboard">
        <div className="loading-container">
          <div className="loading-spinner">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <div className="error-message">Failed to load leaderboard: {error}</div>
        <Button onClick={refreshLeaderboard} className="retry-btn">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      {showTopScore && topScore && (
        <div className="top-score-section">
          <h3 className="section-title">Current Champion</h3>
          <div className="top-score-card">
            <div className="champion-icon">👑</div>
            <div className="champion-details">
              <div className="champion-name">{topScore.user_name}</div>
              <div className="champion-score">
                {formatScore(topScore.score)}
              </div>
              <div className="champion-date">
                Since {formatDate(topScore.timestamp)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-section">
        <div className="leaderboard-header">
          <h3 className="section-title">Leaderboard</h3>

          {showControls && (
            <div className="leaderboard-controls">
              <div className="limit-controls">
                <span>Show: </span>
                {[5, 10, 25, 50].map((limitOption) => (
                  <button
                    key={limitOption}
                    className={`limit-btn ${
                      limit === limitOption ? "active" : ""
                    }`}
                    onClick={() => handleLimitChange(limitOption)}
                  >
                    {limitOption}
                  </button>
                ))}
              </div>

              <Button
                onClick={refreshLeaderboard}
                size="small"
                variant="secondary"
                className="refresh-btn"
              >
                🔄 Refresh
              </Button>
            </div>
          )}
        </div>

        {leaderboard.length === 0 ? (
          <div className="no-scores">
            <p>No scores yet. Be the first to submit a score!</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((entry: LeaderboardEntry, index: number) => {
              const rank = index + 1;
              const isCurrentUserEntry = isCurrentUser(entry);

              return (
                <div
                  key={entry.id}
                  className={`leaderboard-item ${
                    isCurrentUserEntry ? "current-user" : ""
                  } ${rank <= 3 ? "top-three" : ""}`}
                >
                  <div className="rank-icon">{getRankIcon(rank)}</div>

                  <div className="user-info">
                    <div className="user-name">
                      {entry.user_name}
                      {isCurrentUserEntry && (
                        <span className="you-badge">You</span>
                      )}
                    </div>
                    <div className="score-date">
                      {formatDate(entry.timestamp)}
                    </div>
                  </div>

                  <div className="score-info">
                    <div className="score-value">
                      {formatScore(entry.score)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {leaderboard.length > 0 && (
          <div className="leaderboard-footer">
            <p className="leaderboard-summary">
              Showing top {Math.min(limit, totalEntries)} of {totalEntries}{" "}
              total scores
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
