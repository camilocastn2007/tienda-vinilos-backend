// src/application/discos/GetDiscosUseCase.ts
import { IDiscoRepository } from '../../domain/repositories/IDiscoRepository';
import { Disco, PaginatedResult, DiscoFilters } from '../../domain/entities/Disco';

export class GetDiscosUseCase {
  constructor(private readonly discoRepository: IDiscoRepository) {}

  async execute(filters: DiscoFilters): Promise<PaginatedResult<Disco>> {
    return this.discoRepository.findMany(filters);
  }
}
