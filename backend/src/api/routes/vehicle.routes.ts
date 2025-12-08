import { Router } from 'express';
import { VehicleController } from '../../controllers/VehicleController';
import { roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const vehicleController = new VehicleController();

// Todas as rotas exigem autenticação
router.post('/', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  vehicleController.createVehicle(req, res)
);

router.get('/', (req, res) => vehicleController.getAllVehicles(req, res));
router.get('/:id', (req, res) => vehicleController.getVehicleById(req, res));
router.get('/:id/statistics', (req, res) => 
  vehicleController.getVehicleStatistics(req, res)
);

router.put('/:id', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  vehicleController.updateVehicle(req, res)
);

router.patch('/:id/toggle-status', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  vehicleController.toggleVehicleStatus(req, res)
);

router.delete('/:id', roleMiddleware(['admin']), (req, res) => 
  vehicleController.deleteVehicle(req, res)
);

export default router;