import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';

jest.mock('../../common/validators/cpf-cnpj.validator', () => ({
  normalizeDigits: jest.fn(),
}));

import { normalizeDigits } from '../../common/validators/cpf-cnpj.validator';
import { CustomersPrismaRepository } from '../infra/prisma/customers.prisma.repository';

describe('CustomersPrismaRepository', () => {
  let repo: CustomersPrismaRepository;
  let prisma: PrismaService;

  const mockPrisma = {
    customer: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    repo = module.get<CustomersPrismaRepository>(CustomersPrismaRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('should create customer with normalized document', async () => {
    (normalizeDigits as jest.Mock).mockReturnValue('12345678900');

    const data = {
      name: 'John',
      document: '123.456.789-00',
      phone: '999999999',
      email: 'john@test.com',
    };

    const result = { id: 1 };

    mockPrisma.customer.create.mockResolvedValue(result);

    expect(await repo.create(data)).toEqual(result);
    expect(prisma.customer.create).toHaveBeenCalledWith({
      data: { ...data, document: '12345678900' },
    });
  });

  it('should find all customers ordered by id asc', async () => {
    const result = [{ id: 1 }, { id: 2 }];

    mockPrisma.customer.findMany.mockResolvedValue(result);

    expect(await repo.findAll()).toEqual(result);
    expect(prisma.customer.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
    });
  });

  it('should find customer by id', async () => {
    const result = { id: 1 };

    mockPrisma.customer.findUnique.mockResolvedValue(result);

    expect(await repo.findById(1)).toEqual(result);
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should find customer by normalized document', async () => {
    (normalizeDigits as jest.Mock).mockReturnValue('12345678900');

    const result = { id: 1 };

    mockPrisma.customer.findUnique.mockResolvedValue(result);

    expect(await repo.findByDocument('123.456.789-00')).toEqual(result);
    expect(prisma.customer.findUnique).toHaveBeenCalledWith({
      where: { document: '12345678900' },
    });
  });

  it('should update customer with normalized document when provided', async () => {
    (normalizeDigits as jest.Mock).mockReturnValue('12345678900');

    const result = { id: 1 };

    mockPrisma.customer.update.mockResolvedValue(result);

    expect(await repo.update(1, { document: '123.456.789-00', name: 'New' })).toEqual(result);

    expect(prisma.customer.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { document: '12345678900', name: 'New' },
    });
  });

  it('should update customer without normalizing when document is not provided', async () => {
    const result = { id: 1 };

    mockPrisma.customer.update.mockResolvedValue(result);

    expect(await repo.update(1, { name: 'Only Name' })).toEqual(result);

    expect(prisma.customer.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Only Name' },
    });
  });

  it('should delete customer', async () => {
    mockPrisma.customer.delete.mockResolvedValue({ id: 1 });

    await repo.delete(1);
    expect(prisma.customer.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
