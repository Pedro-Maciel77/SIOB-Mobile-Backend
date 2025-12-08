export class LoginDTO {
  email: string;
  password: string;

  constructor(data: any) {
    this.email = data.email?.trim().toLowerCase();
    this.password = data.password;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.email) {
      errors.push('Email é obrigatório');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Email inválido');
    }

    if (!this.password) {
      errors.push('Senha é obrigatória');
    } else if (this.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}