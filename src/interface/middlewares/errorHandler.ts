// src/interface/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../application/errors/AppError';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Errores de la capa de aplicación (AppError y subclases)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // 2. Errores de Prisma capturados
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint failed
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'campo único';
      res.status(409).json({ error: `Ya existe un registro con ese valor de ${target}` });
      return;
    }

    // P2025: Record not found
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'El registro solicitado no fue encontrado' });
      return;
    }

    // P2003: Foreign key constraint failed
    if (err.code === 'P2003') {
      res.status(400).json({ error: 'Violación de restricción de clave foránea' });
      return;
    }

    res.status(400).json({ error: 'Error en la operación de base de datos' });
    return;
  }

  // 3. Errores estándar de sintaxis JSON
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'JSON mal formado en el cuerpo de la petición' });
    return;
  }

  // 4. Errores no controlados (sin exponer stack trace)
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
};
