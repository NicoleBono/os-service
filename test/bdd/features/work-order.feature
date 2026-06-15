# language: pt
Funcionalidade: Abertura de Ordem de Serviço

  Contexto:
    Dado que existe um cliente com CPF "529.982.247-25"
    E que existe um veículo com placa "ABC-1234" deste cliente

  Cenário: Abertura bem-sucedida de OS
    Quando o atendente abre uma OS para o veículo "ABC-1234"
    Então a OS deve ser criada com status "RECEBIDA"
    E o evento "os.created" deve ser publicado no RabbitMQ

  Cenário: OS aprovada após orçamento aceito
    Dado que existe uma OS com status "AGUARDANDO_APROVACAO"
    Quando o evento "budget.approved" é recebido com totalAmount 1500.00
    Então a OS deve ter status "APROVADA"
    E o campo "approvedAt" deve estar preenchido

  Cenário: OS cancelada após orçamento rejeitado
    Dado que existe uma OS com status "AGUARDANDO_APROVACAO"
    Quando o evento "budget.rejected" é recebido
    Então a OS deve ter status "CANCELADA"
    E o campo "cancelledAt" deve estar preenchido
