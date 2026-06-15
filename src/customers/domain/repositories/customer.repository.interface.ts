import { Customer } from '../entities/customer.entity';

export abstract class CustomerRepository {
  abstract create(data: Omit<Customer, 'id'>): Promise<Customer>;
  abstract findAll(): Promise<Customer[]>;
  abstract findById(id: number): Promise<Customer | null>;
  abstract findByDocument(document: string): Promise<Customer | null>;
  abstract update(id: number, data: Partial<Omit<Customer, 'id'>>): Promise<Customer>;
  abstract delete(id: number): Promise<void>;
}
