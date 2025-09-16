import React, { useState } from "react";
import { useScores } from "../../hooks/useScores";
import { Input } from "../common/Input";
import { Button } from "../common/Button";

interface ScoreSubmissionProps {
  onScoreSubmitted?: () => void;
}

export const ScoreSubmission: React.FC<ScoreSubmissionProps> = ({
  onScoreSubmitted,
}) => {
  const { submitScore, isLoading } = useScores();
  const [score, setScore] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateScore = (value: string): boolean => {
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      setError("Please enter a valid number");
      return false;
    }

    if (numValue < 0) {
      setError("Score cannot be negative");
      return false;
    }

    if (numValue > 1000000) {
      setError("Score seems too high. Please check your input.");
      return false;
    }

    setError("");
    return true;
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setScore(value);

    // Clear messages when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateScore(score)) {
      return;
    }

    try {
      const numScore = parseFloat(score);
      const response = await submitScore({ score: numScore });

      // Show success message
      setSuccessMessage(
        response.highScoreNotification
          ? `🎉 Congratulations! Your score of ${numScore} is a high score!`
          : `Score of ${numScore} submitted successfully!`
      );

      // Toast notifications will be triggered by WebSocket events only

      setScore("");

      // Call callback if provided
      if (onScoreSubmitted) {
        onScoreSubmitted();
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit score";
      setError(errorMessage);

      // Log error for debugging (toast notifications handled by WebSocket only)
      console.error("Score submission failed:", errorMessage);
    }
  };

  return (
    <div className="score-submission">
      <h3 className="score-submission-title">Submit Your Score</h3>

      <form onSubmit={handleSubmit} className="score-form">
        <Input
          id="score"
          name="score"
          type="number"
          label="Score"
          value={score}
          onChange={handleScoreChange}
          error={error}
          placeholder="Enter your score"
          min="0"
          step="1"
        />

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!score || !!error}
          className="score-submit-btn"
        >
          Submit Score
        </Button>
      </form>
    </div>
  );
};
