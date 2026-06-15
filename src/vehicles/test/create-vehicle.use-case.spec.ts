import { Test, TestingModule } from '@nestjs/testing';
import { CreateVehicleUseCase } from '../application/use-cases/create-vehicle.use-case';
import { VehicleRepository } from '../domain/repositories/vehicle.repository';
import { ValidationError } from '../../common/errors/domain.errors';

describe('CreateVehicleUseCase', () => {
  let useCase: CreateVehicleUseCase;
  let repo: VehicleRepository;

  const mockRepo = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const validDto = {
    customerId: 1,
    plate: 'ABC1234',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateVehicleUseCase,
        { provide: VehicleRepository, useValue: mockRepo },
      ],
    }).compile();

    useCase = module.get<CreateVehicleUseCase>(CreateVehicleUseCase);
    repo = module.get<VehicleRepository>(VehicleRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar veículo com dados válidos', async () => {
    const result = { id: 1, ...validDto };
    mockRepo.create.mockResolvedValue(result);

    await expect(useCase.execute(validDto)).resolves.toEqual(result);
    expect(repo.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar ValidationError para placa inválida', async () => {
    await expect(
      useCase.execute({ ...validDto, plate: 'INVALIDA' }),
    ).rejects.toThrow(ValidationError);
  });

  it('deve lançar ValidationError para marca muito curta', async () => {
    await expect(
      useCase.execute({ ...validDto, brand: 'X' }),
    ).rejects.toThrow(ValidationError);
  });

  it('deve lançar ValidationError para ano inválido', async () => {
    await expect(
      useCase.execute({ ...validDto, year: 1800 }),
    ).rejects.toThrow(ValidationError);
  });
});
