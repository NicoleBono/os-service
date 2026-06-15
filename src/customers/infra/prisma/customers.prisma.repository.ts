import { Injectable } from '@nestjs/common';
import { normalizeDigits } from '../../../common/validators/cpf-cnpj.validator';
import { PrismaService } from '../../../prisma/prisma.service';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class CustomersPrismaRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Customer, 'id'>): Promise<Customer> {
    return this.prisma.customer.create({
      data: { ...data, document: normalizeDigits(data.document) },
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({ orderBy: { id: 'asc' } });
  }

  async findById(id: number): Promise<Customer | null> {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  async findByDocument(document: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { document: normalizeDigits(document) },
    });
  }

  async update(id: number, data: Partial<Omit<Customer, 'id'>>): Promise<Customer> {
    const payload = { ...data };

    if (payload.document) {
      payload.document = normalizeDigits(payload.document);
    }

    return this.prisma.customer.update({ where: { id }, data: payload });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.customer.delete({ where: { id } });
  }
}
