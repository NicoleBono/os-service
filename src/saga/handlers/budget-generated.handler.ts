import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from './saga-event-handler.interface';
import { SagaEvent, SagaEventType } from '../types/saga-event.types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BudgetGeneratedHandler implements SagaEventHandler {
  readonly eventType = SagaEventType.BUDGET_GENERATED;

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: SagaEvent): Promise<void> {
    await this.prisma.workOrder.update({
      where: { id: event.workOrderId },
      data: { status: 'AGUARDANDO_APROVACAO', budgetSentAt: new Date() },
    });
    console.log(JSON.stringify({ level: 'info', message: 'work_order_awaiting_approval', workOrderId: event.workOrderId }));
  }
}
