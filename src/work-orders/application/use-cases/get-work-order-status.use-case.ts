import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';

@Injectable()
export class GetWorkOrderStatusUseCase {
  constructor(
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
  ) {}

  async execute(id: number) {
    const workOrder = await this.repository.findStatusById(id);
    if (!workOrder) throw new NotFoundException('OS não encontrada');
    return workOrder;
  }
}
