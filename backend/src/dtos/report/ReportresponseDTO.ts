export class ReportResponseDTO {
  id: string;
  content: string;
  occurrence: {
    id: string;
    type: string;
    municipality: string;
    status: string;
  };
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  imagesCount: number;
  createdAt: Date;

  constructor(report: any) {
    this.id = report.id;
    this.content = report.content;
    
    this.occurrence = report.occurrence ? {
      id: report.occurrence.id,
      type: report.occurrence.type,
      municipality: report.occurrence.municipality,
      status: report.occurrence.status
    } : {
      id: '',
      type: 'Ocorrência removida',
      municipality: '',
      status: ''
    };

    this.createdBy = report.createdBy ? {
      id: report.createdBy.id,
      name: report.createdBy.name,
      email: report.createdBy.email,
      role: report.createdBy.role
    } : {
      id: '',
      name: 'Usuário removido',
      email: '',
      role: 'user'
    };

    this.imagesCount = report.images ? report.images.length : 0;
    this.createdAt = report.createdAt;
  }

  static fromEntity(report: any): ReportResponseDTO {
    return new ReportResponseDTO(report);
  }

  static fromEntities(reports: any[]): ReportResponseDTO[] {
    return reports.map(report => new ReportResponseDTO(report));
  }

  static fromEntityWithDetails(report: any): any {
    return {
      id: report.id,
      content: report.content,
      occurrence: report.occurrence ? {
        id: report.occurrence.id,
        type: report.occurrence.type,
        municipality: report.occurrence.municipality,
        address: report.occurrence.address,
        status: report.occurrence.status,
        occurrenceDate: report.occurrence.occurrenceDate
      } : null,
      createdBy: report.createdBy ? {
        id: report.createdBy.id,
        name: report.createdBy.name,
        email: report.createdBy.email,
        role: report.createdBy.role
      } : null,
      images: report.images ? report.images.map((img: any) => ({
        id: img.id,
        filename: img.filename,
        path: img.path,
        createdAt: img.createdAt
      })) : [],
      createdAt: report.createdAt
    };
  }
}