// src/interface/controllers/AuthController.ts
import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../../application/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/auth/LoginUserUseCase';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUserUseCase,
    private readonly userRepository: IUserRepository
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, email, password } = req.body;
      const result = await this.registerUseCase.execute({ nombre, email, password });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUseCase.execute({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'No autenticado' });
        return;
      }
      const user = await this.userRepository.findById(req.user.id);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };
}
