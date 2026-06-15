import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isValidCpfCnpj } from '../../../common/validators/cpf-cnpj.validator';
import { UpdateCustomerDto } from '../../dto/update-customer.dto';
import { CustomerRepository } from '../../domain/repositories/customer.repository.interface';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly repo: CustomerRepository) {}

  async execute(id: number, dto: UpdateCustomerDto) {
    if (dto.document && !isValidCpfCnpj(dto.document)) {
      throw new BadRequestException('CPF/CNPJ inválido');
    }

    const customer = await this.repo.findById(id);

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return this.repo.update(id, dto);
  }
}
