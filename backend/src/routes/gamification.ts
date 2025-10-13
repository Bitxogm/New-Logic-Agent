// backend/src/routes/gamification.ts

import { Router } from 'express';
import { awardXP, completeExercise, getUserStats, getLeaderboard, useHint } from '../controllers/gamificationController';

const router = Router();

router.post('/award-xp', awardXP);
router.post('/complete-exercise', completeExercise);
router.get('/stats/:userId', getUserStats);
router.get('/leaderboard', getLeaderboard);
router.post('/use-hint', useHint); 

export default router;