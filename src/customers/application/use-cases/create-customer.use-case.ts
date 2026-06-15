import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { CreateCustomerDto } from '../../dto/create-customer.dto';
import { CustomerRepository } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly repo: CustomerRepository) {}

  async execute(dto: CreateCustomerDto) {
    const customer = new Customer(dto);
    return this.repo.create(customer);
  }
}
