import { Router } from 'express';
import { AuditController } from '../../controllers/AuditController';
import { roleMiddleware } from '../../middlewares/auth.middleware';

const router = Router();
const auditController = new AuditController();

// Rotas apenas para admin/supervisor
router.get('/logs', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  auditController.getAuditLogs(req, res)
);

router.get('/system-activity', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  auditController.getSystemActivity(req, res)
);

router.get('/entity/:entity/:entityId', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  auditController.getEntityAudit(req, res)
);

// Rota para usuário ver sua própria atividade
router.get('/user-activity', (req, res) => 
  auditController.getUserActivity(req, res)
);

// Admin/supervisor pode ver atividade de outros usuários
router.get('/user-activity/:userId', roleMiddleware(['admin', 'supervisor']), (req, res) => 
  auditController.getUserActivity(req, res)
);

export default router;