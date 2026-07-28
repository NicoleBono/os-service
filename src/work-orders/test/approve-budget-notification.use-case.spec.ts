import { Test } from '@nestjs/testing';
import { ApproveBudgetNotificationUseCase } from '../application/use-cases/approve-budget-notification.use-case';
import { WorkOrderRepository } from '../domain/repositories/work-order.repository';
import { SagaPublisherService } from '../../saga/publisher/saga-publisher.service';
import { SagaEventType } from '../../saga/types/saga-event.types';

const mockRepository = { approveBudget: jest.fn() };
const mockSagaPublisher = { publish: jest.fn() };

describe('ApproveBudgetNotificationUseCase', () => {
  let useCase: ApproveBudgetNotificationUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ApproveBudgetNotificationUseCase,
        { provide: WorkOrderRepository, useValue: mockRepository },
        { provide: SagaPublisherService, useValue: mockSagaPublisher },
      ],
    }).compile();
    useCase = module.get(ApproveBudgetNotificationUseCase);
  });

  it('deve aprovar orçamento e publicar BUDGET_APPROVAL_DECIDED approved=true', async () => {
    mockRepository.approveBudget.mockResolvedValue({ id: 1, status: 'APROVADA' });
    mockSagaPublisher.publish.mockResolvedValue(undefined);

    const result = await useCase.execute(1, { approved: true });

    expect(result.status).toBe('APROVADA');
    expect(mockSagaPublisher.publish).toHaveBeenCalledWith(
      SagaEventType.BUDGET_APPROVAL_DECIDED, 1, { approved: true },
    );
  });

  it('deve rejeitar orçamento e publicar BUDGET_APPROVAL_DECIDED approved=false', async () => {
    mockRepository.approveBudget.mockResolvedValue({ id: 1, status: 'CANCELADA' });
    mockSagaPublisher.publish.mockResolvedValue(undefined);

    await useCase.execute(1, { approved: false });

    expect(mockSagaPublisher.publish).toHaveBeenCalledWith(
      SagaEventType.BUDGET_APPROVAL_DECIDED, 1, { approved: false },
    );
  });
});
