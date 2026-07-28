import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SagaPublisherModule } from './saga/saga-publisher.module';
import { SagaConsumerModule } from './saga/saga-consumer.module';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { WorkOrdersModule } from './work-orders/work-orders.module';

@Module({
  imports: [
    PrismaModule,
    SagaPublisherModule,
    SagaConsumerModule,
    AuthModule,
    CustomersModule,
    VehiclesModule,
    WorkOrdersModule,
  ],
})
export class AppModule {}
