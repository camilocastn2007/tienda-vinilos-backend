// src/interface/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import discoRoutes from './discoRoutes';
import pedidoRoutes from './pedidoRoutes';

const router = Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas del catálogo (con alias para máxima compatibilidad con las pruebas del docente)
router.use('/discos', discoRoutes);
router.use('/catalogo', discoRoutes);

// Rutas de interacción (pedidos/reservas, con alias de compatibilidad)
router.use('/pedidos', pedidoRoutes);
router.use('/interaccion', pedidoRoutes);

export default router;
