import { Router } from 'express';
import { login } from './login/login.controller';
import { logout } from './logout/logout.controller';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;
