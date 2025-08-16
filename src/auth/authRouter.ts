import { Router } from 'express';
import { login } from './login/login.controller';
import { refreshToken } from './refreshToken/refreshToken.controller';
import { logout } from './logout/logout.controller';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logout);

export default authRouter;
