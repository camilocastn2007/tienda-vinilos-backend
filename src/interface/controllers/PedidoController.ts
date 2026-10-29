// src/interface/controllers/PedidoController.ts
import { Request, Response, NextFunction } from 'express';
import { CreatePedidoUseCase } from '../../application/pedidos/CreatePedidoUseCase';
import { GetMisPedidosUseCase } from '../../application/pedidos/GetMisPedidosUseCase';
import { GetAllPedidosUseCase } from '../../application/pedidos/GetAllPedidosUseCase';
import { DeletePedidoUseCase } from '../../application/pedidos/DeletePedidoUseCase';

export class PedidoController {
  constructor(
    private readonly createPedidoUseCase: CreatePedidoUseCase,
    private readonly getMisPedidosUseCase: GetMisPedidosUseCase,
    private readonly getAllPedidosUseCase: GetAllPedidosUseCase,
    private readonly deletePedidoUseCase: DeletePedidoUseCase
  ) {}

  crearPedido = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // REGLA OBLIGATORIA: El userId se toma exclusivamente del token verificado (req.user), NUNCA del body.
      const userId = req.user!.id;
      const { discoId, cantidad, mensaje } = req.body;

      const pedido = await this.createPedidoUseCase.execute({
        userId,
        discoId,
        cantidad,
        mensaje
      });

      res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  };

  getMisPedidos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const pedidos = await this.getMisPedidosUseCase.execute(userId);
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  };

  getAllPedidos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pedidos = await this.getAllPedidosUseCase.execute();
      res.status(200).json(pedidos);
    } catch (error) {
      next(error);
    }
  };

  eliminarPedido = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      await this.deletePedidoUseCase.execute(String(id), userId);
      res.status(200).json({ message: 'Pedido cancelado y eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  };
}
