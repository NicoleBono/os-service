import { Test } from '@nestjs/testing';
import { PaymentFailedHandler } from '../handlers/payment-failed.handler';
import { PrismaService } from '../../prisma/prisma.service';
import { SagaEventType } from '../types/saga-event.types';

const mockPrisma = { workOrder: { update: jest.fn() } };

describe('PaymentFailedHandler', () => {
  let handler: PaymentFailedHandler;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PaymentFailedHandler,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    handler = module.get(PaymentFailedHandler);
  });

  it('deve atualizar status para CANCELADA', async () => {
    mockPrisma.workOrder.update.mockResolvedValue({});
    await handler.handle({ eventType: SagaEventType.PAYMENT_FAILED, workOrderId: 3, payload: {}, occurredAt: new Date().toISOString() });
    expect(mockPrisma.workOrder.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 }, data: expect.objectContaining({ status: 'CANCELADA' }) }),
    );
  });
});
