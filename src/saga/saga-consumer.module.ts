import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SagaConsumerService } from './consumer/saga-consumer.service';
import { SAGA_EVENT_HANDLER } from './handlers/saga-event-handler.interface';
import { BudgetGeneratedHandler } from './handlers/budget-generated.handler';
import { PaymentConfirmedHandler } from './handlers/payment-confirmed.handler';
import { PaymentFailedHandler } from './handlers/payment-failed.handler';
import { ExecutionCompletedHandler } from './handlers/execution-completed.handler';
import { SagaPublisherModule } from './saga-publisher.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlers: any[] = [
  { provide: SAGA_EVENT_HANDLER, useClass: BudgetGeneratedHandler, multi: true },
  { provide: SAGA_EVENT_HANDLER, useClass: PaymentConfirmedHandler, multi: true },
  { provide: SAGA_EVENT_HANDLER, useClass: PaymentFailedHandler, multi: true },
  { provide: SAGA_EVENT_HANDLER, useClass: ExecutionCompletedHandler, multi: true },
];

@Module({
  imports: [PrismaModule, SagaPublisherModule],
  providers: [SagaConsumerService, ...handlers],
})
export class SagaConsumerModule {}
