import { ValidationError } from '../../../common/errors/domain.errors';
import { isValidCpf, isValidCpfCnpj, normalizeDigits } from '../../../common/validators/cpf-cnpj.validator';

function validateCustomerProps(props: { name: string; document: string; email: string }) {
  if (!props.name || props.name.trim().length < 2) {
    throw new ValidationError('Nome deve ter ao menos 2 caracteres');
  }
  const digits = normalizeDigits(props.document);
  const validDoc = digits.length === 11 ? isValidCpf(digits) : isValidCpfCnpj(props.document);
  if (!validDoc) {
    throw new ValidationError('CPF/CNPJ inválido');
  }
  if (!props.email || !props.email.includes('@')) {
    throw new ValidationError('E-mail inválido');
  }
}

export class Customer {
  readonly id?: number;
  readonly name: string;
  readonly document: string;
  readonly phone: string;
  readonly email: string;

  constructor(props: {
    id?: number;
    name: string;
    document: string;
    phone: string;
    email: string;
  }) {
    validateCustomerProps(props);
    this.id = props.id;
    this.name = props.name.trim();
    this.document = normalizeDigits(props.document);
    this.phone = props.phone.trim();
    this.email = props.email.trim().toLowerCase();
  }
}
