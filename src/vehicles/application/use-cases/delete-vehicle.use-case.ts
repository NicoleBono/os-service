import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { FindVehicleByIdUseCase } from './find-vehicle-by-id.use-case';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly repo: VehicleRepository,
    private readonly findVehicleByIdUseCase: FindVehicleByIdUseCase,
  ) {}

  async execute(id: number) {
    await this.findVehicleByIdUseCase.execute(id);
    await this.repo.delete(id);
  }
}
