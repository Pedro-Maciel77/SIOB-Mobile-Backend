import { AuditLogRepository } from '../../repositories/AuditLogRepository';
import { UserRepository } from '../../repositories/UserRepository';

export interface AuditFilters {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class AuditService {
  private auditRepository = new AuditLogRepository();
  private userRepository = new UserRepository();

  async getAuditLogs(filters: AuditFilters, requestingUserId: string) {
    const requestingUser = await this.userRepository.findById(requestingUserId);
    if (!requestingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Apenas admin/supervisor pode ver todos os logs
    if (requestingUser.role !== 'admin' && requestingUser.role !== 'supervisor') {
      // Usuário comum só vê seus próprios logs
      filters.userId = requestingUserId;
    }

    return await this.auditRepository.findWithFilters(filters);
  }

  async getUserActivity(userId: string, days: number = 30) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const activity = await this.auditRepository.getUserActivity(userId, days);

    // Resumo da atividade
    const summary = {
      totalActions: activity.length,
      actionsByType: this.countActionsByType(activity),
      recentActions: activity.slice(0, 20),
      firstAction: activity.length > 0 ? activity[activity.length - 1] : null,
      lastAction: activity.length > 0 ? activity[0] : null
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      summary,
      activity
    };
  }

  async getSystemActivity(days: number = 7) {
    return await this.auditRepository.getSystemActivity(days);
  }

  async getEntityAudit(entity: string, entityId: string) {
    const validEntities = ['user', 'occurrence', 'report', 'vehicle'];
    if (!validEntities.includes(entity)) {
      throw new Error(`Entidade inválida. Use: ${validEntities.join(', ')}`);
    }

    const logs = await this.auditRepository.findWithFilters({
      entity,
      entityId,
      limit: 100
    });

    // Agrupar por ação
    const groupedByAction = logs.logs.reduce((acc, log) => {
      if (!acc[log.action]) {
        acc[log.action] = [];
      }
      acc[log.action].push(log);
      return acc;
    }, {} as Record<string, any[]>);

    return {
      entity,
      entityId,
      totalLogs: logs.total,
      groupedByAction,
      timeline: logs.logs.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    };
  }

  private countActionsByType(activity: any[]) {
    return activity.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}