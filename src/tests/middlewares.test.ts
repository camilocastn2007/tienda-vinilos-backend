// src/tests/middlewares.test.ts
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../interface/middlewares/authMiddleware';
import { soloAdmin, requireRole } from '../interface/middlewares/roleMiddleware';
import { JwtService } from '../infrastructure/security/JwtService';

// Mock de variables de entorno para tests
process.env.JWT_SECRET = 'test_jwt_secret_key_12345';
process.env.JWT_EXPIRES_IN = '1h';

describe('Pruebas automatizadas de Middlewares de Seguridad (Bonus +3)', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('authMiddleware (Autenticación JWT)', () => {
    test('Debe responder 401 si no se envía la cabecera Authorization', () => {
      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('Token de autenticación requerido') })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('Debe responder 401 si el formato no es Bearer <token>', () => {
      mockRequest.headers = { authorization: 'Basic 123456' };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('Formato de cabecera inválido') })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('Debe responder 401 si el token es falso o está corrupto', () => {
      mockRequest.headers = { authorization: 'Bearer token_invalido_xyz' };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('Debe inyectar req.user y llamar a next() cuando el token es válido', () => {
      const token = JwtService.sign({ id: 'user-123', role: 'user' });
      mockRequest.headers = { authorization: `Bearer ${token}` };

      authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.user).toEqual({ id: 'user-123', role: 'user' });
      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });

  describe('roleMiddleware / soloAdmin (Autorización por Roles)', () => {
    test('Debe responder 401 si req.user no existe', () => {
      mockRequest.user = undefined;

      soloAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('Debe responder 403 Forbidden si el usuario tiene rol user e intenta acceder como admin', () => {
      mockRequest.user = { id: 'user-456', role: 'user' };

      soloAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('se requieren permisos de rol') })
      );
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('Debe permitir el paso con next() si el usuario tiene rol admin', () => {
      mockRequest.user = { id: 'admin-789', role: 'admin' };

      soloAdmin(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });
  });
});
