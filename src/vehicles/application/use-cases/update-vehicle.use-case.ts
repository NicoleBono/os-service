import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { isValidPlate } from '../../../common/validators/plate.validator';
import { UpdateVehicleDto } from '../../dto/update-vehicle.dto';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { FindVehicleByIdUseCase } from './find-vehicle-by-id.use-case';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject(VehicleRepository)
    private readonly repo: VehicleRepository,
    private readonly findVehicleByIdUseCase: FindVehicleByIdUseCase,
  ) {}

  async execute(id: number, dto: UpdateVehicleDto) {
    if (dto.plate && !isValidPlate(dto.plate)) {
      throw new BadRequestException('Placa inválida');
    }

    await this.findVehicleByIdUseCase.execute(id);
    return this.repo.update(id, dto);
  }
}
