import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindCustomerByIdUseCase } from '../application/use-cases/find-customer-by-id.use-case';
import { CustomerRepository } from '../domain/repositories/customer.repository.interface';

describe('FindCustomerByIdUseCase', () => {
  let useCase: FindCustomerByIdUseCase;
  const mockRepo = { findById: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCustomerByIdUseCase,
        { provide: CustomerRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<FindCustomerByIdUseCase>(FindCustomerByIdUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one customer by id', async () => {
    const result = { id: 1 };
    mockRepo.findById.mockResolvedValue(result);

    await expect(useCase.execute(1)).resolves.toEqual(result);
  });

  it('should throw NotFoundException when customer not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
