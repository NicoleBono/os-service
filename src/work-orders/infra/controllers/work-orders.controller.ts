import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { WorkOrdersService } from "../../application/work-orders.service";
import { CreateWorkOrderDto } from "../../dto/create-work-order.dto";
import { SendBudgetDto } from "../../dto/send-budget.dto";
import { ApproveBudgetDto } from "../../dto/approve-budget.dto";
import { RequestAdditionalDto } from "../../dto/request-additional.dto";
import { UpdateWorkOrderStatusFromEmailDto } from "../../dto/update-work-order-status-from-email.dto";

@ApiTags("Ordens de Serviço")
@Controller("work-orders")
export class WorkOrdersController {
  constructor(private readonly service: WorkOrdersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Body() dto: CreateWorkOrderDto) {
    return this.service.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get(":id/status")
  findStatus(@Param("id") id: string) {
    return this.service.findStatus(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Patch(":id/start-diagnosis")
  startDiagnosis(@Param("id") id: string) {
    return this.service.startDiagnosis(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post(":id/send-budget")
  sendBudget(@Param("id") id: string, @Body() dto: SendBudgetDto) {
    return this.service.sendBudget(+id, dto);
  }

  @Post(":id/approve-budget")
  approveBudget(@Param("id") id: string, @Body() dto: ApproveBudgetDto) {
    return this.service.approveBudget(+id, dto);
  }

  @Post(":id/email-status")
  updateStatusFromEmail(
    @Param("id") id: string,
    @Body() dto: UpdateWorkOrderStatusFromEmailDto,
  ) {
    return this.service.updateStatusFromEmail(+id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post(":id/request-additional")
  requestAdditional(
    @Param("id") id: string,
    @Body() dto: RequestAdditionalDto,
  ) {
    return this.service.requestAdditional(+id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Patch(":id/finish")
  finish(@Param("id") id: string) {
    return this.service.finish(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Patch(":id/deliver")
  deliver(@Param("id") id: string) {
    return this.service.deliver(+id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("metrics/average-execution-time")
  async avg() {
    const avg = await this.service.getAverageExecutionTimeMinutes();
    return { averageExecutionTimeMinutes: avg };
  }
}
