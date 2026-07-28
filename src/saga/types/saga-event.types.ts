// Catálogo de eventos da Saga (OS Service ↔ Billing Service ↔ Execution Service)
//
// Este serviço publica: OS_CREATED, BUDGET_APPROVAL_DECIDED, ADDITIONAL_REQUESTED, EXECUTION_REQUESTED
// Este serviço consome: BUDGET_GENERATED, PAYMENT_CONFIRMED, PAYMENT_FAILED, EXECUTION_COMPLETED, EXECUTION_FAILED

export enum SagaEventType {
  OS_CREATED = 'OS_CREATED',
  BUDGET_APPROVAL_DECIDED = 'BUDGET_APPROVAL_DECIDED',
  ADDITIONAL_REQUESTED = 'ADDITIONAL_REQUESTED',
  EXECUTION_REQUESTED = 'EXECUTION_REQUESTED',

  BUDGET_GENERATED = 'BUDGET_GENERATED',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  EXECUTION_COMPLETED = 'EXECUTION_COMPLETED',
  EXECUTION_FAILED = 'EXECUTION_FAILED',
}

export interface SagaEvent<TPayload = Record<string, unknown>> {
  eventType: SagaEventType;
  workOrderId: number;
  payload: TPayload;
  occurredAt: string;
}

export interface OsCreatedPayload {
  customer: { name: string; document: string; email: string; phone: string };
  totalAmount: number;
  services: { serviceId: number; quantity: number }[];
  parts: { partId: number; quantity: number }[];
}

export interface BudgetApprovalDecidedPayload {
  approved: boolean;
}

export interface AdditionalRequestedPayload {
  services: { serviceId: number; quantity: number }[];
  parts: { partId: number; quantity: number }[];
}
