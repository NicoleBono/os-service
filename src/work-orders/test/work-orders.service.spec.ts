import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { WorkOrdersService } from '../application/work-orders.service';
import { WorkOrderRepository } from '../domain/repositories/work-order.repository';
import { OpenWorkOrderUseCase } from '../application/use-cases/open-work-order.use-case';
import { ListOpenWorkOrdersUseCase } from '../application/use-cases/list-open-work-orders.use-case';
import { GetWorkOrderStatusUseCase } from '../application/use-cases/get-work-order-status.use-case';
import { ApproveBudgetNotificationUseCase } from '../application/use-cases/approve-budget-notification.use-case';
import { UpdateWorkOrderStatusFromEmailUseCase } from '../application/use-cases/update-work-order-status-from-email.use-case';

describe('WorkOrdersService', () => {
  let service: WorkOrdersService;

  const repositoryMock = {
    findDetailedById: jest.fn(),
    startDiagnosis: jest.fn(),
    sendBudget: jest.fn(),
    requestAdditional: jest.fn(),
    finish: jest.fn(),
    deliver: jest.fn(),
    getAverageExecutionTimeMinutes: jest.fn(),
  };

  const openUseCaseMock = { execute: jest.fn() };
  const listUseCaseMock = { execute: jest.fn() };
  const statusUseCaseMock = { execute: jest.fn() };
  const approveUseCaseMock = { execute: jest.fn() };
  const emailUseCaseMock = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkOrdersService,
        { provide: WorkOrderRepository, useValue: repositoryMock },
        { provide: OpenWorkOrderUseCase, useValue: openUseCaseMock },
        { provide: ListOpenWorkOrdersUseCase, useValue: listUseCaseMock },
        { provide: GetWorkOrderStatusUseCase, useValue: statusUseCaseMock },
        { provide: ApproveBudgetNotificationUseCase, useValue: approveUseCaseMock },
        { provide: UpdateWorkOrderStatusFromEmailUseCase, useValue: emailUseCaseMock },
      ],
    }).compile();

    service = module.get<WorkOrdersService>(WorkOrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delegate create to open work order use case', async () => {
    const dto: any = { customerDocument: '123', vehicleId: 1, services: [] };
    openUseCaseMock.execute.mockResolvedValue({ id: 1 });

    await expect(service.create(dto)).resolves.toEqual({ id: 1 });
    expect(openUseCaseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('should delegate active listing to use case', async () => {
    listUseCaseMock.execute.mockResolvedValue([{ id: 1 }]);

    await expect(service.findAll()).resolves.toEqual([{ id: 1 }]);
    expect(listUseCaseMock.execute).toHaveBeenCalled();
  });

  it('should return a work order detail', async () => {
    repositoryMock.findDetailedById.mockResolvedValue({ id: 10 });

    await expect(service.findOne(10)).resolves.toEqual({ id: 10 });
  });

  it('should throw when work order is not found', async () => {
    repositoryMock.findDetailedById.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should delegate status lookup to use case', async () => {
    statusUseCaseMock.execute.mockResolvedValue({ id: 10, status: 'RECEBIDA' });

    await expect(service.findStatus(10)).resolves.toEqual({ id: 10, status: 'RECEBIDA' });
    expect(statusUseCaseMock.execute).toHaveBeenCalledWith(10);
  });

  it('should delegate budget approval notification', async () => {
    approveUseCaseMock.execute.mockResolvedValue({ message: 'ok' });

    await expect(service.approveBudget(10, { approved: true } as any)).resolves.toEqual({ message: 'ok' });
    expect(approveUseCaseMock.execute).toHaveBeenCalledWith(10, { approved: true });
  });

  it('should delegate email status update', async () => {
    emailUseCaseMock.execute.mockResolvedValue({ message: 'updated' });

    await expect(service.updateStatusFromEmail(10, { status: 'EM_EXECUCAO' } as any)).resolves.toEqual({ message: 'updated' });
    expect(emailUseCaseMock.execute).toHaveBeenCalledWith(10, { status: 'EM_EXECUCAO' });
  });
});
