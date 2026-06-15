import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '123.456.789-09', description: 'CPF do cliente (com ou sem formatação)' })
  @IsString()
  cpf: string;
}
