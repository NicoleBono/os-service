import { Test, TestingModule } from "@nestjs/testing";
import { WorkOrdersService } from "../application/work-orders.service";
import { CreateWorkOrderDto } from "../dto/create-work-order.dto";
import { SendBudgetDto } from "../dto/send-budget.dto";
import { ApproveBudgetDto } from "../dto/approve-budget.dto";
import { RequestAdditionalDto } from "../dto/request-additional.dto";
import { WorkOrdersController } from "../infra/controllers/work-orders.controller";

describe("WorkOrdersController", () => {
  let controller: WorkOrdersController;
  let service: WorkOrdersService;

  const mockWorkOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findStatus: jest.fn(),
    startDiagnosis: jest.fn(),
    sendBudget: jest.fn(),
    approveBudget: jest.fn(),
    updateStatusFromEmail: jest.fn(),
    requestAdditional: jest.fn(),
    finish: jest.fn(),
    deliver: jest.fn(),
    getAverageExecutionTimeMinutes: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkOrdersController],
      providers: [
        {
          provide: WorkOrdersService,
          useValue: mockWorkOrdersService,
        },
      ],
    }).compile();

    controller = module.get<WorkOrdersController>(WorkOrdersController);
    service = module.get<WorkOrdersService>(WorkOrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a work order", async () => {
    const dto = {} as CreateWorkOrderDto;
    const result = { id: 1 };

    mockWorkOrdersService.create.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("should return all work orders", async () => {
    const result = [{ id: 1 }];

    mockWorkOrdersService.findAll.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(service.findAll).toHaveBeenCalled();
  });

  it("should find one work order by id", async () => {
    const result = { id: 1 };

    mockWorkOrdersService.findOne.mockResolvedValue(result);

    expect(await controller.findOne("1")).toEqual(result);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it("should return work order status by id", async () => {
    const result = { id: 1, status: "RECEBIDA" };

    mockWorkOrdersService.findStatus.mockResolvedValue(result);

    expect(await controller.findStatus("1")).toEqual(result);
    expect(service.findStatus).toHaveBeenCalledWith(1);
  });

  it("should start diagnosis", async () => {
    const result = { id: 1, status: "DIAGNOSIS" };

    mockWorkOrdersService.startDiagnosis.mockResolvedValue(result);

    expect(await controller.startDiagnosis("1")).toEqual(result);
    expect(service.startDiagnosis).toHaveBeenCalledWith(1);
  });

  it("should send budget", async () => {
    const dto = {} as SendBudgetDto;
    const result = { id: 1, status: "BUDGET_SENT" };

    mockWorkOrdersService.sendBudget.mockResolvedValue(result);

    expect(await controller.sendBudget("1", dto)).toEqual(result);
    expect(service.sendBudget).toHaveBeenCalledWith(1, dto);
  });

  it("should approve budget", async () => {
    const dto = {} as ApproveBudgetDto;
    const result = { id: 1, status: "BUDGET_APPROVED" };

    mockWorkOrdersService.approveBudget.mockResolvedValue(result);

    expect(await controller.approveBudget("1", dto)).toEqual(result);
    expect(service.approveBudget).toHaveBeenCalledWith(1, dto);
  });

  it("should request additional", async () => {
    const dto = {} as RequestAdditionalDto;
    const result = { id: 1, status: "ADDITIONAL_REQUESTED" };

    mockWorkOrdersService.requestAdditional.mockResolvedValue(result);

    expect(await controller.requestAdditional("1", dto)).toEqual(result);
    expect(service.requestAdditional).toHaveBeenCalledWith(1, dto);
  });

  it("should finish work order", async () => {
    const result = { id: 1, status: "FINISHED" };

    mockWorkOrdersService.finish.mockResolvedValue(result);

    expect(await controller.finish("1")).toEqual(result);
    expect(service.finish).toHaveBeenCalledWith(1);
  });

  it("should deliver work order", async () => {
    const result = { id: 1, status: "DELIVERED" };

    mockWorkOrdersService.deliver.mockResolvedValue(result);

    expect(await controller.deliver("1")).toEqual(result);
    expect(service.deliver).toHaveBeenCalledWith(1);
  });

  it("should return average execution time minutes", async () => {
    mockWorkOrdersService.getAverageExecutionTimeMinutes.mockResolvedValue(120);

    expect(await controller.avg()).toEqual({
      averageExecutionTimeMinutes: 120,
    });

    expect(service.getAverageExecutionTimeMinutes).toHaveBeenCalled();
  });
});
