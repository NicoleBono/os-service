import { Test, TestingModule } from '@nestjs/testing';
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case';
import { DeleteCustomerUseCase } from '../application/use-cases/delete-customer.use-case';
import { FindAllCustomersUseCase } from '../application/use-cases/find-all-customers.use-case';
import { FindCustomerByDocumentUseCase } from '../application/use-cases/find-customer-by-document.use-case';
import { FindCustomerByIdUseCase } from '../application/use-cases/find-customer-by-id.use-case';
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomersController } from '../infra/controllers/customers.controller';

describe('CustomersController', () => {
  let controller: CustomersController;
  let createCustomerUseCase: CreateCustomerUseCase;
  let findAllCustomersUseCase: FindAllCustomersUseCase;
  let findCustomerByDocumentUseCase: FindCustomerByDocumentUseCase;
  let findCustomerByIdUseCase: FindCustomerByIdUseCase;
  let updateCustomerUseCase: UpdateCustomerUseCase;
  let deleteCustomerUseCase: DeleteCustomerUseCase;

  const mockCreateCustomerUseCase = { execute: jest.fn() };
  const mockFindAllCustomersUseCase = { execute: jest.fn() };
  const mockFindCustomerByDocumentUseCase = { execute: jest.fn() };
  const mockFindCustomerByIdUseCase = { execute: jest.fn() };
  const mockUpdateCustomerUseCase = { execute: jest.fn() };
  const mockDeleteCustomerUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        { provide: CreateCustomerUseCase, useValue: mockCreateCustomerUseCase },
        { provide: FindAllCustomersUseCase, useValue: mockFindAllCustomersUseCase },
        { provide: FindCustomerByDocumentUseCase, useValue: mockFindCustomerByDocumentUseCase },
        { provide: FindCustomerByIdUseCase, useValue: mockFindCustomerByIdUseCase },
        { provide: UpdateCustomerUseCase, useValue: mockUpdateCustomerUseCase },
        { provide: DeleteCustomerUseCase, useValue: mockDeleteCustomerUseCase },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    createCustomerUseCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
    findAllCustomersUseCase = module.get<FindAllCustomersUseCase>(FindAllCustomersUseCase);
    findCustomerByDocumentUseCase = module.get<FindCustomerByDocumentUseCase>(FindCustomerByDocumentUseCase);
    findCustomerByIdUseCase = module.get<FindCustomerByIdUseCase>(FindCustomerByIdUseCase);
    updateCustomerUseCase = module.get<UpdateCustomerUseCase>(UpdateCustomerUseCase);
    deleteCustomerUseCase = module.get<DeleteCustomerUseCase>(DeleteCustomerUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a customer', async () => {
    const dto = {} as CreateCustomerDto;
    const result = { id: 1 };

    mockCreateCustomerUseCase.execute.mockResolvedValue(result);

    expect(await controller.create(dto)).toEqual(result);
    expect(createCustomerUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should return all customers', async () => {
    const result = [{ id: 1 }];

    mockFindAllCustomersUseCase.execute.mockResolvedValue(result);

    expect(await controller.findAll()).toEqual(result);
    expect(findAllCustomersUseCase.execute).toHaveBeenCalled();
  });

  it('should find customer by document', async () => {
    const document = '12345678900';
    const result = { id: 1 };

    mockFindCustomerByDocumentUseCase.execute.mockResolvedValue(result);

    expect(await controller.findByDocument(document)).toEqual(result);
    expect(findCustomerByDocumentUseCase.execute).toHaveBeenCalledWith(document);
  });

  it('should find one customer by id', async () => {
    const result = { id: 1 };

    mockFindCustomerByIdUseCase.execute.mockResolvedValue(result);

    expect(await controller.findOne('1')).toEqual(result);
    expect(findCustomerByIdUseCase.execute).toHaveBeenCalledWith(1);
  });

  it('should update a customer', async () => {
    const dto = {} as UpdateCustomerDto;
    const result = { id: 1 };

    mockUpdateCustomerUseCase.execute.mockResolvedValue(result);

    expect(await controller.update('1', dto)).toEqual(result);
    expect(updateCustomerUseCase.execute).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a customer', async () => {
    mockDeleteCustomerUseCase.execute.mockResolvedValue(undefined);

    expect(await controller.remove('1')).toEqual({ message: 'Cliente removido' });
    expect(deleteCustomerUseCase.execute).toHaveBeenCalledWith(1);
  });
});
