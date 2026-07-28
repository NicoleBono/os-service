import { Inject, Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { ApproveBudgetDto } from '../../dto/approve-budget.dto';
import { SagaPublisherService } from '../../../saga/publisher/saga-publisher.service';
import { SagaEventType } from '../../../saga/types/saga-event.types';

@Injectable()
export class ApproveBudgetNotificationUseCase {
  constructor(
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
    private readonly sagaPublisher: SagaPublisherService,
  ) {}

  async execute(id: number, dto: ApproveBudgetDto) {
    const result = await this.repository.approveBudget(id, dto.approved);

    await this.sagaPublisher.publish(SagaEventType.BUDGET_APPROVAL_DECIDED, id, {
      approved: dto.approved,
    });

    return result;
  }
}
