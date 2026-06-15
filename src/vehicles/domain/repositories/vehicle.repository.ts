import { Vehicle } from '../entities/vehicle.entity';

export abstract class VehicleRepository {
  abstract create(data: Vehicle): Promise<Vehicle>;
  abstract findAll(customerId?: number): Promise<Vehicle[]>;
  abstract findById(id: number): Promise<Vehicle | null>;
  abstract update(id: number, data: Partial<Vehicle>): Promise<Vehicle>;
  abstract delete(id: number): Promise<void>;
}
