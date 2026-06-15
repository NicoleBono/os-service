import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { VehiclePrismaRepository } from '../infra/prisma/vehicle.prisma.repository';

jest.mock('../../common/validators/plate.validator', () => ({
  normalizePlate: jest.fn(),
}));

import { normalizePlate } from '../../common/validators/plate.validator';

describe('VehiclePrismaRepository', () => {
  let repo: VehiclePrismaRepository;
  let prisma: PrismaService;

  const mockPrisma = {
    vehicle: {
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
        VehiclePrismaRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repo = module.get<VehiclePrismaRepository>(VehiclePrismaRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create vehicle with normalized plate', async () => {
    (normalizePlate as jest.Mock).mockReturnValue('ABC1234');

    const data = { plate: 'ABC-1234', model: 'Car' } as any;
    const result = { id: 1, plate: 'ABC1234' };

    mockPrisma.vehicle.create.mockResolvedValue(result);

    expect(await repo.create(data)).toEqual(result);
    expect(prisma.vehicle.create).toHaveBeenCalledWith({
      data: { ...data, plate: 'ABC1234' },
    });
  });

  it('should find all vehicles without customerId', async () => {
    const result = [{ id: 1 }];

    mockPrisma.vehicle.findMany.mockResolvedValue(result);

    expect(await repo.findAll()).toEqual(result);
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: { id: 'asc' },
    });
  });

  it('should find all vehicles filtered by customerId', async () => {
    const result = [{ id: 1 }];

    mockPrisma.vehicle.findMany.mockResolvedValue(result);

    expect(await repo.findAll(2)).toEqual(result);
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      where: { customerId: 2 },
      orderBy: { id: 'asc' },
    });
  });

  it('should find vehicle by id', async () => {
    const result = { id: 1 };

    mockPrisma.vehicle.findUnique.mockResolvedValue(result);

    expect(await repo.findById(1)).toEqual(result);
    expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should update vehicle with normalized plate when provided', async () => {
    (normalizePlate as jest.Mock).mockReturnValue('ABC1234');

    const result = { id: 1 };
    mockPrisma.vehicle.update.mockResolvedValue(result);

    expect(await repo.update(1, { plate: 'ABC-1234', model: 'Car' })).toEqual(result);
    expect(prisma.vehicle.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { plate: 'ABC1234', model: 'Car' },
    });
  });

  it('should delete vehicle', async () => {
    mockPrisma.vehicle.delete.mockResolvedValue({ id: 1 });

    await repo.delete(1);

    expect(prisma.vehicle.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
