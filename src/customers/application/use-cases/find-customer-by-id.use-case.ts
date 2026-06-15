import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class FindCustomerByIdUseCase {
  constructor(private readonly repo: CustomerRepository) {}

  async execute(id: number) {
    const customer = await this.repo.findById(id);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return customer;
  }
}
