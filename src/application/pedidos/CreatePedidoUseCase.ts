// src/application/pedidos/CreatePedidoUseCase.ts
import { IPedidoRepository } from '../../domain/repositories/IPedidoRepository';
import { IDiscoRepository } from '../../domain/repositories/IDiscoRepository';
import { Pedido, CrearPedidoDTO } from '../../domain/entities/Pedido';
import { BadRequestError, NotFoundError } from '../errors/AppError';

export class CreatePedidoUseCase {
  constructor(
    private readonly pedidoRepository: IPedidoRepository,
    private readonly discoRepository: IDiscoRepository
  ) {}

  async execute(dto: CrearPedidoDTO): Promise<Pedido> {
    if (!dto.userId) {
      throw new BadRequestError('El usuario es obligatorio');
    }

    if (!dto.discoId) {
      throw new BadRequestError('Debes seleccionar un disco del catálogo');
    }

    const cantidad = Number(dto.cantidad) || 1;
    if (cantidad < 1) {
      throw new BadRequestError('La cantidad mínima es 1');
    }

    const disco = await this.discoRepository.findById(dto.discoId);
    if (!disco) {
      throw new NotFoundError('El disco seleccionado no existe en el catálogo');
    }

    return this.pedidoRepository.create({
      userId: dto.userId,
      discoId: dto.discoId,
      cantidad,
      mensaje: dto.mensaje
    });
  }
}
