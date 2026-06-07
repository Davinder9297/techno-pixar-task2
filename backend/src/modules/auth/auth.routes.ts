import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', protect, AuthController.getMe);
router.get('/users', protect, authorize('Admin'), AuthController.getAllUsers);
router.patch('/users/:id/toggle-status', protect, authorize('Admin'), AuthController.toggleUserStatus);

export default router;
