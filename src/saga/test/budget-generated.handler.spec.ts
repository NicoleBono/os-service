import { Test } from '@nestjs/testing';
import { BudgetGeneratedHandler } from '../handlers/budget-generated.handler';
import { PrismaService } from '../../prisma/prisma.service';
import { SagaEventType } from '../types/saga-event.types';

const mockPrisma = { workOrder: { update: jest.fn() } };

describe('BudgetGeneratedHandler', () => {
  let handler: BudgetGeneratedHandler;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        BudgetGeneratedHandler,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    handler = module.get(BudgetGeneratedHandler);
  });

  it('deve atualizar status para AGUARDANDO_APROVACAO', async () => {
    mockPrisma.workOrder.update.mockResolvedValue({});
    await handler.handle({ eventType: SagaEventType.BUDGET_GENERATED, workOrderId: 1, payload: {}, occurredAt: new Date().toISOString() });
    expect(mockPrisma.workOrder.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 1 }, data: expect.objectContaining({ status: 'AGUARDANDO_APROVACAO' }) }),
    );
  });
});
