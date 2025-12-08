import { Router } from 'express';
import { OccurrenceController } from '../../controllers/OccurrenceController';
import { roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const occurrenceController = new OccurrenceController();

// Rotas para ocorrências
router.post('/', (req, res) => occurrenceController.createOccurrence(req, res));
router.get('/', (req, res) => occurrenceController.listOccurrences(req, res));
router.get('/statistics', (req, res) => occurrenceController.getStatistics(req, res));
router.get('/:id', (req, res) => occurrenceController.getOccurrence(req, res));
router.put('/:id', (req, res) => occurrenceController.updateOccurrence(req, res));
router.patch('/:id/status', (req, res) => occurrenceController.updateStatus(req, res));

// Rotas apenas para admin/supervisor
router.delete('/:id', roleMiddleware(['admin', 'supervisor']), (req, res) => {
  // Implementar delete
  res.status(200).json({ message: 'Ocorrência deletada' });
});

export default router;