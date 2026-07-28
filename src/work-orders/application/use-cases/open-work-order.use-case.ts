import { Inject, Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { CreateWorkOrderDto } from '../../dto/create-work-order.dto';
import { SagaPublisherService } from '../../../saga/publisher/saga-publisher.service';
import { SagaEventType } from '../../../saga/types/saga-event.types';

@Injectable()
export class OpenWorkOrderUseCase {
  constructor(
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
    private readonly sagaPublisher: SagaPublisherService,
  ) {}

  async execute(dto: CreateWorkOrderDto) {
    const workOrder = await this.repository.open({
      customer: dto.customer,
      vehicle: dto.vehicle,
      customerDocument: dto.customerDocument,
      vehicleId: dto.vehicleId,
      services: dto.services,
      parts: dto.parts,
    });

    await this.sagaPublisher.publish(SagaEventType.OS_CREATED, workOrder.id, {
      customer: dto.customer,
      totalAmount: 0,
      services: dto.services ?? [],
      parts: dto.parts ?? [],
    });

    return workOrder;
  }
}
