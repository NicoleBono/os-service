import { Injectable } from '@nestjs/common';
import { SagaEventHandler } from './saga-event-handler.interface';
import { SagaEvent, SagaEventType } from '../types/saga-event.types';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentConfirmedHandler implements SagaEventHandler {
  readonly eventType = SagaEventType.PAYMENT_CONFIRMED;

  constructor(private readonly prisma: PrismaService) {}

  async handle(event: SagaEvent): Promise<void> {
    await this.prisma.workOrder.update({
      where: { id: event.workOrderId },
      data: { status: 'ENTREGUE', deliveredAt: new Date() },
    });
    console.log(JSON.stringify({ level: 'info', message: 'work_order_delivered', workOrderId: event.workOrderId }));
  }
}
