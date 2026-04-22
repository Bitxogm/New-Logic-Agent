// backend/src/routes/testExecution.ts

import express from 'express';
import { runTests } from '../controllers/testExecutionController';
import { testExecutionLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';


const router = express.Router();

/**
 * @route   POST /api/test-execution/run
 * @desc    Execute code and run tests
 * @access  Private (rate limited)
 */
router.post('/run', authenticate, testExecutionLimiter, runTests);


export default router;