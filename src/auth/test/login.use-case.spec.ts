import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { LoginUseCase } from "../application/use-cases/login.use-case";
import { PrismaService } from "../../prisma/prisma.service";
import { UnauthorizedError } from "../../common/errors/domain.errors";

describe("LoginUseCase", () => {
  let useCase: LoginUseCase;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  const mockJwtService = { sign: jest.fn() };

  const mockPrismaService = {
    customer: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("deve retornar access_token para CPF válido e cliente existente", async () => {
    const customer = { id: 1, name: "João Silva", document: "52998224725" };
    mockPrismaService.customer.findUnique.mockResolvedValue(customer);
    mockJwtService.sign.mockReturnValue("fake-jwt-token");

    const result = await useCase.execute("529.982.247-25");

    expect(mockPrismaService.customer.findUnique).toHaveBeenCalledWith({
      where: { document: "52998224725" },
    });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: customer.id,
      name: customer.name,
      document: customer.document,
    });
    expect(result).toEqual({
      access_token: "fake-jwt-token",
      customer: { id: 1, name: "João Silva" },
    });
  });

  it("deve lançar UnauthorizedError para CPF com formato inválido", async () => {
    await expect(useCase.execute("000.000.000-00")).rejects.toThrow(
      UnauthorizedError,
    );
    expect(mockPrismaService.customer.findUnique).not.toHaveBeenCalled();
  });

  it("deve lançar UnauthorizedError se cliente não existir no banco", async () => {
    mockPrismaService.customer.findUnique.mockResolvedValue(null);

    await expect(useCase.execute("529.982.247-25")).rejects.toThrow(
      UnauthorizedError,
    );
  });
});
