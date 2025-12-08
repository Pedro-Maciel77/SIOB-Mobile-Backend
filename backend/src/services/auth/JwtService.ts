import jwt, { Secret } from 'jsonwebtoken';

export class JwtService {
  private accessTokenSecret: Secret;
  private refreshTokenSecret: Secret;
  private accessTokenExpiry: import('ms').StringValue | number;
  private refreshTokenExpiry: import('ms').StringValue | number;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || 'siob-access-secret-key';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || this.accessTokenSecret;
    this.accessTokenExpiry = (process.env.JWT_EXPIRES_IN as import('ms').StringValue) || '1h';
    this.refreshTokenExpiry = (process.env.JWT_REFRESH_EXPIRES_IN as import('ms').StringValue) || '7d';
  }

  generateAccessToken(payload: any): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry
    });
}

generateRefreshToken(payload: any): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry
    });
}

  verifyAccessToken(token: string): any {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      throw new Error('Token de acesso inválido ou expirado');
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      throw new Error('Refresh token inválido ou expirado');
    }
  }

  decodeToken(token: string): any {
    return jwt.decode(token);
  }

  getTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}