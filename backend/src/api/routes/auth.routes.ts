import { Router } from 'express';
import { AuthController } from '../../controllers/AuthController';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Rotas públicas
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/refresh-token', (req, res) => authController.refreshToken(req, res));

// Rotas protegidas
router.post('/logout', authMiddleware, (req, res) => authController.logout(req, res));
router.get('/profile', authMiddleware, (req, res) => authController.profile(req, res));

export default router;