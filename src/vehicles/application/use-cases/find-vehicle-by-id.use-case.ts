import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';

@Injectable()
export class FindVehicleByIdUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly repo: VehicleRepository,
  ) {}

  async execute(id: number) {
    const vehicle = await this.repo.findById(id);

    if (!vehicle) {
      throw new NotFoundException('Veículo não encontrado');
    }

    return vehicle;
  }
}
