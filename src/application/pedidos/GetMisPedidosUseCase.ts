// src/application/pedidos/GetMisPedidosUseCase.ts
import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { Pedido } from '../../domain/entities/Pedido';
import { BadRequestError } from '../errors/AppError';

export class GetMisPedidosUseCase {
  constructor(private readonly pedidoRepository: IPedidoRepository) {}

  async execute(userId: string): Promise<Pedido[]> {
    if (!userId) {
      throw new BadRequestError('El id del usuario es requerido');
    }
    return this.pedidoRepository.findByUserId(userId);
  }
}
