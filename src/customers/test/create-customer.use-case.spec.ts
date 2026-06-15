import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case';
import { CustomerRepository } from '../domain/repositories/customer.repository.interface';
import { ValidationError } from '../../common/errors/domain.errors';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let repo: CustomerRepository;

  const mockRepo = { create: jest.fn() };

  const validDto = {
    name: 'João Silva',
    document: '529.982.247-25',
    phone: '11999999999',
    email: 'joao@email.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCustomerUseCase,
        { provide: CustomerRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
    repo = module.get<CustomerRepository>(CustomerRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar cliente com dados válidos', async () => {
    const result = { id: 1, ...validDto };
    mockRepo.create.mockResolvedValue(result);

    await expect(useCase.execute(validDto)).resolves.toEqual(result);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar ValidationError para documento inválido', async () => {
    await expect(
      useCase.execute({ ...validDto, document: '000.000.000-00' }),
    ).rejects.toThrow(ValidationError);
  });

  it('deve lançar ValidationError para nome muito curto', async () => {
    await expect(
      useCase.execute({ ...validDto, name: 'A' }),
    ).rejects.toThrow(ValidationError);
  });

  it('deve lançar ValidationError para e-mail inválido', async () => {
    await expect(
      useCase.execute({ ...validDto, email: 'invalido' }),
    ).rejects.toThrow(ValidationError);
  });
});
