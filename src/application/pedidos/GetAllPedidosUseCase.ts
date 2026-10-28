// src/application/pedidos/GetAllPedidosUseCase.ts
import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { Pedido } from '../../domain/entities/Pedido';

export class GetAllPedidosUseCase {
  constructor(private readonly pedidoRepository: IPedidoRepository) {}

  async execute(): Promise<Pedido[]> {
    return this.pedidoRepository.findAll();
  }
}
