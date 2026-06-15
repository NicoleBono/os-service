import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, Min } from 'class-validator';

class WorkOrderServiceItemDto {
  @ApiProperty()
  serviceId: number;

  @ApiProperty({ default: 1 })
  @Min(1)
  quantity: number;
}

class WorkOrderPartItemDto {
  @ApiProperty()
  partId: number;

  @ApiProperty({ default: 1 })
  @Min(1)
  quantity: number;
}

export class RequestAdditionalDto {
  @ApiProperty({ type: [WorkOrderServiceItemDto], required: false })
  @IsArray()
  @IsOptional()
  services?: WorkOrderServiceItemDto[];

  @ApiProperty({ type: [WorkOrderPartItemDto], required: false })
  @IsArray()
  @IsOptional()
  parts?: WorkOrderPartItemDto[];
}
