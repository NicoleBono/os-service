import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { normalizeDigits } from '../../../common/validators/cpf-cnpj.validator';
import { normalizePlate } from '../../../common/validators/plate.validator';
import {
  OpenWorkOrderInput,
  WorkOrderRepository,
} from '../../domain/repositories/work-order.repository';
import { WorkOrderStatusService } from '../../domain/services/work-order-status.service';

@Injectable()
export class PrismaWorkOrderRepository extends WorkOrderRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async open(input: OpenWorkOrderInput) {
    const customer = await this.resolveCustomer(input);
    const vehicle = await this.resolveVehicle(customer.id, input);
    const parts = input.parts ?? [];

    return this.prisma.$transaction(async (tx) => {
      let totalServices = 0;
      for (const item of input.services) {
        const service = await tx.serviceCatalog.findUnique({ where: { id: item.serviceId } });
        if (!service) throw new NotFoundException(`Serviço ${item.serviceId} não encontrado`);
        totalServices += Number(service.basePrice) * (item.quantity || 1);
      }

      let totalParts = 0;
      for (const item of parts) {
        const part = await tx.part.findUnique({ where: { id: item.partId } });
        if (!part) throw new NotFoundException(`Peça ${item.partId} não encontrada`);
        if (part.stockQuantity < (item.quantity || 1)) {
          throw new BadRequestException(`Estoque insuficiente para a peça: ${part.name}`);
        }
        totalParts += Number(part.unitPrice) * (item.quantity || 1);
      }

      const workOrder = await tx.workOrder.create({
        data: {
          customerId: customer.id,
          vehicleId: vehicle.id,
          status: OrderStatus.RECEBIDA,
          totalServices,
          totalParts,
          totalAmount: totalServices + totalParts,
          services: {
            create: input.services.map((item) => ({
              serviceId: item.serviceId,
              quantity: item.quantity || 1,
            })),
          },
          parts: {
            create: parts.map((item) => ({
              partId: item.partId,
              quantity: item.quantity || 1,
            })),
          },
        },
        include: this.includeDetailed(),
      });

      for (const item of parts) {
        await tx.part.update({
          where: { id: item.partId },
          data: { stockQuantity: { decrement: item.quantity || 1 } },
        });
      }

      return workOrder;
    });
  }

  async findAllActiveOrdered() {
    const items = await this.prisma.workOrder.findMany({
      where: {
        status: {
          in: [
            OrderStatus.RECEBIDA,
            OrderStatus.EM_DIAGNOSTICO,
            OrderStatus.AGUARDANDO_APROVACAO,
            OrderStatus.EM_EXECUCAO,
          ],
        },
      },
      include: this.includeDetailed(),
      orderBy: { createdAt: 'asc' },
    });

    return WorkOrderStatusService.sortActiveWorkOrders(items as any);
  }

  findDetailedById(id: number) {
    return this.prisma.workOrder.findUnique({
      where: { id },
      include: this.includeDetailed(),
    });
  }

  async findStatusById(id: number) {
    return this.prisma.workOrder.findUnique({
      where: { id },
      select: { id: true, status: true },
    }) as any;
  }

  async startDiagnosis(id: number) {
    const current = await this.requireStatus(id);
    WorkOrderStatusService.ensureCanStartDiagnosis(current.status);

    return this.prisma.workOrder.update({
      where: { id },
      data: {
        status: OrderStatus.EM_DIAGNOSTICO,
        startedDiagnosisAt: new Date(),
      },
    });
  }

  async sendBudget(id: number) {
    const current = await this.requireStatus(id);
    WorkOrderStatusService.ensureCanSendBudget(current.status);

    const updated = await this.prisma.workOrder.update({
      where: { id },
      data: {
        status: OrderStatus.AGUARDANDO_APROVACAO,
        budgetSentAt: new Date(),
      },
    });

    return {
      message: 'Orçamento enviado (simulado) para aprovação',
      workOrder: updated,
    };
  }

  async approveBudget(id: number, approved: boolean) {
    const current = await this.requireStatus(id);
    WorkOrderStatusService.ensureCanApproveBudget(current.status);

    if (!approved) {
      const updated = await this.prisma.workOrder.update({
        where: { id },
        data: { status: OrderStatus.EM_DIAGNOSTICO },
      });

      return {
        message: 'Orçamento rejeitado; OS voltou para diagnóstico',
        workOrder: updated,
      };
    }

    const updated = await this.prisma.workOrder.update({
      where: { id },
      data: {
        status: OrderStatus.EM_EXECUCAO,
        approvedAt: new Date(),
        startedExecutionAt: new Date(),
      },
    });

    return {
      message: 'Orçamento aprovado; OS em execução',
      workOrder: updated,
    };
  }

  async requestAdditional(
    id: number,
    input: { services?: { serviceId: number; quantity: number }[]; parts?: { partId: number; quantity: number }[] },
  ) {
    const current = await this.requireStatus(id);
    WorkOrderStatusService.ensureCanRequestAdditional(current.status);

    const addServices = input.services ?? [];
    const addParts = input.parts ?? [];

    return this.prisma.$transaction(async (tx) => {
      for (const serviceItem of addServices) {
        const service = await tx.serviceCatalog.findUnique({ where: { id: serviceItem.serviceId } });
        if (!service) throw new NotFoundException(`Serviço ${serviceItem.serviceId} não encontrado`);
        await tx.workOrderService.create({
          data: {
            workOrderId: id,
            serviceId: serviceItem.serviceId,
            quantity: serviceItem.quantity || 1,
          },
        });
      }

      for (const partItem of addParts) {
        const part = await tx.part.findUnique({ where: { id: partItem.partId } });
        if (!part) throw new NotFoundException(`Peça ${partItem.partId} não encontrada`);
        if (part.stockQuantity < (partItem.quantity || 1)) {
          throw new BadRequestException(`Estoque insuficiente para a peça: ${part.name}`);
        }
        await tx.workOrderPart.create({
          data: {
            workOrderId: id,
            partId: partItem.partId,
            quantity: partItem.quantity || 1,
          },
        });
        await tx.part.update({
          where: { id: partItem.partId },
          data: { stockQuantity: { decrement: partItem.quantity || 1 } },
        });
      }

      const loaded = await tx.workOrder.findUnique({
        where: { id },
        include: {
          services: { include: { service: true } },
          parts: { include: { part: true } },
        },
      });
      if (!loaded) throw new NotFoundException('OS não encontrada');

      const totalServices = loaded.services.reduce(
        (acc, item) => acc + Number(item.service.basePrice) * item.quantity,
        0,
      );
      const totalParts = loaded.parts.reduce(
        (acc, item) => acc + Number(item.part.unitPrice) * item.quantity,
        0,
      );

      const updated = await tx.workOrder.update({
        where: { id },
        data: {
          totalServices,
          totalParts,
          totalAmount: totalServices + totalParts,
          status: OrderStatus.AGUARDANDO_APROVACAO,
          budgetSentAt: new Date(),
        },
      });

      return {
        message: 'Adicionais incluídos e novo orçamento enviado (simulado) para aprovação',
        workOrder: updated,
      };
    });
  }

  async finish(id: number) {
    const current = await this.requireStatus(id);
    WorkOrderStatusService.ensureCanFinish(current.status);

    return this.prisma.workOrder.update({
      where: { id },
      data: { status: OrderStatus.FINALIZADA, finishedAt: new Date() },
    });
  }

  async deliver(id: number) {
    const current = await this.requireStatus(id);
    WorkOrderStatusService.ensureCanDeliver(current.status);

    return this.prisma.workOrder.update({
      where: { id },
      data: { status: OrderStatus.ENTREGUE, deliveredAt: new Date() },
    });
  }

  async getAverageExecutionTimeMinutes() {
    const orders = await this.prisma.workOrder.findMany({
      where: {
        status: OrderStatus.ENTREGUE,
        startedExecutionAt: { not: null },
        deliveredAt: { not: null },
      },
      select: { startedExecutionAt: true, deliveredAt: true },
    });

    if (!orders.length) return 0;

    const totalMillis = orders.reduce((acc, order) => {
      return acc + (order.deliveredAt!.getTime() - order.startedExecutionAt!.getTime());
    }, 0);

    return Math.round(totalMillis / orders.length / 60000);
  }

  async updateStatusFromExternalSource(id: number, status: OrderStatus, source: string, note?: string) {
    if (!WorkOrderStatusService.getExternalSourceAllowedStatuses().includes(status)) {
      throw new BadRequestException(`Status ${status} não permitido para atualização externa`);
    }

    await this.requireStatus(id);

    const now = new Date();
    const data: any = {
      status,
      updatedAt: now,
    };

    if (status === OrderStatus.EM_DIAGNOSTICO) data.startedDiagnosisAt ??= now;
    if (status === OrderStatus.AGUARDANDO_APROVACAO) data.budgetSentAt ??= now;
    if (status === OrderStatus.EM_EXECUCAO) {
      data.approvedAt ??= now;
      data.startedExecutionAt ??= now;
    }
    if (status === OrderStatus.FINALIZADA) data.finishedAt ??= now;
    if (status === OrderStatus.ENTREGUE) data.deliveredAt ??= now;

    const workOrder = await this.prisma.workOrder.update({ where: { id }, data });
    return {
      message: `Status atualizado via ${source}` + (note ? `: ${note}` : ''),
      workOrder,
    };
  }

  private includeDetailed() {
    return {
      customer: true,
      vehicle: true,
      services: { include: { service: true } },
      parts: { include: { part: true } },
    };
  }

  private async requireStatus(id: number) {
    const workOrder = await this.findStatusById(id);
    if (!workOrder) throw new NotFoundException('OS não encontrada');
    return workOrder;
  }

  private async resolveCustomer(input: OpenWorkOrderInput) {
    if (input.customer) {
      const normalizedDocument = normalizeDigits(input.customer.document);
      const existing = await this.prisma.customer.findUnique({ where: { document: normalizedDocument } });
      if (existing) return existing;

      return this.prisma.customer.create({
        data: {
          name: input.customer.name,
          document: normalizedDocument,
          phone: input.customer.phone,
          email: input.customer.email,
        },
      });
    }

    if (!input.customerDocument) {
      throw new BadRequestException('Informe os dados do cliente ou customerDocument');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { document: normalizeDigits(input.customerDocument) },
    });

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado para o CPF/CNPJ informado');
    }

    return customer;
  }

  private async resolveVehicle(customerId: number, input: OpenWorkOrderInput) {
    if (input.vehicle) {
      const normalizedPlate = normalizePlate(input.vehicle.plate);
      const existing = await this.prisma.vehicle.findFirst({
        where: { customerId, plate: normalizedPlate },
      });
      if (existing) return existing;

      return this.prisma.vehicle.create({
        data: {
          customerId,
          plate: normalizedPlate,
          brand: input.vehicle.brand,
          model: input.vehicle.model,
          year: input.vehicle.year,
        },
      });
    }

    if (!input.vehicleId) {
      throw new BadRequestException('Informe os dados do veículo ou vehicleId');
    }

    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: input.vehicleId } });
    if (!vehicle) throw new NotFoundException('Veículo não encontrado');
    if (vehicle.customerId !== customerId) {
      throw new BadRequestException('Veículo não pertence ao cliente informado');
    }
    return vehicle;
  }
}
