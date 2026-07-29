import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SagaConsumerService } from './consumer/saga-consumer.service';
import { SAGA_EVENT_HANDLER } from './handlers/saga-event-handler.interface';
import { BudgetGeneratedHandler } from './handlers/budget-generated.handler';
import { PaymentConfirmedHandler } from './handlers/payment-confirmed.handler';
import { PaymentFailedHandler } from './handlers/payment-failed.handler';
import { ExecutionCompletedHandler } from './handlers/execution-completed.handler';
import { SagaPublisherModule } from './saga-publisher.module';

@Module({
  imports: [PrismaModule, SagaPublisherModule],
  providers: [
    BudgetGeneratedHandler,
    PaymentConfirmedHandler,
    PaymentFailedHandler,
    ExecutionCompletedHandler,
    {
      provide: SAGA_EVENT_HANDLER,
      useFactory: (h1: BudgetGeneratedHandler, h2: PaymentConfirmedHandler, h3: PaymentFailedHandler, h4: ExecutionCompletedHandler) => [h1, h2, h3, h4],
      inject: [BudgetGeneratedHandler, PaymentConfirmedHandler, PaymentFailedHandler, ExecutionCompletedHandler],
    },
    SagaConsumerService,
  ],
})
export class SagaConsumerModule {}
