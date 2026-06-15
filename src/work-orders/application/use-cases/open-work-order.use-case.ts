import { Inject, Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { CreateWorkOrderDto } from '../../dto/create-work-order.dto';

@Injectable()
export class OpenWorkOrderUseCase {
  constructor(
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
  ) {}

  execute(dto: CreateWorkOrderDto) {
    return this.repository.open({
      customer: dto.customer,
      vehicle: dto.vehicle,
      customerDocument: dto.customerDocument,
      vehicleId: dto.vehicleId,
      services: dto.services,
      parts: dto.parts,
    });
  }
}
