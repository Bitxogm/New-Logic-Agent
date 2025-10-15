// backend/src/routes/analytics.ts

import { Router } from 'express';
import { 
  getHeatmapData, 
  getLanguageStats, 
  getDifficultyStats 
} from '../controllers/analyticsController';

const router = Router();

/**
 * @route   GET /api/analytics/heatmap/:userId
 * @desc    Get activity heatmap data
 * @access  Public (TODO: make private with auth)
 */
router.get('/heatmap/:userId', getHeatmapData);

/**
 * @route   GET /api/analytics/language-stats/:userId
 * @desc    Get statistics by programming language
 * @access  Public (TODO: make private with auth)
 */
router.get('/language-stats/:userId', getLanguageStats);

/**
 * @route   GET /api/analytics/difficulty-stats/:userId
 * @desc    Get statistics by difficulty level
 * @access  Public (TODO: make private with auth)
 */
router.get('/difficulty-stats/:userId', getDifficultyStats);

export default router;