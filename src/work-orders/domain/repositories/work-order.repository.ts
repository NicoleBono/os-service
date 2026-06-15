import { OrderStatus } from '../../../common/enums/order-status.enum';

export type WorkOrderServiceItemInput = {
  serviceId: number;
  quantity: number;
};

export type WorkOrderPartItemInput = {
  partId: number;
  quantity: number;
};

export type WorkOrderCustomerInput = {
  name: string;
  document: string;
  phone: string;
  email: string;
};

export type WorkOrderVehicleInput = {
  plate: string;
  brand: string;
  model: string;
  year: number;
};

export type OpenWorkOrderInput = {
  customer?: WorkOrderCustomerInput;
  vehicle?: WorkOrderVehicleInput;
  customerDocument?: string;
  vehicleId?: number;
  services: WorkOrderServiceItemInput[];
  parts?: WorkOrderPartItemInput[];
};

export abstract class WorkOrderRepository {
  abstract open(input: OpenWorkOrderInput): Promise<any>;
  abstract findAllActiveOrdered(): Promise<any[]>;
  abstract findDetailedById(id: number): Promise<any | null>;
  abstract findStatusById(id: number): Promise<{ id: number; status: OrderStatus } | null>;
  abstract startDiagnosis(id: number): Promise<any>;
  abstract sendBudget(id: number): Promise<any>;
  abstract approveBudget(id: number, approved: boolean): Promise<any>;
  abstract requestAdditional(id: number, input: { services?: WorkOrderServiceItemInput[]; parts?: WorkOrderPartItemInput[] }): Promise<any>;
  abstract finish(id: number): Promise<any>;
  abstract deliver(id: number): Promise<any>;
  abstract getAverageExecutionTimeMinutes(): Promise<number>;
  abstract updateStatusFromExternalSource(id: number, status: OrderStatus, source: string, note?: string): Promise<any>;
}
