import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case';
import { CustomerRepository } from '../domain/repositories/customer.repository.interface';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

jest.mock('../../common/validators/cpf-cnpj.validator', () => ({
  isValidCpfCnpj: jest.fn(),
}));

import { isValidCpfCnpj } from '../../common/validators/cpf-cnpj.validator';

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase;
  const mockRepo = { findById: jest.fn(), update: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCustomerUseCase,
        { provide: CustomerRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<UpdateCustomerUseCase>(UpdateCustomerUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update customer when document is valid', async () => {
    (isValidCpfCnpj as jest.Mock).mockReturnValue(true);

    const dto = { document: '123' } as UpdateCustomerDto;
    const result = { id: 1 };

    mockRepo.findById.mockResolvedValue({ id: 1 });
    mockRepo.update.mockResolvedValue(result);

    await expect(useCase.execute(1, dto)).resolves.toEqual(result);
  });

  it('should throw BadRequestException on update with invalid document', async () => {
    (isValidCpfCnpj as jest.Mock).mockReturnValue(false);

    const dto = { document: 'invalid' } as UpdateCustomerDto;

    await expect(useCase.execute(1, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when customer not found', async () => {
    (isValidCpfCnpj as jest.Mock).mockReturnValue(true);
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, { document: '123' })).rejects.toThrow(NotFoundException);
  });
});
