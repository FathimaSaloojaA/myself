import { Router } from 'express';
import {
  getMemories,
  getMemoryById,
  createMemory,
  deleteMemory,
} from '../controllers/memoryController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getMemories);
router.get('/:id', getMemoryById);
router.post('/', createMemory);
router.delete('/:id', deleteMemory);

export default router;
