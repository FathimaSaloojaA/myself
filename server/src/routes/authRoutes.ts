import { Router } from 'express';
import {
  login,
  getMe,
  setupPasscode,
  verifyPasscode,
  removePasscode,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Predefined Login only (No public registration route)
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/passcode/setup', authenticateToken, setupPasscode);
router.post('/passcode/verify', authenticateToken, verifyPasscode);
router.delete('/passcode', authenticateToken, removePasscode);

export default router;
