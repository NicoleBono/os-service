import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SendBudgetDto {
  @ApiProperty({ required: false, description: 'Canal de envio (MVP: informativo)' })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;
}
