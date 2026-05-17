import { Router } from 'express';
import { AuthControllers } from './auth.controllers';

const oauthRouter = Router();

oauthRouter.get('/google', AuthControllers.googleLogin);
oauthRouter.get('/google/callback', AuthControllers.googleCallback);

export default oauthRouter;
