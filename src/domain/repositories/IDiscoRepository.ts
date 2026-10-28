// src/domain/repositories/IDiscoRepository.ts
import { Disco, PaginatedResult, DiscoFilters } from '../entities/Disco';

export interface CreateDiscoData {
  artista: string;
  titulo: string;
  genero: string;
  precio: number;
  imagen: string;
  stock?: number;
}

export interface UpdateDiscoData {
  artista?: string;
  titulo?: string;
  genero?: string;
  precio?: number;
  imagen?: string;
  stock?: number;
}

export interface IDiscoRepository {
  findMany(filters: DiscoFilters): Promise<PaginatedResult<Disco>>;
  findById(id: string): Promise<Disco | null>;
  create(data: CreateDiscoData): Promise<Disco>;
  update(id: string, data: UpdateDiscoData): Promise<Disco>;
  delete(id: string): Promise<Disco>;
}
