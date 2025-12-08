export class AuthResponseDTO {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    registration?: string;
    unit?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };

  constructor(user: any, tokens: any) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      registration: user.registration,
      unit: user.unit,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    this.tokens = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn || 3600
    };
  }

  static fromEntity(user: any, tokens: any): AuthResponseDTO {
    return new AuthResponseDTO(user, tokens);
  }
}