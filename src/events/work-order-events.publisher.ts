import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class WorkOrderEventsPublisher {
  constructor(private readonly amqp: AmqpConnection) {}

  async publishOsCreated(payload: { workOrderId: number; customerId: number; vehicleId: number; description?: string }) {
    await this.amqp.publish('oficina.events', 'os.created', payload);
  }

  async publishOsCancelled(payload: { workOrderId: number; reason: string }) {
    await this.amqp.publish('oficina.events', 'os.cancelled', payload);
  }

  async publishDiagnosisStarted(payload: { workOrderId: number }) {
    await this.amqp.publish('oficina.events', 'os.diagnosis_started', payload);
  }
}
