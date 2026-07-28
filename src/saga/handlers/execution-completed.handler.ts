import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from './saga-event-handler.interface';
import { SagaEvent, SagaEventType } from '../types/saga-event.types';
import { PrismaService } from '../../prisma/prisma.service';
import { SagaPublisherService } from '../publisher/saga-publisher.service';

@Injectable()
export class ExecutionCompletedHandler implements SagaEventHandler {
  readonly eventType = SagaEventType.EXECUTION_COMPLETED;

  constructor(
    private readonly prisma: PrismaService,
    private readonly sagaPublisher: SagaPublisherService,
  ) {}

  async handle(event: SagaEvent): Promise<void> {
    await this.prisma.workOrder.update({
      where: { id: event.workOrderId },
      data: { status: 'FINALIZADA', finishedAt: new Date() },
    });
    console.log(JSON.stringify({ level: 'info', message: 'work_order_finished', workOrderId: event.workOrderId }));
  }
}
