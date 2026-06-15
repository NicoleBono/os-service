import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../infra/controllers/auth.controller";
import { LoginUseCase } from "../application/use-cases/login.use-case";
import { LoginDto } from "../dto/login.dto";

describe("AuthController", () => {
  let controller: AuthController;
  let loginUseCase: LoginUseCase;

  const mockLoginUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: LoginUseCase, useValue: mockLoginUseCase }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("deve chamar LoginUseCase.execute com o CPF do body", async () => {
    const dto: LoginDto = { cpf: "529.982.247-25" };
    const expectedResult = {
      access_token: "jwt-token",
      customer: { id: 1, name: "João Silva" },
    };

    mockLoginUseCase.execute.mockResolvedValue(expectedResult);

    const result = await controller.login(dto);

    expect(loginUseCase.execute).toHaveBeenCalledWith("529.982.247-25");
    expect(result).toEqual(expectedResult);
  });
});
