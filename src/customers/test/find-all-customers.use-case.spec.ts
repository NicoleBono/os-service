import { Test, TestingModule } from '@nestjs/testing';
import { FindAllCustomersUseCase } from '../application/use-cases/find-all-customers.use-case';
import { CustomerRepository } from '../domain/repositories/customer.repository.interface';

describe('FindAllCustomersUseCase', () => {
  let useCase: FindAllCustomersUseCase;
  const mockRepo = { findAll: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllCustomersUseCase,
        { provide: CustomerRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<FindAllCustomersUseCase>(FindAllCustomersUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return all customers', async () => {
    const result = [{ id: 1 }];
    mockRepo.findAll.mockResolvedValue(result);

    await expect(useCase.execute()).resolves.toEqual(result);
  });
});
