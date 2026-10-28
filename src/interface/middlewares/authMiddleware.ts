// src/interface/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { JwtService, TokenPayload } from '../../infrastructure/security/JwtService';

// Extendemos la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token de autenticación requerido en la cabecera Authorization' });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ error: 'Formato de cabecera inválido. Debe ser: Bearer <token>' });
    return;
  }

  const token = parts[1];

  try {
    const payload = JwtService.verify(token);
    req.user = {
      id: payload.id,
      role: payload.role
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
