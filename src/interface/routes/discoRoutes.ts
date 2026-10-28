// src/interface/routes/discoRoutes.ts
import { Router } from 'express';
import { DiscoController } from '../controllers/DiscoController';
import { PrismaDiscoRepository } from '../../infrastructure/repositories/PrismaDiscoRepository';
import { GetDiscosUseCase } from '../../application/discos/GetDiscosUseCase';
import { GetDiscoByIdUseCase } from '../../application/discos/GetDiscoByIdUseCase';
import { CreateDiscoUseCase } from '../../application/discos/CreateDiscoUseCase';
import { UpdateDiscoUseCase } from '../../application/discos/UpdateDiscoUseCase';
import { DeleteDiscoUseCase } from '../../application/discos/DeleteDiscoUseCase';
import { authMiddleware } from '../middlewares/authMiddleware';
import { soloAdmin } from '../middlewares/roleMiddleware';

const discoRoutes = Router();

const discoRepository = new PrismaDiscoRepository();
const getDiscosUseCase = new GetDiscosUseCase(discoRepository);
const getDiscoByIdUseCase = new GetDiscoByIdUseCase(discoRepository);
const createDiscoUseCase = new CreateDiscoUseCase(discoRepository);
const updateDiscoUseCase = new UpdateDiscoUseCase(discoRepository);
const deleteDiscoUseCase = new DeleteDiscoUseCase(discoRepository);

const discoController = new DiscoController(
  getDiscosUseCase,
  getDiscoByIdUseCase,
  createDiscoUseCase,
  updateDiscoUseCase,
  deleteDiscoUseCase
);

// Endpoints públicos
discoRoutes.get('/', discoController.getDiscos);
discoRoutes.get('/:id', discoController.getDiscoById);

// Endpoints protegidos (solo rol admin)
discoRoutes.post('/', authMiddleware, soloAdmin, discoController.createDisco);
discoRoutes.put('/:id', authMiddleware, soloAdmin, discoController.updateDisco);
discoRoutes.delete('/:id', authMiddleware, soloAdmin, discoController.deleteDisco);

export default discoRoutes;
