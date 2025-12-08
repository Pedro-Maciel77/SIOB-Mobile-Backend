import { UserRepository } from '../../repositories/UserRepository';
import { OccurrenceRepository } from '../../repositories/OccurrenceRepository';

export class OccurrenceNotificationService {
  private userRepository = new UserRepository();
  private occurrenceRepository = new OccurrenceRepository();

  async notifyNewOccurrence(occurrenceId: string) {
    const occurrence = await this.occurrenceRepository.findById(occurrenceId);
    if (!occurrence) return;

    // Buscar supervisores e administradores
    const supervisors = await this.userRepository.findAll({
      where: { role: 'supervisor' } as any
    });

    const admins = await this.userRepository.findAll({
      where: { role: 'admin' } as any
    });

    const recipients = [...supervisors, ...admins];

    // Em produção, aqui enviaria email/push notification
    console.log(`📢 Nova ocorrência: ${occurrence.type} em ${occurrence.municipality}`);
    console.log(`👥 Notificando ${recipients.length} usuários:`);
    
    recipients.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    return {
      occurrence,
      notifiedCount: recipients.length,
      recipients: recipients.map(u => ({ id: u.id, name: u.name, email: u.email }))
    };
  }

  async notifyStatusChange(occurrenceId: string, oldStatus: string, newStatus: string) {
    const occurrence = await this.occurrenceRepository.findById(occurrenceId);
    if (!occurrence) return;

    // Notificar criador da ocorrência
    if (occurrence.createdBy) {
      console.log(`🔄 Status alterado: ${oldStatus} → ${newStatus}`);
      console.log(`📧 Notificando criador: ${occurrence.createdBy.name}`);
    }

    return {
      occurrenceId,
      oldStatus,
      newStatus,
      notifiedTo: occurrence.createdBy ? [occurrence.createdBy.id] : []
    };
  }

  async notifyAssignment(occurrenceId: string, assignedToId: string) {
    const [occurrence, assignedUser] = await Promise.all([
      this.occurrenceRepository.findById(occurrenceId),
      this.userRepository.findById(assignedToId)
    ]);

    if (!occurrence || !assignedUser) return;

    console.log(`🎯 Ocorrência atribuída: ${occurrence.type}`);
    console.log(`👷 Atribuída para: ${assignedUser.name}`);

    return {
      occurrence,
      assignedTo: assignedUser,
      message: `Você foi designado para a ocorrência ${occurrence.type} em ${occurrence.municipality}`
    };
  }

  async getOccurrenceUpdates(occurrenceId: string, hours: number = 24) {
    const occurrence = await this.occurrenceRepository.findById(occurrenceId);
    if (!occurrence) return [];

    // Aqui em produção buscaria de um sistema de notificações
    const updates = [
      {
        type: 'status_change',
        message: `Status alterado para ${occurrence.status}`,
        timestamp: occurrence.updatedAt,
        user: 'Sistema'
      }
    ];

    return updates;
  }
}