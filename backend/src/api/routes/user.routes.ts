import { Router } from 'express';
import { UserController } from '../../controllers/UserController';
import { roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Rotas para admin/supervisor
router.post('/', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  userController.createUser(req, res)
);

router.get('/', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  userController.getAllUsers(req, res)
);

router.get('/statistics', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  userController.getStatistics(req, res)
);

// Rotas para admin apenas
router.delete('/:id', roleMiddleware(['admin']), (req, res) => 
  userController.deleteUser(req, res)
);

// Rotas para usuário autenticado
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));

// Rota para perfil do usuário atual
router.put('/profile/update', (req, res) => 
  userController.updateProfile(req, res)
);

export default router;