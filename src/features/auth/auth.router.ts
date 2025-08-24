import { Router } from 'express';
import { AuthController } from './auth.controller';
import { pool } from '../../config/db';
import redisClient from '../../config/redisClient';
import { RedisClientType } from 'redis';

const authController = new AuthController(pool, redisClient as RedisClientType);
const router = Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
