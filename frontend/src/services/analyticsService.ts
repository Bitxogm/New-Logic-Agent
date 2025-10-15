import api, { ApiResponse, getResponseData } from './api';

export interface HeatmapDataPoint {
  date: string; // YYYY-MM-DD
  value: number; // XP earned
  count: number; // Exercises completed
}

export interface LanguageStats {
  language: string;
  count: number;
  totalXP: number;
  totalTime: number;
  avgTime: number;
}

export interface DifficultyStats {
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
  totalXP: number;
  totalTime: number;
  avgTime: number;
  percentage: number;
  [key: string]: string | number;
}

class AnalyticsService {
  /**
   * Get heatmap data for activity calendar
   */
  async getHeatmapData(userId: string, days: number = 365): Promise<HeatmapDataPoint[]> {
    const response = await api.get<ApiResponse<HeatmapDataPoint[]>>(
      `/analytics/heatmap/${userId}?days=${days}`
    );
    return getResponseData(response);
  }

  /**
   * Get statistics by programming language
   */
  async getLanguageStats(userId: string): Promise<LanguageStats[]> {
    const response = await api.get<ApiResponse<LanguageStats[]>>(
      `/analytics/language-stats/${userId}`
    );
    return getResponseData(response);
  }

  /**
   * Get statistics by difficulty level
   */
  async getDifficultyStats(userId: string): Promise<DifficultyStats[]> {
    const response = await api.get<ApiResponse<DifficultyStats[]>>(
      `/analytics/difficulty-stats/${userId}`
    );
    return getResponseData(response);
  }
}

export const analyticsService = new AnalyticsService();