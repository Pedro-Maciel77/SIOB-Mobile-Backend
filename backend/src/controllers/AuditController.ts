import { Request, Response } from 'express';
import { AuditService } from '../services/audit/AuditService';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuditController {
  private auditService = new AuditService();

  async getAuditLogs(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const {
        page = 1,
        limit = 50,
        action,
        entity,
        entityId,
        startDate,
        endDate,
        userId: filterUserId
      } = req.query;

      const filters = {
        page: Number(page),
        limit: Number(limit),
        action: action as string,
        entity: entity as string,
        entityId: entityId as string,
        userId: filterUserId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      };

      const result = await this.auditService.getAuditLogs(filters, userId);

      return res.status(200).json({
        success: true,
        data: result.logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: result.total,
          totalPages: Math.ceil(result.total / Number(limit))
        }
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter logs de auditoria'
      });
    }
  }

  async getUserActivity(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { targetUserId, days = 30 } = req.query;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const user = req.user;
      
      // Apenas admin/supervisor pode ver atividade de outros usuários
      if (targetUserId && targetUserId !== userId && 
          user.role !== 'admin' && user.role !== 'supervisor') {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      const targetId = targetUserId as string || userId;
      const activity = await this.auditService.getUserActivity(targetId, Number(days));

      return res.status(200).json({
        success: true,
        data: activity
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter atividade do usuário'
      });
    }
  }

  async getSystemActivity(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const user = req.user;
      if (user.role !== 'admin' && user.role !== 'supervisor') {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      const { days = 7 } = req.query;
      const activity = await this.auditService.getSystemActivity(Number(days));

      return res.status(200).json({
        success: true,
        data: activity
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter atividade do sistema'
      });
    }
  }

  async getEntityAudit(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { entity, entityId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Não autenticado'
        });
      }

      const user = req.user;
      if (user.role !== 'admin' && user.role !== 'supervisor') {
        return res.status(403).json({
          success: false,
          message: 'Permissão negada'
        });
      }

      const logs = await this.auditService.getEntityAudit(entity, entityId);

      return res.status(200).json({
        success: true,
        data: logs
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao obter auditoria da entidade'
      });
    }
  }
}