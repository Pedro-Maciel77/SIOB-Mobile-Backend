import { VehicleRepository } from '../../repositories/VehicleRepository';
import { OccurrenceRepository } from '../../repositories/OccurrenceRepository';
import { AuditLogRepository } from '../../repositories/AuditLogRepository';

export class VehicleService {
  private vehicleRepository = new VehicleRepository();
  private occurrenceRepository = new OccurrenceRepository();
  private auditRepository = new AuditLogRepository();

  async createVehicle(data: any, userId: string) {
    this.validateVehicleData(data);

    // Verificar se placa já existe
    const existingVehicle = await this.vehicleRepository.findByPlate(data.plate);
    if (existingVehicle) {
      throw new Error('Placa já cadastrada');
    }

    const vehicle = await this.vehicleRepository.create(data);

    await this.auditRepository.logAction({
      userId,
      action: 'create',
      entity: 'vehicle',
      entityId: vehicle.id,
      details: {
        plate: vehicle.plate,
        name: vehicle.name
      }
    });

    return vehicle;
  }

  async getAllVehicles(activeOnly: boolean = true) {
    if (activeOnly) {
      return await this.vehicleRepository.findActiveVehicles();
    }
    return await this.vehicleRepository.findAll();
  }

  async getVehicleById(id: string) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Viatura não encontrada');
    }
    return vehicle;
  }

  async updateVehicle(id: string, data: any, userId: string) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Viatura não encontrada');
    }

    // Se alterar placa, verificar se já existe
    if (data.plate && data.plate !== vehicle.plate) {
      const existing = await this.vehicleRepository.findByPlate(data.plate);
      if (existing) {
        throw new Error('Placa já cadastrada em outra viatura');
      }
    }

    const changes = this.getChanges(vehicle, data);
    const updated = await this.vehicleRepository.update(id, data);

    if (Object.keys(changes).length > 0) {
      await this.auditRepository.logAction({
        userId,
        action: 'update',
        entity: 'vehicle',
        entityId: id,
        changes,
        details: { reason: 'Atualização manual' }
      });
    }

    return updated;
  }

  async deleteVehicle(id: string, userId: string) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Viatura não encontrada');
    }

    // Verificar se viatura tem ocorrências
    const occurrences = await this.occurrenceRepository.findByVehicle(id);
    if (occurrences.length > 0) {
      throw new Error('Não é possível deletar viatura com ocorrências associadas');
    }

    await this.vehicleRepository.delete(id);

    await this.auditRepository.logAction({
      userId,
      action: 'delete',
      entity: 'vehicle',
      entityId: id,
      details: {
        plate: vehicle.plate,
        name: vehicle.name
      }
    });
  }

  async getVehicleStatistics(vehicleId: string) {
    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Viatura não encontrada');
    }

    const stats = await this.vehicleRepository.getVehicleStats(vehicleId);
    const occurrences = await this.occurrenceRepository.findByVehicle(vehicleId);

    return {
      ...stats,
      recentOccurrences: occurrences.slice(0, 5).map(occ => ({
        id: occ.id,
        type: occ.type,
        date: occ.occurrenceDate,
        status: occ.status,
        municipality: occ.municipality
      }))
    };
  }

  async toggleVehicleStatus(id: string, userId: string) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new Error('Viatura não encontrada');
    }

    const newStatus = !vehicle.active;
    await this.vehicleRepository.update(id, { active: newStatus });

    await this.auditRepository.logAction({
      userId,
      action: 'update',
      entity: 'vehicle',
      entityId: id,
      changes: { active: { from: vehicle.active, to: newStatus } },
      details: { reason: 'Alteração de status' }
    });

    return { ...vehicle, active: newStatus };
  }

  private validateVehicleData(data: any) {
    const required = ['plate', 'name'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missing.join(', ')}`);
    }

    // Validar formato da placa (exemplo: ABC-1234)
    const plateRegex = /^[A-Z]{3}-\d{4}$/;
    if (!plateRegex.test(data.plate)) {
      throw new Error('Formato de placa inválido. Use: ABC-1234');
    }
  }

  private getChanges(oldData: any, newData: any) {
    const changes: Record<string, { from: any; to: any }> = {};
    
    const fields = ['plate', 'name', 'active'];
    
    fields.forEach(field => {
      if (newData[field] !== undefined && newData[field] !== oldData[field]) {
        changes[field] = {
          from: oldData[field],
          to: newData[field]
        };
      }
    });

    return changes;
  }
}