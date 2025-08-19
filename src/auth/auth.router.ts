import { Router } from 'express';
import { AuthController } from './auth.controller';

const authController = new AuthController();
const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
