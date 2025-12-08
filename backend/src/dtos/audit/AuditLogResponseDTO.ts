export class AuditLogResponseDTO {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  details?: any;
  changes?: any;
  createdAt: Date;

  constructor(auditLog: any) {
    this.id = auditLog.id;
    this.action = auditLog.action;
    this.entity = auditLog.entity;
    this.entityId = auditLog.entityId;
    
    this.user = auditLog.user ? {
      id: auditLog.user.id,
      name: auditLog.user.name,
      email: auditLog.user.email,
      role: auditLog.user.role
    } : {
      id: '',
      name: 'Usuário removido',
      email: '',
      role: 'user'
    };

    this.details = auditLog.details;
    this.changes = auditLog.changes;
    this.createdAt = auditLog.createdAt;
  }

  static fromEntity(auditLog: any): AuditLogResponseDTO {
    return new AuditLogResponseDTO(auditLog);
  }

  static fromEntities(auditLogs: any[]): AuditLogResponseDTO[] {
    return auditLogs.map(log => new AuditLogResponseDTO(log));
  }

  static formatForDisplay(auditLog: any): any {
    return {
      id: auditLog.id,
      action: auditLog.action,
      entity: auditLog.entity,
      entityId: auditLog.entityId,
      user: auditLog.user ? {
        id: auditLog.user.id,
        name: auditLog.user.name,
        email: auditLog.user.email
      } : null,
      details: this.formatDetails(auditLog.details),
      changes: this.formatChanges(auditLog.changes),
      timestamp: auditLog.createdAt,
      formattedTime: new Date(auditLog.createdAt).toLocaleString('pt-BR')
    };
  }

  private static formatDetails(details: any): any {
    if (!details) return null;
    
    // Remove informações sensíveis
    const safeDetails = { ...details };
    
    if (safeDetails.password) {
      safeDetails.password = '********';
    }
    
    if (safeDetails.token) {
      safeDetails.token = '********';
    }

    return safeDetails;
  }

  private static formatChanges(changes: any): any {
    if (!changes) return null;
    
    const formattedChanges: any = {};
    
    Object.keys(changes).forEach(key => {
      const change = changes[key];
      
      // Formata valores especiais
      const formatValue = (value: any) => {
        if (value instanceof Date) {
          return value.toLocaleString('pt-BR');
        }
        
        if (value === null || value === undefined) {
          return value;
        }
        
        if (typeof value === 'object') {
          return JSON.stringify(value);
        }
        
        return value;
      };

      formattedChanges[key] = {
        from: formatValue(change.from),
        to: formatValue(change.to)
      };
    });

    return formattedChanges;
  }
}