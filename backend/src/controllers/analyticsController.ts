// backend/src/controllers/analyticsController.ts

import { Request, Response } from 'express';
import { UserProgress } from '../models/UserProgress';

/**
 * Get heatmap data (activity calendar like GitHub)
 * GET /api/analytics/heatmap/:userId
 */
export const getHeatmapData = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { days = 365 } = req.query;
    
    const progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found',
      });
    }
    
    // Get last N days
    const daysAgo = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    // Filter and format activity history
    const heatmapData = progress.activityHistory
      .filter(activity => new Date(activity.date) >= startDate)
      .map(activity => ({
        date: activity.date.toISOString().split('T')[0], // YYYY-MM-DD format
        value: activity.xpEarned,
        count: activity.exercisesCompleted,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return res.json({
      success: true,
      data: heatmapData,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get heatmap data',
      error: error.message,
    });
  }
};

/**
 * Get language statistics
 * GET /api/analytics/language-stats/:userId
 */
export const getLanguageStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found',
      });
    }
    
    // Aggregate stats by language
    const languageStats: Record<string, {
      count: number;
      totalXP: number;
      totalTime: number;
      avgTime: number;
    }> = {};
    
    progress.exerciseStats.forEach(stat => {
      const lang = stat.language || 'unknown';
      
      if (!languageStats[lang]) {
        languageStats[lang] = {
          count: 0,
          totalXP: 0,
          totalTime: 0,
          avgTime: 0,
        };
      }
      
      languageStats[lang].count += 1;
      languageStats[lang].totalXP += stat.xpEarned || 0;
      languageStats[lang].totalTime += stat.timeSpent || 0;
    });
    
    // Calculate averages
    Object.keys(languageStats).forEach(lang => {
      const stats = languageStats[lang];
      stats.avgTime = stats.count > 0 ? Math.round(stats.totalTime / stats.count) : 0;
    });
    
    // Convert to array and sort by count
    const languageArray = Object.entries(languageStats)
      .map(([language, stats]) => ({
        language,
        ...stats,
      }))
      .sort((a, b) => b.count - a.count);
    
    return res.json({
      success: true,
      data: languageArray,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get language stats',
      error: error.message,
    });
  }
};

/**
 * Get difficulty distribution
 * GET /api/analytics/difficulty-stats/:userId
 */
export const getDifficultyStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'User progress not found',
      });
    }
    
    // Aggregate stats by difficulty
    const difficultyStats: Record<string, {
      count: number;
      totalXP: number;
      totalTime: number;
      avgTime: number;
    }> = {
      easy: { count: 0, totalXP: 0, totalTime: 0, avgTime: 0 },
      medium: { count: 0, totalXP: 0, totalTime: 0, avgTime: 0 },
      hard: { count: 0, totalXP: 0, totalTime: 0, avgTime: 0 },
    };
    
    progress.exerciseStats.forEach(stat => {
      const diff = stat.difficulty || 'easy';
      
      if (difficultyStats[diff]) {
        difficultyStats[diff].count += 1;
        difficultyStats[diff].totalXP += stat.xpEarned || 0;
        difficultyStats[diff].totalTime += stat.timeSpent || 0;
      }
    });
    
    // Calculate averages and percentages
    const totalExercises = progress.exerciseStats.length;
    
    const difficultyArray = Object.entries(difficultyStats).map(([difficulty, stats]) => {
      const avgTime = stats.count > 0 ? Math.round(stats.totalTime / stats.count) : 0;
      const percentage = totalExercises > 0 ? Math.round((stats.count / totalExercises) * 100) : 0;
      
      return {
        difficulty,
        count: stats.count,
        totalXP: stats.totalXP,
        totalTime: stats.totalTime,
        avgTime,
        percentage,
      };
    });
    
    return res.json({
      success: true,
      data: difficultyArray,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get difficulty stats',
      error: error.message,
    });
  }
};