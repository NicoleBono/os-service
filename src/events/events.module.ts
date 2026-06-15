import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { WorkOrderEventsPublisher } from './work-order-events.publisher';
import { WorkOrderEventsConsumer } from './work-order-events.consumer';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: () => ({
        exchanges: [{ name: 'oficina.events', type: 'topic' }],
        uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
    }),
  ],
  providers: [WorkOrderEventsPublisher, WorkOrderEventsConsumer],
  exports: [RabbitMQModule, WorkOrderEventsPublisher],
})
export class EventsModule {}
