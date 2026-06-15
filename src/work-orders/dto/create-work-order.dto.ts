import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class WorkOrderServiceItemDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  serviceId: number;

  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class WorkOrderPartItemDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  partId: number;

  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class WorkOrderCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'CPF ou CNPJ' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}

export class WorkOrderVehicleDto {
  @ApiProperty({ example: 'ABC1D23' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1950)
  year: number;
}

export class CreateWorkOrderDto {
  @ApiPropertyOptional({ description: 'Modo legado: CPF/CNPJ do cliente já cadastrado' })
  @IsOptional()
  @IsString()
  customerDocument?: string;

  @ApiPropertyOptional({ description: 'Modo legado: id do veículo já cadastrado' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vehicleId?: number;

  @ApiPropertyOptional({ type: WorkOrderCustomerDto, description: 'Dados do cliente para localizar ou criar cadastro' })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkOrderCustomerDto)
  customer?: WorkOrderCustomerDto;

  @ApiPropertyOptional({ type: WorkOrderVehicleDto, description: 'Dados do veículo para localizar ou criar cadastro' })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkOrderVehicleDto)
  vehicle?: WorkOrderVehicleDto;

  @ApiProperty({ type: [WorkOrderServiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderServiceItemDto)
  services: WorkOrderServiceItemDto[];

  @ApiPropertyOptional({ type: [WorkOrderPartItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderPartItemDto)
  parts?: WorkOrderPartItemDto[];
}
