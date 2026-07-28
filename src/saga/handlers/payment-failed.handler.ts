import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from './saga-event-handler.interface';
import { SagaEvent, SagaEventType } from '../types/saga-event.types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentFailedHandler implements SagaEventHandler {
  readonly eventType = SagaEventType.PAYMENT_FAILED;

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: SagaEvent): Promise<void> {
    await this.prisma.workOrder.update({
      where: { id: event.workOrderId },
      data: { status: 'CANCELADA', cancelledAt: new Date() },
    });
    console.log(JSON.stringify({ level: 'info', message: 'work_order_cancelled_payment_failed', workOrderId: event.workOrderId }));
  }
}
