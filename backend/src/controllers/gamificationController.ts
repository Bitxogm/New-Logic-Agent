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
    const { userId, exerciseId, difficulty } = req.body;
    
    if (!userId || !exerciseId) {
      return res.status(400).json({ success: false, message: 'userId and exerciseId required' });
    }
    
    const progress = await getOrCreateProgress(userId);
    
    let xpReward = XP_REWARDS.COMPLETE_EXERCISE_EASY;
    if (difficulty === 'medium') xpReward = XP_REWARDS.COMPLETE_EXERCISE_MEDIUM;
    if (difficulty === 'hard') xpReward = XP_REWARDS.COMPLETE_EXERCISE_HARD;
    
    progress.completedExercises.push(exerciseId);
    progress.addXP(xpReward);
    await progress.save();
    
    return res.json({ success: true, data: { xpAwarded: xpReward, totalXP: progress.totalXP } });
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