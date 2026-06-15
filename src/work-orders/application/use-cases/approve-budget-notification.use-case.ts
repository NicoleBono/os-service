import { Inject, Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { ApproveBudgetDto } from '../../dto/approve-budget.dto';

@Injectable()
export class ApproveBudgetNotificationUseCase {
  constructor(
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
  ) {}

  execute(id: number, dto: ApproveBudgetDto) {
    return this.repository.approveBudget(id, dto.approved);
  }
}
