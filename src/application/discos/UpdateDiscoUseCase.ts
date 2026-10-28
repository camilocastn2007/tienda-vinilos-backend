// src/application/discos/UpdateDiscoUseCase.ts
import { IDiscoRepository, UpdateDiscoData } from '../../domain/repositories/IDiscoRepository';
import { Disco } from '../../domain/entities/Disco';
import { BadRequestError, NotFoundError } from '../errors/AppError';

export class UpdateDiscoUseCase {
  constructor(private readonly discoRepository: IDiscoRepository) {}

  async execute(id: string, data: UpdateDiscoData): Promise<Disco> {
    const existing = await this.discoRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`No se encontró el disco con id: ${id}`);
    }

    if (data.precio !== undefined && (isNaN(Number(data.precio)) || Number(data.precio) <= 0)) {
      throw new BadRequestError('El precio debe ser un número positivo');
    }

    return this.discoRepository.update(id, data);
  }
}
