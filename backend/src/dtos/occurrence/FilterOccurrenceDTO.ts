import { OCCURRENCE_TYPES, OCCURRENCE_STATUS } from '../../utils/constants/occurrence.types';

export class FilterOccurrenceDTO {
  page: number;
  limit: number;
  type?: string;
  status?: string;
  municipality?: string;
  neighborhood?: string;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
  search?: string;

  constructor(data: any) {
    this.page = data.page ? parseInt(data.page) : 1;
    this.limit = data.limit ? parseInt(data.limit) : 20;
    this.type = data.type;
    this.status = data.status;
    this.municipality = data.municipality;
    this.neighborhood = data.neighborhood;
    this.startDate = data.startDate ? new Date(data.startDate) : undefined;
    this.endDate = data.endDate ? new Date(data.endDate) : undefined;
    this.createdBy = data.createdBy;
    this.search = data.search;
  }

  validate(): string[] {
    const errors: string[] = [];

    // Paginação
    if (this.page < 1) {
      errors.push('Página deve ser maior que 0');
    }

    if (this.limit < 1 || this.limit > 100) {
      errors.push('Limite deve estar entre 1 e 100');
    }

    // Tipo
    if (this.type && !OCCURRENCE_TYPES.includes(this.type as any)) {
      errors.push(`Tipo inválido. Use: ${OCCURRENCE_TYPES.join(', ')}`);
    }

    // Status
    if (this.status && !OCCURRENCE_STATUS.includes(this.status as any)) {
      errors.push(`Status inválido. Use: ${OCCURRENCE_STATUS.join(', ')}`);
    }

    // Datas
    if (this.startDate && isNaN(this.startDate.getTime())) {
      errors.push('Data inicial inválida');
    }

    if (this.endDate && isNaN(this.endDate.getTime())) {
      errors.push('Data final inválida');
    }

    if (this.startDate && this.endDate && this.startDate > this.endDate) {
      errors.push('Data inicial não pode ser posterior à data final');
    }

    // Período máximo de 1 ano
    if (this.startDate && this.endDate) {
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      if (this.endDate.getTime() - this.startDate.getTime() > oneYearMs) {
        errors.push('Período máximo de consulta é 1 ano');
      }
    }

    return errors;
  }

  buildQuery(): any {
    const query: any = {
      page: this.page,
      limit: this.limit
    };

    if (this.type) query.type = this.type;
    if (this.status) query.status = this.status;
    if (this.municipality) query.municipality = this.municipality;
    if (this.neighborhood) query.neighborhood = this.neighborhood;
    if (this.startDate) query.startDate = this.startDate;
    if (this.endDate) query.endDate = this.endDate;
    if (this.createdBy) query.createdBy = this.createdBy;
    if (this.search) query.search = this.search;

    return query;
  }
}