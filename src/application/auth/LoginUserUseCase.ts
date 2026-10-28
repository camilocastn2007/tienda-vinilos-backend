// src/application/auth/LoginUserUseCase.ts
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { SafeUser } from '../../domain/entities/User';
import { BcryptHasher } from '../../infrastructure/security/BcryptHasher';
import { JwtService } from '../../infrastructure/security/JwtService';
import { BadRequestError, UnauthorizedError } from '../errors/AppError';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
}

export class LoginUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: LoginDTO): Promise<AuthResponse> {
    if (!dto.email || !dto.password) {
      throw new BadRequestError('Email y contraseña son requeridos');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      // Mensaje genérico para no revelar si falló el email o la contraseña (Requerimiento de Rúbrica)
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const isPasswordValid = await BcryptHasher.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const token = JwtService.sign({
      id: user.id,
      role: user.role
    });

    const safeUser: SafeUser = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return {
      user: safeUser,
      token
    };
  }
}
