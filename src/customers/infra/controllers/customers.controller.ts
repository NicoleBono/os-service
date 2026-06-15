import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { FindAllCustomersUseCase } from '../../application/use-cases/find-all-customers.use-case';
import { FindCustomerByDocumentUseCase } from '../../application/use-cases/find-customer-by-document.use-case';
import { FindCustomerByIdUseCase } from '../../application/use-cases/find-customer-by-id.use-case';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../application/use-cases/delete-customer.use-case';
import { CreateCustomerDto } from '../../dto/create-customer.dto';
import { UpdateCustomerDto } from '../../dto/update-customer.dto';
import { CustomerMapper } from '../mappers/customer.mapper';

@ApiTags('Clientes')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
    private readonly findCustomerByDocumentUseCase: FindCustomerByDocumentUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.createCustomerUseCase.execute(dto);
    return CustomerMapper.toResponse(customer);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    const customers = await this.findAllCustomersUseCase.execute();
    return CustomerMapper.toResponseList(customers);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('by-document/:document')
  async findByDocument(@Param('document') document: string) {
    const customer = await this.findCustomerByDocumentUseCase.execute(document);
    return CustomerMapper.toResponse(customer);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.findCustomerByIdUseCase.execute(+id);
    return CustomerMapper.toResponse(customer);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    const customer = await this.updateCustomerUseCase.execute(+id, dto);
    return CustomerMapper.toResponse(customer);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteCustomerUseCase.execute(+id);
    return { message: 'Cliente removido' };
  }
}
