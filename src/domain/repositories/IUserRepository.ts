// src/domain/repositories/IUserRepository.ts
import { User, SafeUser } from '../entities/User';

export interface CreateUserData {
  nombre: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<SafeUser | null>;
  create(userData: CreateUserData): Promise<SafeUser>;
}
