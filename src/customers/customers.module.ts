import { Module } from '@nestjs/common';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.use-case';
import { FindAllCustomersUseCase } from './application/use-cases/find-all-customers.use-case';
import { FindCustomerByDocumentUseCase } from './application/use-cases/find-customer-by-document.use-case';
import { FindCustomerByIdUseCase } from './application/use-cases/find-customer-by-id.use-case';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case';
import { CustomerRepository } from './domain/repositories/customer.repository.interface';
import { CustomersController } from './infra/controllers/customers.controller';
import { CustomersPrismaRepository } from './infra/prisma/customers.prisma.repository';

@Module({
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    FindAllCustomersUseCase,
    FindCustomerByDocumentUseCase,
    FindCustomerByIdUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    {
      provide: CustomerRepository,
      useClass: CustomersPrismaRepository,
    },
  ],
  exports: [CustomerRepository],
})
export class CustomersModule {}
