import { Router } from 'express';
import { login } from './login/login.service';
import { refreshToken } from './refreshToken/refreshToken.service';
import { logout } from './logout/logout.service';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/logout', logout);

export default authRouter;
