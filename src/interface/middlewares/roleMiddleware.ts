// src/interface/middlewares/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../domain/entities/User';

export const requireRole = (role: UserRole) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({
        error: `Acceso denegado: se requieren permisos de rol '${role}' para realizar esta acción`
      });
      return;
    }

    next();
  };
};

export const soloAdmin = requireRole('admin');
