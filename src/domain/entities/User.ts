// src/domain/entities/User.ts

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'password'>;
