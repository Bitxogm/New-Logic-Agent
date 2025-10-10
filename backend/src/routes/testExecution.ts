// backend/src/routes/testExecution.ts

import express from 'express';
import { runTests } from '../controllers/testExecutionController';
import { testExecutionLimiter } from '../middleware/rateLimiter';

const router = express.Router();

/**
 * @route   POST /api/test-execution/run
 * @desc    Execute code and run tests
 * @access  Public (rate limited)
 */
router.post('/run', testExecutionLimiter, runTests);

export default router;