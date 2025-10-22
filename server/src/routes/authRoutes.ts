import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthService } from '../services/AuthService';

export const createAuthRoutes = (authService: AuthService): Router => {
  const router = Router();
  const authController = new AuthController(authService);

  router.post('/login', authController.login);
  router.post('/register', authController.register);
  router.get('/me', authMiddleware(authService), authController.me);

  return router;
};
