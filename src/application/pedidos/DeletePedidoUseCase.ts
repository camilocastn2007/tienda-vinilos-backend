// src/application/pedidos/DeletePedidoUseCase.ts
import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';

export class DeletePedidoUseCase {
  constructor(private readonly pedidoRepository: IPedidoRepository) {}

  async execute(id: string, userId: string): Promise<boolean> {
    if (!id || !userId) {
      throw new Error('ID de pedido y usuario son obligatorios');
    }
    const borrado = await this.pedidoRepository.delete(id, userId);
    if (!borrado) {
      throw new Error('No se encontró el pedido o no tienes permiso para cancelarlo');
    }
    return true;
  }
}
