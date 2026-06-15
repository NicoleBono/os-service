import { Module } from "@nestjs/common";
import { WorkOrdersService } from "./application/work-orders.service";
import { PrismaWorkOrderRepository } from "./infra/repositories/prisma-work-order.repository";
import { WorkOrderRepository } from "./domain/repositories/work-order.repository";
import { OpenWorkOrderUseCase } from "./application/use-cases/open-work-order.use-case";
import { ListOpenWorkOrdersUseCase } from "./application/use-cases/list-open-work-orders.use-case";
import { GetWorkOrderStatusUseCase } from "./application/use-cases/get-work-order-status.use-case";
import { ApproveBudgetNotificationUseCase } from "./application/use-cases/approve-budget-notification.use-case";
import { UpdateWorkOrderStatusFromEmailUseCase } from "./application/use-cases/update-work-order-status-from-email.use-case";
import { WorkOrdersController } from "./infra/controllers/work-orders.controller";

@Module({
  controllers: [WorkOrdersController],
  providers: [
    WorkOrdersService,
    OpenWorkOrderUseCase,
    ListOpenWorkOrdersUseCase,
    GetWorkOrderStatusUseCase,
    ApproveBudgetNotificationUseCase,
    UpdateWorkOrderStatusFromEmailUseCase,
    PrismaWorkOrderRepository,
    {
      provide: WorkOrderRepository,
      useExisting: PrismaWorkOrderRepository,
    },
  ],
})
export class WorkOrdersModule {}
