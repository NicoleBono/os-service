import { Test } from '@nestjs/testing';
import { PaymentConfirmedHandler } from '../handlers/payment-confirmed.handler';
import { PrismaService } from '../../prisma/prisma.service';
import { SagaEventType } from '../types/saga-event.types';

const mockPrisma = { workOrder: { update: jest.fn() } };

describe('PaymentConfirmedHandler', () => {
  let handler: PaymentConfirmedHandler;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PaymentConfirmedHandler,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    handler = module.get(PaymentConfirmedHandler);
  });

  it('deve atualizar status para ENTREGUE', async () => {
    mockPrisma.workOrder.update.mockResolvedValue({});
    await handler.handle({ eventType: SagaEventType.PAYMENT_CONFIRMED, workOrderId: 2, payload: {}, occurredAt: new Date().toISOString() });
    expect(mockPrisma.workOrder.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 2 }, data: expect.objectContaining({ status: 'ENTREGUE' }) }),
    );
  });
});
