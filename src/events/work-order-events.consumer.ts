import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkOrderEventsConsumer {
  private readonly logger = new Logger(WorkOrderEventsConsumer.name);

  constructor(private readonly prisma: PrismaService) {}

  @RabbitSubscribe({
    exchange: 'oficina.events',
    routingKey: 'budget.approved',
    queue: 'os-service.budget-approved',
  })
  async onBudgetApproved(msg: { workOrderId: number; totalAmount: number }) {
    this.logger.log(`Orçamento aprovado para OS ${msg.workOrderId}`);
    await this.prisma.workOrder.update({
      where: { id: msg.workOrderId },
      data: {
        status: 'APROVADA',
        totalAmount: msg.totalAmount,
        approvedAt: new Date(),
      },
    });
  }

  @RabbitSubscribe({
    exchange: 'oficina.events',
    routingKey: 'budget.rejected',
    queue: 'os-service.budget-rejected',
  })
  async onBudgetRejected(msg: { workOrderId: number }) {
    this.logger.log(`Orçamento rejeitado para OS ${msg.workOrderId}`);
    await this.prisma.workOrder.update({
      where: { id: msg.workOrderId },
      data: { status: 'CANCELADA', cancelledAt: new Date() },
    });
  }

  @RabbitSubscribe({
    exchange: 'oficina.events',
    routingKey: 'execution.started',
    queue: 'os-service.execution-started',
  })
  async onExecutionStarted(msg: { workOrderId: number }) {
    this.logger.log(`Execução iniciada para OS ${msg.workOrderId}`);
    await this.prisma.workOrder.update({
      where: { id: msg.workOrderId },
      data: { status: 'EM_EXECUCAO', startedExecutionAt: new Date() },
    });
  }

  @RabbitSubscribe({
    exchange: 'oficina.events',
    routingKey: 'execution.finished',
    queue: 'os-service.execution-finished',
  })
  async onExecutionFinished(msg: { workOrderId: number }) {
    this.logger.log(`Execução finalizada para OS ${msg.workOrderId}`);
    await this.prisma.workOrder.update({
      where: { id: msg.workOrderId },
      data: { status: 'FINALIZADA', finishedAt: new Date() },
    });
  }

  @RabbitSubscribe({
    exchange: 'oficina.events',
    routingKey: 'payment.confirmed',
    queue: 'os-service.payment-confirmed',
  })
  async onPaymentConfirmed(msg: { workOrderId: number }) {
    this.logger.log(`Pagamento confirmado para OS ${msg.workOrderId}`);
    await this.prisma.workOrder.update({
      where: { id: msg.workOrderId },
      data: { status: 'ENTREGUE', deliveredAt: new Date() },
    });
  }
}
