export class UserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  registration?: string;
  unit?: string;
  occurrencesCount: number;
  reportsCount: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.registration = user.registration;
    this.unit = user.unit;
    this.occurrencesCount = user.occurrences ? user.occurrences.length : 0;
    this.reportsCount = user.reports ? user.reports.length : 0;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromEntity(user: any): UserResponseDTO {
    return new UserResponseDTO(user);
  }

  static fromEntities(users: any[]): UserResponseDTO[] {
    return users.map(user => new UserResponseDTO(user));
  }

  static fromEntityWithDetails(user: any): any {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      registration: user.registration,
      unit: user.unit,
      statistics: {
        occurrencesCount: user.occurrences ? user.occurrences.length : 0,
        reportsCount: user.reports ? user.reports.length : 0,
        auditLogsCount: user.auditLogs ? user.auditLogs.length : 0
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}