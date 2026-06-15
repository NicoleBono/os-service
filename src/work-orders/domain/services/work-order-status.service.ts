import { BusinessRuleError } from '../../../common/errors/domain.errors';
import { OrderStatus } from '../../../common/enums/order-status.enum';

export class WorkOrderStatusService {
  private static readonly statusPriority: Record<OrderStatus, number> = {
    [OrderStatus.EM_EXECUCAO]: 1,
    [OrderStatus.AGUARDANDO_APROVACAO]: 2,
    [OrderStatus.EM_DIAGNOSTICO]: 3,
    [OrderStatus.RECEBIDA]: 4,
    [OrderStatus.FINALIZADA]: 5,
    [OrderStatus.ENTREGUE]: 6,
  };

  static ensureCanStartDiagnosis(status: OrderStatus) {
    if (status !== OrderStatus.RECEBIDA) {
      throw new BusinessRuleError('Diagnóstico só pode iniciar quando a OS está RECEBIDA');
    }
  }

  static ensureCanSendBudget(status: OrderStatus) {
    if (![OrderStatus.RECEBIDA, OrderStatus.EM_DIAGNOSTICO].includes(status)) {
      throw new BusinessRuleError('Orçamento só pode ser enviado quando a OS está RECEBIDA ou EM_DIAGNOSTICO');
    }
  }

  static ensureCanApproveBudget(status: OrderStatus) {
    if (status !== OrderStatus.AGUARDANDO_APROVACAO) {
      throw new BusinessRuleError('A OS precisa estar AGUARDANDO_APROVACAO');
    }
  }

  static ensureCanRequestAdditional(status: OrderStatus) {
    if (![OrderStatus.EM_DIAGNOSTICO, OrderStatus.EM_EXECUCAO].includes(status)) {
      throw new BusinessRuleError('Adicionais só podem ser solicitados em diagnóstico ou execução');
    }
  }

  static ensureCanFinish(status: OrderStatus) {
    if (status !== OrderStatus.EM_EXECUCAO) {
      throw new BusinessRuleError('Só pode finalizar quando EM_EXECUCAO');
    }
  }

  static ensureCanDeliver(status: OrderStatus) {
    if (status !== OrderStatus.FINALIZADA) {
      throw new BusinessRuleError('Só pode entregar quando FINALIZADA');
    }
  }

  static getExternalSourceAllowedStatuses(): OrderStatus[] {
    return [
      OrderStatus.RECEBIDA,
      OrderStatus.EM_DIAGNOSTICO,
      OrderStatus.AGUARDANDO_APROVACAO,
      OrderStatus.EM_EXECUCAO,
      OrderStatus.FINALIZADA,
      OrderStatus.ENTREGUE,
    ];
  }

  static sortActiveWorkOrders<T extends { status: OrderStatus; createdAt: Date }>(items: T[]): T[] {
    return [...items].sort((a, b) => {
      const priorityDiff = this.statusPriority[a.status] - this.statusPriority[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }
}
