import { UserRepository } from '../../repositories/UserRepository';
import { PasswordService } from '../auth/PasswordService';
import { AuditLogRepository } from '../../repositories/AuditLogRepository';

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  unit?: string;
}

export class UserService {
  private userRepository = new UserRepository();
  private passwordService = new PasswordService();
  private auditRepository = new AuditLogRepository();

  async createUser(data: any) {
    // Validar dados
    this.validateUserData(data);

    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Verificar se matrícula já existe
    if (data.registration) {
      const existingByRegistration = await this.userRepository.findByRegistration(data.registration);
      if (existingByRegistration) {
        throw new Error('Matrícula já cadastrada');
      }
    }

    // Hash da senha se fornecida
    let password = data.password;
    if (password) {
      password = await this.passwordService.hashPassword(password);
    } else {
      // Gerar senha padrão se não fornecida
      password = await this.passwordService.hashPassword('123456'); // Senha padrão
    }

    // Criar usuário
    const user = await this.userRepository.create({
      ...data,
      password,
      role: data.role || 'user'
    });

    // Log de auditoria
    await this.auditRepository.logAction({
      userId: 'system', // Ou ID do criador se disponível
      action: 'create',
      entity: 'user',
      entityId: user.id,
      details: {
        email: user.email,
        role: user.role,
        createdBy: 'system'
      }
    });

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(filters: UserFilters) {
    return await this.userRepository.findWithFilters(filters);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUser(id: string, data: any, updatedById: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Capturar alterações
    const changes = this.getChanges(user, data);

    // Se houver nova senha, fazer hash
    if (data.password) {
      data.password = await this.passwordService.hashPassword(data.password);
    } else {
      // Não atualizar senha se não fornecida
      delete data.password;
    }

    // Atualizar usuário
    const updatedUser = await this.userRepository.updateProfile(id, data);

    // Log de auditoria se houver mudanças
    if (Object.keys(changes).length > 0) {
      await this.auditRepository.logAction({
        userId: updatedById,
        action: 'update',
        entity: 'user',
        entityId: id,
        changes,
        details: { updatedBy: updatedById }
      });
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = updatedUser || user;
    return userWithoutPassword;
  }

  async deleteUser(id: string, deletedById: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Não permitir deletar último admin
    if (user.role === 'admin') {
      const adminCount = await this.userRepository.count({
        where: { role: 'admin' } as any
      });
      
      if (adminCount <= 1) {
        throw new Error('Não é possível deletar o último administrador');
      }
    }

    await this.userRepository.delete(id);

    // Log de auditoria
    await this.auditRepository.logAction({
      userId: deletedById,
      action: 'delete',
      entity: 'user',
      entityId: id,
      details: {
        deletedUserEmail: user.email,
        deletedUserRole: user.role,
        deletedBy: deletedById
      }
    });
  }

  async getStatistics() {
    const stats = await this.userRepository.getStatistics();

    return {
      total: stats.total,
      byRole: stats.byRole,
      byUnit: stats.byUnit,
      recentUsers: await this.getRecentUsers(10)
    };
  }

  private async getRecentUsers(limit: number) {
    const users = await this.userRepository.findAll({
      order: { createdAt: 'DESC' },
      take: limit
    });

    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  private validateUserData(data: any) {
    const required = ['name', 'email'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missing.join(', ')}`);
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Email inválido');
    }

    // Validar role
    const validRoles = ['admin', 'supervisor', 'user', 'operator'];
    if (data.role && !validRoles.includes(data.role)) {
      throw new Error(`Role inválido. Use: ${validRoles.join(', ')}`);
    }
  }

  private getChanges(oldData: any, newData: any) {
    const changes: Record<string, { from: any; to: any }> = {};
    
    const fields = ['name', 'email', 'role', 'unit', 'registration'];
    
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