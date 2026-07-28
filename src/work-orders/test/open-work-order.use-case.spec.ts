import { Test } from '@nestjs/testing';
import { OpenWorkOrderUseCase } from '../application/use-cases/open-work-order.use-case';
import { WorkOrderRepository } from '../domain/repositories/work-order.repository';
import { SagaPublisherService } from '../../saga/publisher/saga-publisher.service';
import { SagaEventType } from '../../saga/types/saga-event.types';

const mockRepository = { open: jest.fn() };
const mockSagaPublisher = { publish: jest.fn() };

describe('OpenWorkOrderUseCase', () => {
  let useCase: OpenWorkOrderUseCase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        OpenWorkOrderUseCase,
        { provide: WorkOrderRepository, useValue: mockRepository },
        { provide: SagaPublisherService, useValue: mockSagaPublisher },
      ],
    }).compile();
    useCase = module.get(OpenWorkOrderUseCase);
  });

  it('deve criar OS e publicar OS_CREATED', async () => {
    const workOrder = { id: 1, status: 'RECEBIDA' };
    mockRepository.open.mockResolvedValue(workOrder);
    mockSagaPublisher.publish.mockResolvedValue(undefined);

    const dto = {
      customer: { name: 'João', document: '529.982.247-25', email: 'joao@email.com', phone: '11999999999' },
      vehicleId: 1,
      services: [{ serviceId: 1, quantity: 1 }],
      parts: [],
    } as any;

    const result = await useCase.execute(dto);

    expect(result).toEqual(workOrder);
    expect(mockRepository.open).toHaveBeenCalledTimes(1);
    expect(mockSagaPublisher.publish).toHaveBeenCalledWith(
      SagaEventType.OS_CREATED,
      1,
      expect.objectContaining({ services: dto.services }),
    );
  });

  it('deve lançar erro se repository falhar', async () => {
    mockRepository.open.mockRejectedValue(new Error('DB error'));
    await expect(useCase.execute({} as any)).rejects.toThrow('DB error');
    expect(mockSagaPublisher.publish).not.toHaveBeenCalled();
  });
});
