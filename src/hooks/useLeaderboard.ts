import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/apiService";
import {
  LeaderboardEntry,
  LeaderboardResponse,
  TopScoreResponse,
} from "../types/api";

export const useLeaderboard = (limit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [topScore, setTopScore] = useState<LeaderboardEntry | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: LeaderboardResponse = await apiService.getLeaderboard(
        limit
      );
      setLeaderboard(response.leaderboard);
      setTotalEntries(response.total_entries);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch leaderboard");
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  // Fetch top score
  const fetchTopScore = useCallback(async () => {
    try {
      setError(null);
      const response: TopScoreResponse = await apiService.getTopScore();
      setTopScore(response.top_score);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch top score");
    }
  }, []);

  // Refresh all leaderboard data
  const refreshLeaderboard = useCallback(async () => {
    await Promise.all([fetchLeaderboard(), fetchTopScore()]);
  }, [fetchLeaderboard, fetchTopScore]);

  // Load data on mount or when limit changes
  useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);

  return {
    leaderboard,
    topScore,
    totalEntries,
    isLoading,
    error,
    refreshLeaderboard,
    fetchLeaderboard,
    fetchTopScore,
  };
};
