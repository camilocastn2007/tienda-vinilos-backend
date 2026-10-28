// src/infrastructure/security/JwtService.ts
import jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/entities/User';

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export class JwtService {
  private static getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno');
    }
    return secret;
  }

  private static getExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '24h';
  }

  static sign(payload: TokenPayload): string {
    const secret = this.getSecret();
    const expiresIn = this.getExpiresIn();
    return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
  }

  static verify(token: string): TokenPayload {
    const secret = this.getSecret();
    return jwt.verify(token, secret) as TokenPayload;
  }
}
