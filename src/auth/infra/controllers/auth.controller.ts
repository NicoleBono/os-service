import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { LoginDto } from "../../dto/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @ApiOperation({ summary: "Autentica via CPF e retorna um token JWT" })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.cpf);
  }
}
