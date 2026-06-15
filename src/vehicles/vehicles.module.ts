import { Module } from "@nestjs/common";
import { CreateVehicleUseCase } from "./application/use-cases/create-vehicle.use-case";
import { DeleteVehicleUseCase } from "./application/use-cases/delete-vehicle.use-case";
import { FindAllVehiclesUseCase } from "./application/use-cases/find-all-vehicles.use-case";
import { FindVehicleByIdUseCase } from "./application/use-cases/find-vehicle-by-id.use-case";
import { UpdateVehicleUseCase } from "./application/use-cases/update-vehicle.use-case";
import { VehicleRepository } from "./domain/repositories/vehicle.repository";
import { VehiclePrismaRepository } from "./infra/prisma/vehicle.prisma.repository";
import { VehiclesController } from "./infra/controllers/vehicles.controller";

@Module({
  controllers: [VehiclesController],
  providers: [
    CreateVehicleUseCase,
    FindAllVehiclesUseCase,
    FindVehicleByIdUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
    {
      provide: VehicleRepository,
      useClass: VehiclePrismaRepository,
    },
  ],
  exports: [
    CreateVehicleUseCase,
    FindAllVehiclesUseCase,
    FindVehicleByIdUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
    VehicleRepository,
  ],
})
export class VehiclesModule {}
