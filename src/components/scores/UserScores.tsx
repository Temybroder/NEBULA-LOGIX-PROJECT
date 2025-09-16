import React from "react";
import { useScores } from "../../hooks/useScores";
import { Score } from "../../types/api";

interface UserScoresProps {
  showBestScore?: boolean;
  maxScores?: number;
}

export const UserScores: React.FC<UserScoresProps> = ({
  showBestScore = true,
  maxScores = 10,
}) => {
  const { userScores, bestScore, isLoading, error } = useScores();

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatScore = (score: number): string => {
    return score.toLocaleString();
  };

  const displayScores = userScores.slice(0, maxScores);

  if (isLoading) {
    return (
      <div className="user-scores">
        <div className="loading-container">
          <div className="loading-spinner">Loading scores...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-scores">
        <div className="error-message">Failed to load scores: {error}</div>
      </div>
    );
  }

  return (
    <div className="user-scores">
      {showBestScore && bestScore && (
        <div className="best-score-section">
          <h3 className="section-title">Your Best Score</h3>
          <div className="best-score-card">
            <div className="best-score-value">
              🏆 {formatScore(bestScore.score)}
            </div>
            <div className="best-score-date">
              Achieved on {formatDate(bestScore.timestamp)}
            </div>
          </div>
        </div>
      )}

      <div className="recent-scores-section">
        <h3 className="section-title">
          Recent Scores{" "}
          {userScores.length > maxScores &&
            `(${maxScores} of ${userScores.length})`}
        </h3>

        {displayScores.length === 0 ? (
          <div className="no-scores">
            <p>No scores yet. Submit your first score to get started!</p>
          </div>
        ) : (
          <div className="scores-list">
            {displayScores.map((score: Score, index: number) => (
              <div key={score.id} className="score-item">
                <div className="score-rank">#{index + 1}</div>
                <div className="score-details">
                  <div className="score-value">{formatScore(score.score)}</div>
                  <div className="score-date">
                    {formatDate(score.timestamp)}
                  </div>
                </div>
                {bestScore && score.score === bestScore.score && (
                  <div className="score-badge">🏆 Best</div>
                )}
              </div>
            ))}
          </div>
        )}

        {userScores.length > maxScores && (
          <div className="scores-pagination">
            <p className="scores-summary">
              Showing {maxScores} of {userScores.length} total scores
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
