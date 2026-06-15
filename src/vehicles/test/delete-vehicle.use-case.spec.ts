import { Test, TestingModule } from '@nestjs/testing';
import { DeleteVehicleUseCase } from '../application/use-cases/delete-vehicle.use-case';
import { FindVehicleByIdUseCase } from '../application/use-cases/find-vehicle-by-id.use-case';
import { VehicleRepository } from '../domain/repositories/vehicle.repository';

describe('DeleteVehicleUseCase', () => {
  let useCase: DeleteVehicleUseCase;
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
        DeleteVehicleUseCase,
        { provide: VehicleRepository, useValue: mockRepo },
        { provide: FindVehicleByIdUseCase, useValue: mockFindVehicleByIdUseCase },
      ],
    }).compile();

    useCase = module.get<DeleteVehicleUseCase>(DeleteVehicleUseCase);
    repo = module.get<VehicleRepository>(VehicleRepository);
    findVehicleByIdUseCase = module.get<FindVehicleByIdUseCase>(FindVehicleByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a vehicle', async () => {
    mockFindVehicleByIdUseCase.execute.mockResolvedValue({ id: 1 });
    mockRepo.delete.mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(findVehicleByIdUseCase.execute).toHaveBeenCalledWith(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });
});
