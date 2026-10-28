// src/domain/entities/Pedido.ts
import { SafeUser } from './User';
import { Disco } from './Disco';

export type EstadoPedido = 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO';

export interface Pedido {
  id: string;
  userId: string;
  discoId: string;
  cantidad: number;
  mensaje?: string | null;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  user?: SafeUser;
  disco?: Disco;
}

export interface CrearPedidoDTO {
  userId: string;
  discoId: string;
  cantidad: number;
  mensaje?: string;
}
