// src/interface/routes/authRoutes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { RegisterUserUseCase } from '../../application/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/auth/LoginUserUseCase';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRoutes = Router();

const userRepository = new PrismaUserRepository();
const registerUseCase = new RegisterUserUseCase(userRepository);
const loginUseCase = new LoginUserUseCase(userRepository);
const authController = new AuthController(registerUseCase, loginUseCase, userRepository);

// Endpoints públicos
authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);

// Endpoint autenticado
authRoutes.get('/me', authMiddleware, authController.me);

export default authRoutes;
