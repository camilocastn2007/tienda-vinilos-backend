// src/infrastructure/repositories/PrismaPedidoRepository.ts
import prisma from '../database/prisma';
import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { Pedido, CrearPedidoDTO } from '../../domain/entities/Pedido';

export class PrismaPedidoRepository implements IPedidoRepository {
  async create(data: CrearPedidoDTO): Promise<Pedido> {
    const nuevoPedido = await prisma.pedido.create({
      data: {
        userId: data.userId,
        discoId: data.discoId,
        cantidad: Math.max(1, Number(data.cantidad) || 1),
        mensaje: data.mensaje ? data.mensaje.trim() : null,
        estado: 'PENDIENTE'
      },
      include: {
        disco: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    return {
      id: nuevoPedido.id,
      userId: nuevoPedido.userId,
      discoId: nuevoPedido.discoId,
      cantidad: nuevoPedido.cantidad,
      mensaje: nuevoPedido.mensaje,
      estado: nuevoPedido.estado,
      createdAt: nuevoPedido.createdAt,
      updatedAt: nuevoPedido.updatedAt,
      disco: nuevoPedido.disco,
      user: {
        ...nuevoPedido.user,
        role: nuevoPedido.user.role as 'admin' | 'user'
      }
    };
  }

  async findByUserId(userId: string): Promise<Pedido[]> {
    const pedidos = await prisma.pedido.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        disco: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    return pedidos.map(p => ({
      id: p.id,
      userId: p.userId,
      discoId: p.discoId,
      cantidad: p.cantidad,
      mensaje: p.mensaje,
      estado: p.estado,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      disco: p.disco,
      user: {
        ...p.user,
        role: p.user.role as 'admin' | 'user'
      }
    }));
  }

  async findAll(): Promise<Pedido[]> {
    const pedidos = await prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        disco: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    return pedidos.map(p => ({
      id: p.id,
      userId: p.userId,
      discoId: p.discoId,
      cantidad: p.cantidad,
      mensaje: p.mensaje,
      estado: p.estado,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      disco: p.disco,
      user: {
        ...p.user,
        role: p.user.role as 'admin' | 'user'
      }
    }));
  }
}
