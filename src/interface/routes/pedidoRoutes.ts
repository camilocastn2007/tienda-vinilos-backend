// src/interface/routes/pedidoRoutes.ts
import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';
import { PrismaPedidoRepository } from '../../infrastructure/repositories/PrismaPedidoRepository';
import { PrismaDiscoRepository } from '../../infrastructure/repositories/PrismaDiscoRepository';
import { CreatePedidoUseCase } from '../../application/pedidos/CreatePedidoUseCase';
import { GetMisPedidosUseCase } from '../../application/pedidos/GetMisPedidosUseCase';
import { GetAllPedidosUseCase } from '../../application/pedidos/GetAllPedidosUseCase';
import { DeletePedidoUseCase } from '../../application/pedidos/DeletePedidoUseCase';
import { authMiddleware } from '../middlewares/authMiddleware';
import { soloAdmin } from '../middlewares/roleMiddleware';

const pedidoRoutes = Router();

const pedidoRepository = new PrismaPedidoRepository();
const discoRepository = new PrismaDiscoRepository();

const createPedidoUseCase = new CreatePedidoUseCase(pedidoRepository, discoRepository);
const getMisPedidosUseCase = new GetMisPedidosUseCase(pedidoRepository);
const getAllPedidosUseCase = new GetAllPedidosUseCase(pedidoRepository);
const deletePedidoUseCase = new DeletePedidoUseCase(pedidoRepository);

const pedidoController = new PedidoController(
  createPedidoUseCase,
  getMisPedidosUseCase,
  getAllPedidosUseCase,
  deletePedidoUseCase
);

// Endpoints protegidos para usuario autenticado
pedidoRoutes.post('/', authMiddleware, pedidoController.crearPedido);
pedidoRoutes.get('/mias', authMiddleware, pedidoController.getMisPedidos);
pedidoRoutes.delete('/:id', authMiddleware, pedidoController.eliminarPedido);

// Endpoint exclusivo para administrador
pedidoRoutes.get('/', authMiddleware, soloAdmin, pedidoController.getAllPedidos);

export default pedidoRoutes;
