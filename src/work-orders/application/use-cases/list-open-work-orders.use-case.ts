import { Inject, Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';

@Injectable()
export class ListOpenWorkOrdersUseCase {
  constructor(
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
  ) {}

  execute() {
    return this.repository.findAllActiveOrdered();
  }
}
