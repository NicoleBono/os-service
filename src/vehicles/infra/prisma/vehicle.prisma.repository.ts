import { Injectable } from "@nestjs/common";
import { normalizePlate } from "../../../common/validators/plate.validator";
import { PrismaService } from "../../../prisma/prisma.service";
import { Vehicle } from "../../domain/entities/vehicle.entity";
import { VehicleRepository } from "../../domain/repositories/vehicle.repository";

@Injectable()
export class VehiclePrismaRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Vehicle) {
    return this.prisma.vehicle.create({
      data: {
        ...data,
        plate: normalizePlate(data.plate),
      },
    });
  }

  findAll(customerId?: number) {
    return this.prisma.vehicle.findMany({
      where: customerId ? { customerId } : undefined,
      orderBy: { id: "asc" },
    });
  }

  findById(id: number) {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }

  update(id: number, data: Partial<Vehicle>) {
    const payload = { ...data };

    if (payload.plate) {
      payload.plate = normalizePlate(payload.plate);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: payload,
    });
  }

  async delete(id: number) {
    await this.prisma.vehicle.delete({ where: { id } });
  }
}
