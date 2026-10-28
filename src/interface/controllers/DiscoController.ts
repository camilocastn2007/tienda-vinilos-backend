// src/interface/controllers/DiscoController.ts
import { Request, Response, NextFunction } from 'express';
import { GetDiscosUseCase } from '../../application/discos/GetDiscosUseCase';
import { GetDiscoByIdUseCase } from '../../application/discos/GetDiscoByIdUseCase';
import { CreateDiscoUseCase } from '../../application/discos/CreateDiscoUseCase';
import { UpdateDiscoUseCase } from '../../application/discos/UpdateDiscoUseCase';
import { DeleteDiscoUseCase } from '../../application/discos/DeleteDiscoUseCase';

export class DiscoController {
  constructor(
    private readonly getDiscosUseCase: GetDiscosUseCase,
    private readonly getDiscoByIdUseCase: GetDiscoByIdUseCase,
    private readonly createDiscoUseCase: CreateDiscoUseCase,
    private readonly updateDiscoUseCase: UpdateDiscoUseCase,
    private readonly deleteDiscoUseCase: DeleteDiscoUseCase
  ) {}

  getDiscos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
      const genero = req.query.genero as string | undefined;
      const busqueda = req.query.busqueda as string | undefined;
      const minPrecio = req.query.minPrecio ? parseFloat(req.query.minPrecio as string) : undefined;
      const maxPrecio = req.query.maxPrecio ? parseFloat(req.query.maxPrecio as string) : undefined;

      const result = await this.getDiscosUseCase.execute({
        page,
        limit,
        genero,
        busqueda,
        minPrecio,
        maxPrecio
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getDiscoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const disco = await this.getDiscoByIdUseCase.execute(id);
      res.status(200).json(disco);
    } catch (error) {
      next(error);
    }
  };

  createDisco = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { artista, titulo, genero, precio, imagen, stock } = req.body;
      const disco = await this.createDiscoUseCase.execute({
        artista,
        titulo,
        genero,
        precio,
        imagen,
        stock
      });
      res.status(201).json(disco);
    } catch (error) {
      next(error);
    }
  };

  updateDisco = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const disco = await this.updateDiscoUseCase.execute(id, req.body);
      res.status(200).json(disco);
    } catch (error) {
      next(error);
    }
  };

  deleteDisco = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const disco = await this.deleteDiscoUseCase.execute(id);
      res.status(200).json({ message: 'Disco eliminado exitosamente del catálogo', disco });
    } catch (error) {
      next(error);
    }
  };
}
