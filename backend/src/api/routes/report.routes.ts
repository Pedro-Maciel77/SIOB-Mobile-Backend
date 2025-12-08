import { Router } from 'express';
import { ReportController } from '../../controllers/ReportController';
import { roleMiddleware } from '../../middlewares/auth.middleware';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const router = Router();
const reportController = new ReportController();

// Relatórios por ocorrência
router.post('/occurrence/:occurrenceId', (req, res) => 
  reportController.createReport(req, res)
);

router.get('/occurrence/:occurrenceId', (req, res) => 
  reportController.getOccurrenceReports(req, res)
);

// Relatórios individuais
router.get('/:id', (req, res) => reportController.getReportById(req, res));
router.put('/:id', (req, res) => reportController.updateReport(req, res));

// Rotas apenas para admin/supervisor
router.delete('/:id', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  reportController.deleteReport(req, res)
);

// Upload de imagem para relatório
router.post('/:id/images', 
  uploadMiddleware.single('image'),
  (req, res) => reportController.addImageToReport(req, res)
);

export default router;