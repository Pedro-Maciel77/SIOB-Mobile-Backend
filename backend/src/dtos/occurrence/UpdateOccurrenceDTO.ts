import { OCCURRENCE_TYPES, OCCURRENCE_STATUS } from '../../utils/constants/occurrence.types';

export class UpdateOccurrenceDTO {
  type?: string;
  municipality?: string;
  neighborhood?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  occurrenceDate?: Date;
  activationDate?: Date;
  status?: string;
  victimName?: string;
  victimContact?: string;
  vehicleNumber?: string;
  description?: string;

  constructor(data: any) {
    this.type = data.type;
    this.municipality = data.municipality;
    this.neighborhood = data.neighborhood;
    this.address = data.address;
    this.latitude = data.latitude ? parseFloat(data.latitude) : undefined;
    this.longitude = data.longitude ? parseFloat(data.longitude) : undefined;
    this.occurrenceDate = data.occurrenceDate ? new Date(data.occurrenceDate) : undefined;
    this.activationDate = data.activationDate ? new Date(data.activationDate) : undefined;
    this.status = data.status;
    this.victimName = data.victimName;
    this.victimContact = data.victimContact;
    this.vehicleNumber = data.vehicleNumber;
    this.description = data.description;
  }

  validate(): string[] {
    const errors: string[] = [];

    // Tipo
    if (this.type && !OCCURRENCE_TYPES.includes(this.type as any)) {
      errors.push(`Tipo inválido. Use: ${OCCURRENCE_TYPES.join(', ')}`);
    }

    // Município
    if (this.municipality && this.municipality.length < 2) {
      errors.push('Município inválido');
    }

    // Endereço
    if (this.address && this.address.length < 5) {
      errors.push('Endereço muito curto');
    }

    // Datas
    if (this.occurrenceDate && isNaN(this.occurrenceDate.getTime())) {
      errors.push('Data da ocorrência inválida');
    }

    if (this.activationDate && isNaN(this.activationDate.getTime())) {
      errors.push('Data de acionamento inválida');
    }

    if (this.occurrenceDate && this.activationDate && 
        this.occurrenceDate > this.activationDate) {
      errors.push('Data da ocorrência não pode ser posterior à data de acionamento');
    }

    // Status
    if (this.status && !OCCURRENCE_STATUS.includes(this.status as any)) {
      errors.push(`Status inválido. Use: ${OCCURRENCE_STATUS.join(', ')}`);
    }

    // Coordenadas
    if (this.latitude !== undefined) {
      if (this.latitude < -90 || this.latitude > 90) {
        errors.push('Latitude inválida. Deve estar entre -90 e 90');
      }
    }

    if (this.longitude !== undefined) {
      if (this.longitude < -180 || this.longitude > 180) {
        errors.push('Longitude inválida. Deve estar entre -180 e 180');
      }
    }

    // Descrição
    if (this.description) {
      if (this.description.length < 10) {
        errors.push('Descrição muito curta (mínimo 10 caracteres)');
      } else if (this.description.length > 5000) {
        errors.push('Descrição muito longa (máximo 5000 caracteres)');
      }
    }

    // Contato da vítima
    if (this.victimContact && !this.isValidPhone(this.victimContact)) {
      errors.push('Contato da vítima inválido');
    }

    return errors;
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+55)?\s?(\(?\d{2}\)?)?\s?9?\s?\d{4}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  getChanges(oldData: any): Record<string, { from: any; to: any }> {
    const changes: Record<string, { from: any; to: any }> = {};
    
    const fields = [
      'type', 'municipality', 'neighborhood', 'address',
      'latitude', 'longitude', 'occurrenceDate', 'activationDate',
      'status', 'victimName', 'victimContact', 'vehicleNumber', 'description'
    ];
    
    fields.forEach(field => {
      if (this[field as keyof this] !== undefined && 
          this[field as keyof this] !== oldData[field]) {
        changes[field] = {
          from: oldData[field],
          to: this[field as keyof this]
        };
      }
    });

    return changes;
  }
}