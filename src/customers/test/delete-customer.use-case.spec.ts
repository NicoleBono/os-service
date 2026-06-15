import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteCustomerUseCase } from '../application/use-cases/delete-customer.use-case';
import { CustomerRepository } from '../domain/repositories/customer.repository.interface';

describe('DeleteCustomerUseCase', () => {
  let useCase: DeleteCustomerUseCase;
  const mockRepo = { findById: jest.fn(), delete: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCustomerUseCase,
        { provide: CustomerRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<DeleteCustomerUseCase>(DeleteCustomerUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should remove customer', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    mockRepo.delete.mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException on remove when customer not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
