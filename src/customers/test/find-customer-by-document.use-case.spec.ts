import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindCustomerByDocumentUseCase } from '../application/use-cases/find-customer-by-document.use-case';
import { CustomerRepository } from '../domain/repositories/customer.repository.interface';

describe('FindCustomerByDocumentUseCase', () => {
  let useCase: FindCustomerByDocumentUseCase;
  const mockRepo = { findByDocument: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCustomerByDocumentUseCase,
        { provide: CustomerRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<FindCustomerByDocumentUseCase>(FindCustomerByDocumentUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find customer by document', async () => {
    const result = { id: 1 };
    mockRepo.findByDocument.mockResolvedValue(result);

    await expect(useCase.execute('123')).resolves.toEqual(result);
  });

  it('should throw NotFoundException when customer not found', async () => {
    mockRepo.findByDocument.mockResolvedValue(null);

    await expect(useCase.execute('123')).rejects.toThrow(NotFoundException);
  });
});
