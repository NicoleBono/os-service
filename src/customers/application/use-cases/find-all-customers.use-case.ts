import { Injectable } from '@nestjs/common';
import { CustomerRepository } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(private readonly repo: CustomerRepository) {}

  async execute() {
    return this.repo.findAll();
  }
}
