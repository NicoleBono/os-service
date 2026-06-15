import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../../prisma/prisma.service";
import { normalizeDigits, isValidCpf } from "../../../common/validators/cpf-cnpj.validator";
import { UnauthorizedError } from "../../../common/errors/domain.errors";

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(cpf: string) {
    const normalized = normalizeDigits(cpf);

    if (!isValidCpf(normalized)) {
      throw new UnauthorizedError("CPF inválido");
    }

    const customer = await this.prisma.customer.findUnique({
      where: { document: normalized },
    });

    if (!customer) {
      throw new UnauthorizedError("Cliente não encontrado");
    }

    const payload = {
      sub: customer.id,
      name: customer.name,
      document: customer.document,
    };

    return {
      access_token: this.jwtService.sign(payload),
      customer: {
        id: customer.id,
        name: customer.name,
      },
    };
  }
}
