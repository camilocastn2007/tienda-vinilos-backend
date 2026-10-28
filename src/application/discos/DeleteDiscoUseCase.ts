// src/application/discos/DeleteDiscoUseCase.ts
import { IDiscoRepository } from '../../domain/repositories/IDiscoRepository';
import { Disco } from '../../domain/entities/Disco';
import { NotFoundError } from '../errors/AppError';

export class DeleteDiscoUseCase {
  constructor(private readonly discoRepository: IDiscoRepository) {}

  async execute(id: string): Promise<Disco> {
    const existing = await this.discoRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`No se encontró el disco con id: ${id}`);
    }

    return this.discoRepository.delete(id);
  }
}
