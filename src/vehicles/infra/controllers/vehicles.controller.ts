import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { CreateVehicleUseCase } from "../../application/use-cases/create-vehicle.use-case";
import { DeleteVehicleUseCase } from "../../application/use-cases/delete-vehicle.use-case";
import { FindAllVehiclesUseCase } from "../../application/use-cases/find-all-vehicles.use-case";
import { FindVehicleByIdUseCase } from "../../application/use-cases/find-vehicle-by-id.use-case";
import { UpdateVehicleUseCase } from "../../application/use-cases/update-vehicle.use-case";
import { CreateVehicleDto } from "../../dto/create-vehicle.dto";
import { UpdateVehicleDto } from "../../dto/update-vehicle.dto";

@ApiTags("Veículos")
@Controller("vehicles")
export class VehiclesController {
  constructor(
    private readonly createVehicleUseCase: CreateVehicleUseCase,
    private readonly findAllVehiclesUseCase: FindAllVehiclesUseCase,
    private readonly findVehicleByIdUseCase: FindVehicleByIdUseCase,
    private readonly updateVehicleUseCase: UpdateVehicleUseCase,
    private readonly deleteVehicleUseCase: DeleteVehicleUseCase,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.createVehicleUseCase.execute(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get()
  findAll(@Query("customerId") customerId?: string) {
    return this.findAllVehiclesUseCase.execute(
      customerId ? +customerId : undefined,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.findVehicleByIdUseCase.execute(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateVehicleDto) {
    return this.updateVehicleUseCase.execute(+id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.deleteVehicleUseCase.execute(+id);
    return { message: "Veículo removido" };
  }
}
