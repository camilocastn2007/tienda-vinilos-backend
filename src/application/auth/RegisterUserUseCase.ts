// src/application/auth/RegisterUserUseCase.ts
import { IUserRepository, CreateUserData } from '../../domain/repositories/IUserRepository';
import { SafeUser } from '../../domain/entities/User';
import { BcryptHasher } from '../../infrastructure/security/BcryptHasher';
import { JwtService } from '../../infrastructure/security/JwtService';
import { BadRequestError, ConflictError } from '../errors/AppError';

export interface RegisterDTO {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterDTO): Promise<AuthResponse> {
    if (!dto.nombre || dto.nombre.trim().length < 3) {
      throw new BadRequestError('El nombre debe tener al menos 3 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dto.email || !emailRegex.test(dto.email.trim())) {
      throw new BadRequestError('Ingresa un correo electrónico válido');
    }

    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError('El correo electrónico ya se encuentra registrado');
    }

    const hashedPassword = await BcryptHasher.hash(dto.password);

    const newUser = await this.userRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      password: hashedPassword,
      role: 'user'
    });

    const token = JwtService.sign({
      id: newUser.id,
      role: newUser.role
    });

    return {
      user: newUser,
      token
    };
  }
}
