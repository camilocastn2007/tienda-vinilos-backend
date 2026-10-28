// src/application/discos/CreateDiscoUseCase.ts
import { IDiscoRepository, CreateDiscoData } from '../../domain/repositories/IDiscoRepository';
import { Disco } from '../../domain/entities/Disco';
import { BadRequestError } from '../errors/AppError';

export class CreateDiscoUseCase {
  constructor(private readonly discoRepository: IDiscoRepository) {}

  async execute(data: CreateDiscoData): Promise<Disco> {
    if (!data.artista || data.artista.trim() === '') {
      throw new BadRequestError('El nombre del artista es obligatorio');
    }
    if (!data.titulo || data.titulo.trim() === '') {
      throw new BadRequestError('El título del álbum es obligatorio');
    }
    if (!data.genero || data.genero.trim() === '') {
      throw new BadRequestError('El género es obligatorio');
    }
    if (data.precio === undefined || isNaN(Number(data.precio)) || Number(data.precio) <= 0) {
      throw new BadRequestError('El precio debe ser un número positivo');
    }
    if (!data.imagen || data.imagen.trim() === '') {
      throw new BadRequestError('La URL o ruta de la imagen es obligatoria');
    }

    return this.discoRepository.create(data);
  }
}
