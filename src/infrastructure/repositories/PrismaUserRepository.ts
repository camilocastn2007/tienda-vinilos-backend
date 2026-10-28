// src/infrastructure/repositories/PrismaUserRepository.ts
import prisma from '../database/prisma';
import { IUserRepository, CreateUserData } from '../../domain/repositories/IUserRepository';
import { User, SafeUser } from '../../domain/entities/User';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) return null;

    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) return null;

    return {
      ...user,
      role: user.role as 'admin' | 'user'
    };
  }

  async create(userData: CreateUserData): Promise<SafeUser> {
    const user = await prisma.user.create({
      data: {
        nombre: userData.nombre.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        role: userData.role || 'user'
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return {
      ...user,
      role: user.role as 'admin' | 'user'
    };
  }
}
