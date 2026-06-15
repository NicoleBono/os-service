import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "../prisma/prisma.module";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { AuthController } from "./infra/controllers/auth.controller";
import { JwtStrategy } from "./infra/strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "supersecret",
      signOptions: { expiresIn: "4h" },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase, JwtStrategy],
  exports: [LoginUseCase],
})
export class AuthModule {}
