// src/app.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './interface/routes';
import { errorHandler } from './interface/middlewares/errorHandler';

dotenv.config();

const app: Application = express();

// Configuración estricta de CORS según la rúbrica (no *)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite peticiones sin origin, orígenes en la lista o cualquier subdominio de vercel.app
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por la política de CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación de salud
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    servicio: 'VinilosMilo REST API',
    version: '1.0.0'
  });
});

// Rutas principales de la API
app.use('/api', apiRoutes);

// Manejador para rutas 404 no existentes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador centralizado de errores
app.use(errorHandler);

export default app;
