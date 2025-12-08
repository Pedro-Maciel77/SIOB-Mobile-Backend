import { ReportRepository } from '../../repositories/ReportRepository';
import { OccurrenceRepository } from '../../repositories/OccurrenceRepository';
import { UserRepository } from '../../repositories/UserRepository';
import { AuditLogRepository } from '../../repositories/AuditLogRepository';

export interface ReportFilters {
  page?: number;
  limit?: number;
  occurrenceId?: string;
  createdBy?: string;
}

export class ReportService {
  private reportRepository = new ReportRepository();
  private occurrenceRepository = new OccurrenceRepository();
  private userRepository = new UserRepository();
  private auditRepository = new AuditLogRepository();

  async createReport(occurrenceId: string, data: any, userId: string) {
    // Validar dados
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('Conteúdo do relatório é obrigatório');
    }

    // Verificar se ocorrência existe
    const occurrence = await this.occurrenceRepository.findById(occurrenceId);
    if (!occurrence) {
      throw new Error('Ocorrência não encontrada');
    }

    // Verificar se usuário existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Criar relatório
    const report = await this.reportRepository.create({
      content: data.content,
      occurrence: { id: occurrenceId } as any,
      createdBy: { id: userId } as any
    });

    // Log de auditoria
    await this.auditRepository.logAction({
      userId,
      action: 'create',
      entity: 'report',
      entityId: report.id,
      details: {
        occurrenceId,
        contentLength: data.content.length
      }
    });

    return report;
  }

  async getReportById(id: string) {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new Error('Relatório não encontrado');
    }
    return report;
  }

  async getOccurrenceReports(filters: ReportFilters) {
    return await this.reportRepository.findWithFilters(filters);
  }

  async updateReport(id: string, data: any, userId: string) {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new Error('Relatório não encontrado');
    }

    // Verificar permissões (apenas criador ou admin/supervisor)
    const user = await this.userRepository.findById(userId);
    if (!user || (user.role !== 'admin' && user.role !== 'supervisor' && report.createdBy.id !== user.id)) {
    throw new Error('Permissao negada para editar este relatorio');
}

    // Validar conteúdo
    if (data.content && data.content.trim().length === 0) {
      throw new Error('Conteúdo do relatório não pode ser vazio');
    }

    const changes = this.getChanges(report, data);
    const updated = await this.reportRepository.update(id, data);

    if (Object.keys(changes).length > 0) {
      await this.auditRepository.logAction({
        userId,
        action: 'update',
        entity: 'report',
        entityId: id,
        changes,
        details: { reason: 'Atualização de relatório' }
      });
    }

    return updated;
  }

  async deleteReport(id: string, userId: string) {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new Error('Relatório não encontrado');
    }

    // Verificar permissões (apenas admin/supervisor)
    const user = await this.userRepository.findById(userId);
    if (!user || (user.role !== 'admin' && user.role !== 'supervisor')) {
    throw new Error('Permissao negada para deletar relatorios');
}

    await this.reportRepository.delete(id);

    await this.auditRepository.logAction({
      userId,
      action: 'delete',
      entity: 'report',
      entityId: id,
      details: {
        occurrenceId: report.occurrence.id,
        createdById: report.createdBy.id
      }
    });
  }

  async addImage(reportId: string, file: any, userId: string) {
    const report = await this.reportRepository.findById(reportId);
    if (!report) {
      throw new Error('Relatório não encontrado');
    }

    // Em implementação real, salvar arquivo no storage
    const imageData = {
      filename: file.originalname,
      path: `/uploads/reports/${reportId}/${file.filename}`,
      report: { id: reportId } as any
    };

    // Log de auditoria
    await this.auditRepository.logAction({
      userId,
      action: 'update',
      entity: 'report',
      entityId: reportId,
      details: {
        action: 'add_image',
        filename: file.originalname,
        size: file.size
      }
    });

    return report;
  }

  private getChanges(oldData: any, newData: any) {
    const changes: Record<string, { from: any; to: any }> = {};
    
    if (newData.content && newData.content !== oldData.content) {
      changes.content = {
        from: oldData.content.substring(0, 100) + '...',
        to: newData.content.substring(0, 100) + '...'
      };
    }

    return changes;
  }
}