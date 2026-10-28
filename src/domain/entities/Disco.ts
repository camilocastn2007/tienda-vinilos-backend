// src/domain/entities/Disco.ts

export interface Disco {
  id: string;
  artista: string;
  titulo: string;
  genero: string;
  precio: number;
  imagen: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  pagination: PaginationMeta;
  data: T[];
}

export interface DiscoFilters {
  genero?: string;
  busqueda?: string;
  minPrecio?: number;
  maxPrecio?: number;
  page?: number;
  limit?: number;
}
