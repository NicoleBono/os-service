import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ApproveBudgetDto {
  @ApiProperty()
  @IsBoolean()
  approved: boolean;
}
