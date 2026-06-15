import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UpdateVehicleUseCase } from '../application/use-cases/update-vehicle.use-case';
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.use-case';
import { VehicleRepository } from '../domain/repositories/vehicle.repository';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

jest.mock('../../common/validators/plate.validator', () => ({
  isValidPlate: jest.fn(),
}));

import { isValidPlate } from '../../common/validators/plate.validator';

describe('UpdateVehicleUseCase', () => {
  let useCase: UpdateVehicleUseCase;
  let repo: VehicleRepository;
  let findVehicleByIdUseCase: FindVehicleByIdUseCase;

  const mockRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockFindVehicleByIdUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateVehicleUseCase,
        { provide: VehicleRepository, useValue: mockRepo },
        { provide: FindVehicleByIdUseCase, useValue: mockFindVehicleByIdUseCase },
      ],
    }).compile();

    useCase = module.get<UpdateVehicleUseCase>(UpdateVehicleUseCase);
    repo = module.get<VehicleRepository>(VehicleRepository);
    findVehicleByIdUseCase = module.get<FindVehicleByIdUseCase>(FindVehicleByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update vehicle when plate is valid', async () => {
    (isValidPlate as jest.Mock).mockReturnValue(true);

    const dto = { plate: 'ABC1234' } as UpdateVehicleDto;
    const result = { id: 1 };

    mockFindVehicleByIdUseCase.execute.mockResolvedValue({ id: 1 });
    mockRepo.update.mockResolvedValue(result);

    expect(await useCase.execute(1, dto)).toEqual(result);
    expect(findVehicleByIdUseCase.execute).toHaveBeenCalledWith(1);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
  });

  it('should throw BadRequestException when plate is invalid', async () => {
    (isValidPlate as jest.Mock).mockReturnValue(false);

    const dto = { plate: 'INVALID' } as UpdateVehicleDto;

    await expect(useCase.execute(1, dto)).rejects.toThrow(BadRequestException);
  });
});
