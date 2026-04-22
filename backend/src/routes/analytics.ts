// backend/src/routes/analytics.ts

import { Router } from 'express';
import { authenticate } from '../middleware/auth';

import { 
  getHeatmapData, 
  getLanguageStats, 
  getDifficultyStats 
} from '../controllers/analyticsController';

const router = Router();

/**
 * @route   GET /api/analytics/heatmap/:userId
 * @desc    Get activity heatmap data
 * @access  Private
 */
router.get('/heatmap/:userId', authenticate, getHeatmapData);

/**
 * @route   GET /api/analytics/language-stats/:userId
 * @desc    Get statistics by programming language
 * @access  Private
 */
router.get('/language-stats/:userId', authenticate, getLanguageStats);

/**
 * @route   GET /api/analytics/difficulty-stats/:userId
 * @desc    Get statistics by difficulty level
 * @access  Private
 */
router.get('/difficulty-stats/:userId', authenticate, getDifficultyStats);


export default router;