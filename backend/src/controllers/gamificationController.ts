// backend/src/controllers/gamificationController.ts

import { Request, Response } from 'express';
import { UserProgress } from '../models/UserProgress';



const XP_REWARDS = {
  COMPLETE_EXERCISE_EASY: 50,
  COMPLETE_EXERCISE_MEDIUM: 100,
  COMPLETE_EXERCISE_HARD: 200,
  PERFECT_FIRST_TRY: 50,
};

const getOrCreateProgress = async (userId: string) => {
  let progress = await UserProgress.findOne({ userId });

  if (!progress) {
    progress = await UserProgress.create({
      userId,
      totalXP: 0,
      level: 1,
      completedExercises: [],
      achievements: [],
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: new Date(),
      exerciseStats: [],
      badges: [],
    });
  }

  return progress;
};

export const awardXP = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ success: false, message: 'userId and amount required' });
    }

    const progress = await getOrCreateProgress(userId);
    progress.addXP(amount);
    await progress.save();

    return res.json({ success: true, data: { totalXP: progress.totalXP, level: progress.level } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const completeExercise = async (req: Request, res: Response) => {
  try {
    const { userId, exerciseId, difficulty, language, category, timeSpent = 0 } = req.body;

    if (!userId || !exerciseId || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'userId, exerciseId, and difficulty required'
      });
    }

    const progress = await getOrCreateProgress(userId);

    // Calculate XP reward based on difficulty
    let xpReward = XP_REWARDS.COMPLETE_EXERCISE_EASY;
    if (difficulty === 'medium') xpReward = XP_REWARDS.COMPLETE_EXERCISE_MEDIUM;
    if (difficulty === 'hard') xpReward = XP_REWARDS.COMPLETE_EXERCISE_HARD;

    // Add to completed exercises if not already there
    if (!progress.completedExercises.includes(exerciseId)) {
      progress.completedExercises.push(exerciseId);
    }

    // Update or add exercise stats
    const existingStat = progress.exerciseStats.find(s => s.exerciseId === exerciseId);
    if (existingStat) {
      existingStat.attempts += 1;
      existingStat.completedAt = new Date();
      existingStat.timeSpent += timeSpent;
      existingStat.xpEarned += xpReward;
    } else {
      progress.exerciseStats.push({
        exerciseId,
        attempts: 1,
        bestScore: 100,
        completedAt: new Date(),
        timeSpent,
        difficulty,
        language: language || 'javascript',
        category: category || 'algorithms',
        xpEarned: xpReward,
      } as any);
    }

    // Update activity history for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivity = progress.activityHistory.find(
      a => new Date(a.date).toDateString() === today.toDateString()
    );

    if (todayActivity) {
      todayActivity.xpEarned += xpReward;
      todayActivity.exercisesCompleted += 1;
    } else {
      progress.activityHistory.push({
        date: today,
        xpEarned: xpReward,
        exercisesCompleted: 1,
      });
    }

    // Update streak
    progress.updateStreak();

    // Add XP and recalculate level
    progress.addXP(xpReward);

    await progress.save();

    return res.json({
      success: true,
      data: {
        xpAwarded: xpReward,
        totalXP: progress.totalXP,
        level: progress.level,
        currentStreak: progress.currentStreak,
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progress = await getOrCreateProgress(userId);

    return res.json({
      success: true,
      data: {
        totalXP: progress.totalXP,
        level: progress.level,
        completedExercises: progress.completedExercises.length,
        achievements: progress.achievements,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const topUsers = await UserProgress.find().sort({ totalXP: -1 }).limit(10);
    return res.json({ success: true, data: topUsers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Use hint - Deduct XP
 * POST /api/gamification/use-hint
 */
export const useHint = async (req: Request, res: Response) => {
  try {
    const { userId, exerciseId, hintLevel } = req.body;

    if (!userId || !exerciseId || !hintLevel) {
      return res.status(400).json({
        success: false,
        message: 'userId, exerciseId, and hintLevel are required',
      });
    }

    const progress = await getOrCreateProgress(userId);

    // Deduct XP for using hint
    const xpPenalty = 10;
    progress.totalXP = Math.max(0, progress.totalXP - xpPenalty);
    progress.calculateLevel();

    await progress.save();

    return res.json({
      success: true,
      data: {
        xpDeducted: xpPenalty,
        totalXP: progress.totalXP,
        level: progress.level,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to use hint',
      error: error.message,
    });
  }
};

export const getProgressStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;

    const progress = await getOrCreateProgress(userId);

    // Get last N days of activity
    const daysAgo = parseInt(days as string);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Filter activity history
    const recentActivity = progress.activityHistory
      .filter(activity => new Date(activity.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate stats by language
    const languageStats: Record<string, { count: number; totalTime: number }> = {};

    progress.exerciseStats.forEach(stat => {
      // We'd need to store language in exerciseStats, for now use mock data
      const lang = 'javascript'; // TODO: Add language field to exerciseStats
      if (!languageStats[lang]) {
        languageStats[lang] = { count: 0, totalTime: 0 };
      }
      languageStats[lang].count += 1;
      languageStats[lang].totalTime += stat.timeSpent;
    });

    // Calculate averages
    const avgTimePerExercise = progress.exerciseStats.length > 0
      ? progress.exerciseStats.reduce((sum, stat) => sum + stat.timeSpent, 0) / progress.exerciseStats.length
      : 0;

    // Daily goal progress (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayActivity = progress.activityHistory.find(
      a => new Date(a.date).toDateString() === today.toDateString()
    );
    const todayXP = todayActivity?.xpEarned || 0;

    // Weekly goal progress
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weeklyXP = progress.activityHistory
      .filter(a => new Date(a.date) >= weekStart)
      .reduce((sum, a) => sum + a.xpEarned, 0);

    return res.json({
      success: true,
      data: {
        recentActivity,
        languageStats,
        avgTimePerExercise: Math.round(avgTimePerExercise),
        goals: {
          daily: {
            target: progress.dailyGoal,
            current: todayXP,
            percentage: Math.min(100, Math.round((todayXP / progress.dailyGoal) * 100)),
          },
          weekly: {
            target: progress.weeklyGoal,
            current: weeklyXP,
            percentage: Math.min(100, Math.round((weeklyXP / progress.weeklyGoal) * 100)),
          },
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get progress stats',
      error: error.message,
    });
  }
};


