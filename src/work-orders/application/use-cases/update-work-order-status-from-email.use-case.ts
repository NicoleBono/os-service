import { Inject, Injectable } from '@nestjs/common';
import { WorkOrderRepository } from '../../domain/repositories/work-order.repository';
import { UpdateWorkOrderStatusFromEmailDto } from '../../dto/update-work-order-status-from-email.dto';

@Injectable()
export class UpdateWorkOrderStatusFromEmailUseCase {
  constructor(
    @Inject(WorkOrderRepository)
    private readonly repository: WorkOrderRepository,
  ) {}

  execute(id: number, dto: UpdateWorkOrderStatusFromEmailDto) {
    return this.repository.updateStatusFromExternalSource(id, dto.status, 'email', dto.note);
  }
}
