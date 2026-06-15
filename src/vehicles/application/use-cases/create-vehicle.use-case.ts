import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { CreateVehicleDto } from '../../dto/create-vehicle.dto';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly repo: VehicleRepository,
  ) {}

  async execute(dto: CreateVehicleDto) {
    const vehicle = new Vehicle(dto);
    return this.repo.create(vehicle);
  }
}
