// src/application/discos/GetDiscoByIdUseCase.ts
import { IDiscoRepository } from '../../domain/repositories/IDiscoRepository';
import { Disco } from '../../domain/entities/Disco';
import { NotFoundError } from '../errors/AppError';

export class GetDiscoByIdUseCase {
  constructor(private readonly discoRepository: IDiscoRepository) {}

  async execute(id: string): Promise<Disco> {
    const disco = await this.discoRepository.findById(id);
    if (!disco) {
      throw new NotFoundError(`No se encontró el disco con id: ${id}`);
    }
    return disco;
  }
}
