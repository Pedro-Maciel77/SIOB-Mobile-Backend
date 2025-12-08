import { USER_ROLES } from '../../utils/constants/occurrence.types';

export class CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  registration?: string;
  unit?: string;

  constructor(data: any) {
    this.name = data.name?.trim();
    this.email = data.email?.trim().toLowerCase();
    this.password = data.password;
    this.role = data.role || 'user';
    this.registration = data.registration;
    this.unit = data.unit;
  }

  validate(): string[] {
    const errors: string[] = [];

    // Nome
    if (!this.name) {
      errors.push('Nome é obrigatório');
    } else if (this.name.length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    } else if (this.name.length > 100) {
      errors.push('Nome deve ter no máximo 100 caracteres');
    }

    // Email
    if (!this.email) {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    // Senha
    if (!this.password) {
      errors.push('Senha é obrigatória');
    } else {
      const passwordValidation = this.validatePassword(this.password);
      if (!passwordValidation.valid) {
        errors.push(...passwordValidation.errors);
      }
    }

    // Role
    if (!USER_ROLES.includes(this.role as any)) {
      errors.push(`Role inválido. Use: ${USER_ROLES.join(', ')}`);
    }

    // Matrícula
    if (this.registration && this.registration.length > 20) {
      errors.push('Matrícula deve ter no máximo 20 caracteres');
    }

    // Unidade
    if (this.unit && this.unit.length > 50) {
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

    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial (@$!%*?&)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  toEntity(): any {
    return {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      registration: this.registration,
      unit: this.unit
    };
  }
}