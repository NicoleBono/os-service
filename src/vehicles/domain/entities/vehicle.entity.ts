import { ValidationError } from '../../../common/errors/domain.errors';

const PLATE_REGEX = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

function validateVehicleProps(props: { plate: string; brand: string; model: string; year: number }) {
  const normalizedPlate = props.plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!PLATE_REGEX.test(normalizedPlate)) {
    throw new ValidationError('Placa inválida. Use o formato ABC1234 ou ABC1D23');
  }
  if (!props.brand || props.brand.trim().length < 2) {
    throw new ValidationError('Marca deve ter ao menos 2 caracteres');
  }
  if (!props.model || props.model.trim().length < 1) {
    throw new ValidationError('Modelo é obrigatório');
  }
  const currentYear = new Date().getFullYear();
  if (props.year < 1900 || props.year > currentYear + 1) {
    throw new ValidationError(`Ano deve estar entre 1900 e ${currentYear + 1}`);
  }
}

export class Vehicle {
  readonly id?: number;
  readonly customerId: number;
  readonly plate: string;
  readonly brand: string;
  readonly model: string;
  readonly year: number;

  constructor(props: {
    id?: number;
    customerId: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
  }) {
    validateVehicleProps(props);
    this.id = props.id;
    this.customerId = props.customerId;
    this.plate = props.plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
    this.brand = props.brand.trim();
    this.model = props.model.trim();
    this.year = props.year;
  }
}
