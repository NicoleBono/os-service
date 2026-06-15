import { Inject, Injectable } from '@nestjs/common';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';

@Injectable()
export class FindAllVehiclesUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly repo: VehicleRepository,
  ) {}

  execute(customerId?: number) {
    return this.repo.findAll(customerId);
  }
}
