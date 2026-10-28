// src/infrastructure/repositories/PrismaDiscoRepository.ts
import prisma from '../database/prisma';
import { IDiscoRepository, CreateDiscoData, UpdateDiscoData } from '../../domain/repositories/IDiscoRepository';
import { Disco, PaginatedResult, DiscoFilters } from '../../domain/entities/Disco';
import { Prisma } from '@prisma/client';

export class PrismaDiscoRepository implements IDiscoRepository {
  async findMany(filters: DiscoFilters): Promise<PaginatedResult<Disco>> {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(50, Number(filters.limit) || 8));
    const skip = (page - 1) * limit;

    const where: Prisma.DiscoWhereInput = {};

    if (filters.genero && filters.genero !== 'todos') {
      where.genero = {
        equals: filters.genero,
        mode: 'insensitive'
      };
    }

    if (filters.busqueda && filters.busqueda.trim() !== '') {
      const term = filters.busqueda.trim();
      where.OR = [
        { artista: { contains: term, mode: 'insensitive' } },
        { titulo: { contains: term, mode: 'insensitive' } }
      ];
    }

    if (filters.minPrecio !== undefined || filters.maxPrecio !== undefined) {
      where.precio = {};
      if (filters.minPrecio !== undefined && !isNaN(Number(filters.minPrecio))) {
        where.precio.gte = Number(filters.minPrecio);
      }
      if (filters.maxPrecio !== undefined && !isNaN(Number(filters.maxPrecio))) {
        where.precio.lte = Number(filters.maxPrecio);
      }
    }

    const [total, data] = await Promise.all([
      prisma.disco.count({ where }),
      prisma.disco.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      data
    };
  }

  async findById(id: string): Promise<Disco | null> {
    return prisma.disco.findUnique({
      where: { id }
    });
  }

  async create(data: CreateDiscoData): Promise<Disco> {
    return prisma.disco.create({
      data: {
        artista: data.artista.trim(),
        titulo: data.titulo.trim(),
        genero: data.genero.trim(),
        precio: Number(data.precio),
        imagen: data.imagen.trim(),
        stock: data.stock !== undefined ? Number(data.stock) : 10
      }
    });
  }

  async update(id: string, data: UpdateDiscoData): Promise<Disco> {
    const updateData: Prisma.DiscoUpdateInput = {};
    if (data.artista !== undefined) updateData.artista = data.artista.trim();
    if (data.titulo !== undefined) updateData.titulo = data.titulo.trim();
    if (data.genero !== undefined) updateData.genero = data.genero.trim();
    if (data.precio !== undefined) updateData.precio = Number(data.precio);
    if (data.imagen !== undefined) updateData.imagen = data.imagen.trim();
    if (data.stock !== undefined) updateData.stock = Number(data.stock);

    return prisma.disco.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string): Promise<Disco> {
    return prisma.disco.delete({
      where: { id }
    });
  }
}
