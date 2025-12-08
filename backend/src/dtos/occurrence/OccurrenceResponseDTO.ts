export class OccurrenceResponseDTO {
  id: string;
  type: string;
  municipality: string;
  neighborhood?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  occurrenceDate: Date;
  activationDate: Date;
  status: string;
  victimName?: string;
  victimContact?: string;
  vehicleNumber?: string;
  description: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  reportsCount: number;
  imagesCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(occurrence: any) {
    this.id = occurrence.id;
    this.type = occurrence.type;
    this.municipality = occurrence.municipality;
    this.neighborhood = occurrence.neighborhood;
    this.address = occurrence.address;
    this.latitude = occurrence.latitude;
    this.longitude = occurrence.longitude;
    this.occurrenceDate = occurrence.occurrenceDate;
    this.activationDate = occurrence.activationDate;
    this.status = occurrence.status;
    this.victimName = occurrence.victimName;
    this.victimContact = occurrence.victimContact;
    this.vehicleNumber = occurrence.vehicleNumber;
    this.description = occurrence.description;
    
    this.createdBy = occurrence.createdBy ? {
      id: occurrence.createdBy.id,
      name: occurrence.createdBy.name,
      email: occurrence.createdBy.email,
      role: occurrence.createdBy.role
    } : {
      id: '',
      name: 'Usuário removido',
      email: '',
      role: 'user'
    };

    this.reportsCount = occurrence.reports ? occurrence.reports.length : 0;
    this.imagesCount = occurrence.images ? occurrence.images.length : 0;
    this.createdAt = occurrence.createdAt;
    this.updatedAt = occurrence.updatedAt;
  }

  static fromEntity(occurrence: any): OccurrenceResponseDTO {
    return new OccurrenceResponseDTO(occurrence);
  }

  static fromEntities(occurrences: any[]): OccurrenceResponseDTO[] {
    return occurrences.map(occurrence => new OccurrenceResponseDTO(occurrence));
  }
}