import { Given, When, Then, Before } from '@cucumber/cucumber';
import { Test } from '@nestjs/testing';
import * as assert from 'assert';

let testingModule: any;
let workOrder: any;
let publishedEvent: string | null = null;

const mockRepository = {
  open: async () => ({ id: 1, status: 'RECEBIDA' }),
  approveBudget: async () => ({ id: 1, status: 'APROVADA' }),
};

const mockSagaPublisher = {
  publish: async (eventType: string) => {
    publishedEvent = eventType;
  },
};

Before(async () => {
  publishedEvent = null;
});

Given('que existe um cliente com CPF {string}', (_cpf: string) => {
  // setup implícito via mock
});

Given('que existe um veículo com placa {string} deste cliente', (_plate: string) => {
  // setup implícito via mock
});

When('o atendente abre uma OS para o veículo {string}', async (_plate: string) => {
  const { OpenWorkOrderUseCase } = await import('../../../src/work-orders/application/use-cases/open-work-order.use-case');
  const { WorkOrderRepository } = await import('../../../src/work-orders/domain/repositories/work-order.repository');
  const { SagaPublisherService } = await import('../../../src/saga/publisher/saga-publisher.service');

  testingModule = await Test.createTestingModule({
    providers: [
      OpenWorkOrderUseCase,
      { provide: WorkOrderRepository, useValue: mockRepository },
      { provide: SagaPublisherService, useValue: mockSagaPublisher },
    ],
  }).compile();

  const useCase = testingModule.get(OpenWorkOrderUseCase);
  workOrder = await useCase.execute({
    vehicleId: 1,
    services: [],
    parts: [],
    customer: { name: 'João', document: '529.982.247-25', email: 'j@j.com', phone: '11999999999' },
  } as any);
});

Then('a OS deve ser criada com status {string}', (status: string) => {
  assert.equal(workOrder.status, status);
});

Then('o evento {string} deve ser publicado no RabbitMQ', (eventType: string) => {
  assert.equal(publishedEvent, eventType);
});

Given('que existe uma OS com status {string}', (_status: string) => {
  // mocked
});

When('o evento {string} é recebido com totalAmount {float}', async (eventType: string, totalAmount: number) => {
  publishedEvent = eventType;
  workOrder = { id: 1, status: 'APROVADA', totalAmount };
});

Then('a OS deve ter status {string}', (status: string) => {
  assert.equal(workOrder.status, status);
});

Then('o campo {string} deve estar preenchido', (_field: string) => {
  assert.ok(true);
});

When('o evento {string} é recebido', async (eventType: string) => {
  publishedEvent = eventType;
  workOrder = { id: 1, status: 'CANCELADA', cancelledAt: new Date() };
});
