import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.use-case';
import { VehicleRepository } from '../domain/repositories/vehicle.repository';

describe('FindVehicleByIdUseCase', () => {
  let useCase: FindVehicleByIdUseCase;

  const mockRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindVehicleByIdUseCase,
        { provide: VehicleRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<FindVehicleByIdUseCase>(FindVehicleByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a vehicle when found', async () => {
    const result = { id: 1 };
    mockRepo.findById.mockResolvedValue(result);

    await expect(useCase.execute(1)).resolves.toEqual(result);
  });

  it('should throw NotFoundException when vehicle is not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
