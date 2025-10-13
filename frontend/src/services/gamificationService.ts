// frontend/src/services/gamificationService.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface UserStats {
  totalXP: number;
  level: number;
  completedExercises: number;
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: string;
}

export interface CompleteExerciseResponse {
  success: boolean;
  data: {
    xpAwarded: number;
    totalXP: number;
    level: number;
    leveledUp: boolean;
    newAchievements: Achievement[];
    currentStreak: number;
  };
}

/**
 * Get user statistics
 */
export const getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const response = await axios.get(`${API_URL}/gamification/stats/${userId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting user stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to get stats');
  }
};

/**
 * Complete exercise and award XP
 */
export const completeExercise = async (
  userId: string,
  exerciseId: string,
  difficulty: string,
  timeSpent?: number,
  perfectScore?: boolean
): Promise<CompleteExerciseResponse> => {
  try {
    const response = await axios.post(`${API_URL}/gamification/complete-exercise`, {
      userId,
      exerciseId,
      difficulty,
      timeSpent,
      perfectScore,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error completing exercise:', error);
    throw new Error(error.response?.data?.message || 'Failed to complete exercise');
  }
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/gamification/leaderboard?limit=${limit}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error getting leaderboard:', error);
    throw new Error(error.response?.data?.message || 'Failed to get leaderboard');
  }
};

export const gamificationService = {
  getUserStats,
  completeExercise,
  getLeaderboard,
};