import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class FindCustomerByDocumentUseCase {
  constructor(private readonly repo: CustomerRepository) {}

  async execute(document: string) {
    const customer = await this.repo.findByDocument(document);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return customer;
  }
}
