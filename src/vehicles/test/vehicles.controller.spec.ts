import { Test, TestingModule } from "@nestjs/testing";
import { CreateVehicleUseCase } from "../application/use-cases/create-vehicle.use-case";
import { DeleteVehicleUseCase } from "../application/use-cases/delete-vehicle.use-case";
import { FindAllVehiclesUseCase } from "../application/use-cases/find-all-vehicles.use-case";
import { FindVehicleByIdUseCase } from "../application/use-cases/find-vehicle-by-id.use-case";
import { UpdateVehicleUseCase } from "../application/use-cases/update-vehicle.use-case";
import { CreateVehicleDto } from "../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../dto/update-vehicle.dto";
import { VehiclesController } from "../infra/controllers/vehicles.controller";

describe("VehiclesController", () => {
  let controller: VehiclesController;
  let createVehicleUseCase: CreateVehicleUseCase;
  let findAllVehiclesUseCase: FindAllVehiclesUseCase;
  let findVehicleByIdUseCase: FindVehicleByIdUseCase;
  let updateVehicleUseCase: UpdateVehicleUseCase;
  let deleteVehicleUseCase: DeleteVehicleUseCase;

  const mockCreateVehicleUseCase = { execute: jest.fn() };
  const mockFindAllVehiclesUseCase = { execute: jest.fn() };
  const mockFindVehicleByIdUseCase = { execute: jest.fn() };
  const mockUpdateVehicleUseCase = { execute: jest.fn() };
  const mockDeleteVehicleUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        { provide: CreateVehicleUseCase, useValue: mockCreateVehicleUseCase },
        {
          provide: FindAllVehiclesUseCase,
          useValue: mockFindAllVehiclesUseCase,
        },
        {
          provide: FindVehicleByIdUseCase,
          useValue: mockFindVehicleByIdUseCase,
        },
        { provide: UpdateVehicleUseCase, useValue: mockUpdateVehicleUseCase },
        { provide: DeleteVehicleUseCase, useValue: mockDeleteVehicleUseCase },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    createVehicleUseCase =
      module.get<CreateVehicleUseCase>(CreateVehicleUseCase);
    findAllVehiclesUseCase = module.get<FindAllVehiclesUseCase>(
      FindAllVehiclesUseCase,
    );
    findVehicleByIdUseCase = module.get<FindVehicleByIdUseCase>(
      FindVehicleByIdUseCase,
    );
    updateVehicleUseCase =
      module.get<UpdateVehicleUseCase>(UpdateVehicleUseCase);
    deleteVehicleUseCase =
      module.get<DeleteVehicleUseCase>(DeleteVehicleUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a vehicle", async () => {
    const dto = {} as CreateVehicleDto;
    const result = { id: 1 };

    mockCreateVehicleUseCase.execute.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(createVehicleUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it("should return all vehicles without customerId", async () => {
    const result = [{ id: 1 }];

    mockFindAllVehiclesUseCase.execute.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(findAllVehiclesUseCase.execute).toHaveBeenCalledWith(undefined);
  });

  it("should return all vehicles filtered by customerId", async () => {
    const result = [{ id: 1 }];

    mockFindAllVehiclesUseCase.execute.mockResolvedValue(result);

    expect(await controller.findAll("2")).toEqual(result);
    expect(findAllVehiclesUseCase.execute).toHaveBeenCalledWith(2);
  });

  it("should find one vehicle by id", async () => {
    const result = { id: 1 };

    mockFindVehicleByIdUseCase.execute.mockResolvedValue(result);

    expect(await controller.findOne("1")).toEqual(result);
    expect(findVehicleByIdUseCase.execute).toHaveBeenCalledWith(1);
  });

  it("should update a vehicle", async () => {
    const dto = {} as UpdateVehicleDto;
    const result = { id: 1 };

    mockUpdateVehicleUseCase.execute.mockResolvedValue(result);

    expect(await controller.update("1", dto)).toEqual(result);
    expect(updateVehicleUseCase.execute).toHaveBeenCalledWith(1, dto);
  });

  it("should remove a vehicle", async () => {
    mockDeleteVehicleUseCase.execute.mockResolvedValue(undefined);

    expect(await controller.remove("1")).toEqual({
      message: "Veículo removido",
    });
    expect(deleteVehicleUseCase.execute).toHaveBeenCalledWith(1);
  });
});
