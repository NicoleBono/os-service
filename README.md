# OS Service — Fase 4 FIAP SOAT

Microsserviço responsável por gerenciar Ordens de Serviço, Clientes e Veículos.

## Tecnologias

- NestJS 11 + TypeScript
- PostgreSQL 16 + Prisma ORM
- AWS SNS (publicação de eventos) + AWS SQS (consumo de eventos)
- JWT Authentication
- Docker + Kubernetes (EKS)
- Datadog APM

## Saga Pattern — Coreografado

Este serviço atua como ponto de entrada da saga. A estratégia escolhida foi **coreografia via SNS/SQS** (sem orquestrador central), onde cada serviço reage a eventos publicados pelos outros.

### Eventos publicados (SNS)

| Evento | Quando | Destinatário |
|--------|--------|--------------|
| `OS_CREATED` | Ao abrir uma OS | billing-service |
| `BUDGET_APPROVAL_DECIDED` | Cliente aprova/rejeita orçamento | billing-service |
| `ADDITIONAL_REQUESTED` | Técnico solicita serviços adicionais | billing-service |
| `EXECUTION_REQUESTED` | Orçamento aprovado | execution-service |

### Eventos consumidos (SQS)

| Evento | Ação |
|--------|------|
| `BUDGET_GENERATED` | Status → AGUARDANDO_APROVACAO |
| `PAYMENT_CONFIRMED` | Status → ENTREGUE |
| `PAYMENT_FAILED` | Status → CANCELADA (rollback) |
| `EXECUTION_COMPLETED` | Status → FINALIZADA |
| `EXECUTION_FAILED` | Status → CANCELADA (rollback) |

### Fluxo completo

```
Cliente → POST /work-orders
  └─► OS_CREATED ──► billing-service (gera orçamento)
                          └─► BUDGET_GENERATED ──► os-service (AGUARDANDO_APROVACAO)

Cliente → POST /work-orders/:id/approve-budget { approved: true }
  └─► BUDGET_APPROVAL_DECIDED ──► billing-service (processa pagamento MP)
                                       └─► PAYMENT_CONFIRMED ──► os-service (ENTREGUE)

Rollback: orçamento rejeitado
  └─► BUDGET_APPROVAL_DECIDED { approved: false } ──► billing-service
        └─► PAYMENT_FAILED ──► os-service (CANCELADA)
```

## Variáveis de ambiente

```env
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=...
AWS_REGION=us-east-1
SAGA_SNS_TOPIC_ARN=arn:aws:sns:...
SAGA_SQS_QUEUE_URL=https://sqs...
DD_AGENT_HOST=datadog-agent
```

## Rodar localmente

```bash
docker compose up -d
```

## Testes

```bash
npm test              # unitários
npm run test:coverage # cobertura (≥80%)
npm run test:bdd      # BDD (Cucumber)
```

## Cobertura

![Coverage](https://img.shields.io/badge/coverage-≥80%25-green)
