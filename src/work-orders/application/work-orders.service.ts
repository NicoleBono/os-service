import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WorkOrderRepository } from '../domain/repositories/work-order.repository';
import { CreateWorkOrderDto } from '../dto/create-work-order.dto';
import { SendBudgetDto } from '../dto/send-budget.dto';
import { ApproveBudgetDto } from '../dto/approve-budget.dto';
import { RequestAdditionalDto } from '../dto/request-additional.dto';
import { OpenWorkOrderUseCase } from './use-cases/open-work-order.use-case';
import { ListOpenWorkOrdersUseCase } from './use-cases/list-open-work-orders.use-case';
import { GetWorkOrderStatusUseCase } from './use-cases/get-work-order-status.use-case';
import { ApproveBudgetNotificationUseCase } from './use-cases/approve-budget-notification.use-case';
import { UpdateWorkOrderStatusFromEmailUseCase } from './use-cases/update-work-order-status-from-email.use-case';
import { UpdateWorkOrderStatusFromEmailDto } from '../dto/update-work-order-status-from-email.dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    private readonly openWorkOrderUseCase: OpenWorkOrderUseCase,
    private readonly listOpenWorkOrdersUseCase: ListOpenWorkOrdersUseCase,
    private readonly getWorkOrderStatusUseCase: GetWorkOrderStatusUseCase,
    private readonly approveBudgetNotificationUseCase: ApproveBudgetNotificationUseCase,
    private readonly updateWorkOrderStatusFromEmailUseCase: UpdateWorkOrderStatusFromEmailUseCase,
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
  ) {}

  create(dto: CreateWorkOrderDto) {
    return this.openWorkOrderUseCase.execute(dto);
  }

  findAll() {
    return this.listOpenWorkOrdersUseCase.execute();
  }

  async findOne(id: number) {
    const workOrder = await this.repository.findDetailedById(id);
    if (!workOrder) throw new NotFoundException('OS não encontrada');
    return workOrder;
  }

  findStatus(id: number) {
    return this.getWorkOrderStatusUseCase.execute(id);
  }

  startDiagnosis(id: number) {
    return this.repository.startDiagnosis(id);
  }

  sendBudget(id: number, _dto: SendBudgetDto) {
    return this.repository.sendBudget(id);
  }

  approveBudget(id: number, dto: ApproveBudgetDto) {
    return this.approveBudgetNotificationUseCase.execute(id, dto);
  }

  requestAdditional(id: number, dto: RequestAdditionalDto) {
    return this.repository.requestAdditional(id, dto);
  }

  finish(id: number) {
    return this.repository.finish(id);
  }

  deliver(id: number) {
    return this.repository.deliver(id);
  }

  getAverageExecutionTimeMinutes() {
    return this.repository.getAverageExecutionTimeMinutes();
  }

  updateStatusFromEmail(id: number, dto: UpdateWorkOrderStatusFromEmailDto) {
    return this.updateWorkOrderStatusFromEmailUseCase.execute(id, dto);
  }
}
