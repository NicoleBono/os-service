export interface CustomerResponse {
  id: number;
  name: string;
  document: string;
  phone: string;
  email: string;
}

export class CustomerMapper {
  static toResponse(customer: any): CustomerResponse {
    return {
      id: customer.id,
      name: customer.name,
      document: customer.document,
      phone: customer.phone,
      email: customer.email,
    };
  }

  static toResponseList(customers: any[]): CustomerResponse[] {
    return customers.map(this.toResponse);
  }
}
