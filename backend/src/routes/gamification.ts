// backend/src/routes/gamification.ts

import { Router } from 'express';
import { awardXP, completeExercise, getUserStats, getLeaderboard, useHint, getProgressStats  } from '../controllers/gamificationController';
import { authenticate } from '../middleware/auth';


const router = Router();

router.post('/award-xp', authenticate, awardXP);
router.post('/complete-exercise', authenticate, completeExercise);
router.get('/stats/:userId', authenticate, getUserStats);
router.get('/leaderboard', authenticate, getLeaderboard);
router.post('/use-hint', authenticate, useHint); 
router.get('/progress/:userId', authenticate, getProgressStats);


export default router;