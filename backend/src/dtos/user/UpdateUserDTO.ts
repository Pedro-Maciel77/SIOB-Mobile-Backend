import { USER_ROLES } from '../../utils/constants/occurrence.types';

export class UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  registration?: string;
  unit?: string;

  constructor(data: any) {
    this.name = data.name?.trim();
    this.email = data.email?.trim().toLowerCase();
    this.password = data.password;
    this.role = data.role;
    this.registration = data.registration;
    this.unit = data.unit;
  }

  validate(): string[] {
    const errors: string[] = [];

    // Nome
    if (this.name !== undefined) {
      if (this.name.length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
      } else if (this.name.length > 100) {
        errors.push('Nome deve ter no máximo 100 caracteres');
      }
    }

    // Email
    if (this.email !== undefined && !this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    // Senha
    if (this.password !== undefined) {
      const passwordValidation = this.validatePassword(this.password);
      if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
      }
    }

    // Role
    if (this.role !== undefined && !USER_ROLES.includes(this.role as any)) {
      errors.push(`Role inválido. Use: ${USER_ROLES.join(', ')}`);
    }

    // Matrícula
    if (this.registration !== undefined && this.registration.length > 20) {
      errors.push('Matrícula deve ter no máximo 20 caracteres');
    }

    // Unidade
    if (this.unit !== undefined && this.unit.length > 50) {
      errors.push('Unidade deve ter no máximo 50 caracteres');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  getChanges(oldData: any): Record<string, { from: any; to: any }> {
    const changes: Record<string, { from: any; to: any }> = {};
    
    const fields = ['name', 'email', 'role', 'registration', 'unit'];
    
    fields.forEach(field => {
      if (this[field as keyof this] !== undefined && 
          this[field as keyof this] !== oldData[field]) {
        changes[field] = {
          from: oldData[field],
          to: this[field as keyof this]
        };
      }
    });

    // Para senha, não mostramos o valor antigo
    if (this.password !== undefined && this.password !== oldData.password) {
      changes.password = {
        from: '********',
        to: '********'
      };
    }

    return changes;
  }

  toUpdateObject(): any {
    const updateObj: any = {};
    
    if (this.name !== undefined) updateObj.name = this.name;
    if (this.email !== undefined) updateObj.email = this.email;
    if (this.password !== undefined) updateObj.password = this.password;
    if (this.role !== undefined) updateObj.role = this.role;
    if (this.registration !== undefined) updateObj.registration = this.registration;
    if (this.unit !== undefined) updateObj.unit = this.unit;

    return updateObj;
  }
}