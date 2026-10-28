// src/domain/repositories/IPedidoRepository.ts
import { Pedido, CrearPedidoDTO } from '../entities/Pedido';

export interface IPedidoRepository {
  create(data: CrearPedidoDTO): Promise<Pedido>;
  findByUserId(userId: string): Promise<Pedido[]>;
  findAll(): Promise<Pedido[]>;
}
