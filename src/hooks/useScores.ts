import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/apiService";
import {
  Score,
  ScoreSubmissionRequest,
  ScoreSubmissionResponse,
  UserScoresResponse,
  UserBestScoreResponse,
} from "../types/api";

export const useScores = () => {
  const [userScores, setUserScores] = useState<Score[]>([]);
  const [bestScore, setBestScore] = useState<Score | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user scores
  const fetchUserScores = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: UserScoresResponse = await apiService.getUserScores();
      setUserScores(response.scores);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch user scores");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch best score
  const fetchBestScore = useCallback(async () => {
    try {
      setError(null);
      const response: UserBestScoreResponse =
        await apiService.getUserBestScore();
      setBestScore(response.best_score);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch best score");
    }
  }, []);

  // Submit new score
  const submitScore = useCallback(
    async (
      scoreData: ScoreSubmissionRequest
    ): Promise<ScoreSubmissionResponse> => {
      try {
        setIsLoading(true);
        setError(null);
        const response: ScoreSubmissionResponse = await apiService.submitScore(
          scoreData
        );

        // Refresh scores after successful submission
        await fetchUserScores();
        await fetchBestScore();

        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to submit score";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserScores, fetchBestScore]
  );

  // Load data on mount
  useEffect(() => {
    fetchUserScores();
    fetchBestScore();
  }, [fetchUserScores, fetchBestScore]);

  return {
    userScores,
    bestScore,
    isLoading,
    error,
    submitScore,
    refetchScores: fetchUserScores,
    refetchBestScore: fetchBestScore,
  };
};
