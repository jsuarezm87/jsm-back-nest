import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Model, Types } from 'mongoose';
import { Customer } from './entities/customer.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ManagedByPopulated } from './interfaces/managedByPopulated.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class CustomerService {

  private defaultLimit: number;

  constructor( 
    @InjectModel( Customer.name )
    private readonly customerModel: Model<Customer>,

    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit') || 10;
  }

  async create(createCustomerDto: CreateCustomerDto, authenticatedUserId: string) {
    try {
      const { identification, email } = createCustomerDto;
   
      const existingCustomerByIdentification = await this.customerModel.findOne({ identification });
      if (existingCustomerByIdentification) throw new BadRequestException(`A customer with identification ${identification} already exists.`);
       
      const existingCustomerByEmail = await this.customerModel.findOne({ email });
      if (existingCustomerByEmail) throw new BadRequestException(`A customer with email ${email} already exists.`);
   
      const userDB = await this.usersService.findById(authenticatedUserId);
      if (!userDB) throw new BadRequestException('No user found for authenticated session');
   
      return await this.customerModel.create({
        ...createCustomerDto,
        email: email.toLowerCase().trim(),
        managedBy: userDB._id,
      });
    } catch (error) {
      this.handleError(error, 'Error creating customer');     
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, authenticatedUserId: string) {
    try {  
      const customerBD: Customer | null = await this.customerModel.findById(id);
      if (!customerBD) throw new NotFoundException(`Customer with id ${id} not found`);

      if (customerBD.managedBy.toString() !== authenticatedUserId) {
        throw new ForbiddenException('Unauthorized operation for this resource');
      }

      if (updateCustomerDto.identification) {
        const duplicateIdentification = await this.customerModel.findOne({
          _id: { $ne: id },
          identification: updateCustomerDto.identification,
        });
        if (duplicateIdentification) throw new BadRequestException(`A customer with identification ${updateCustomerDto.identification} already exists.`);
      }

      if (updateCustomerDto.email) {
        const email = updateCustomerDto.email.toLowerCase().trim();
        const duplicateEmail = await this.customerModel.findOne({ _id: { $ne: id }, email });
        if (duplicateEmail) throw new BadRequestException(`A customer with email ${email} already exists.`);
        updateCustomerDto.email = email;
      }

      const updateCustomer = { ...updateCustomerDto };

      return await this.customerModel.findByIdAndUpdate( id, updateCustomer, {new: true});
      
    } catch (error) {  
      this.handleError(error, 'Error updating customer');  
    }
  }
 
  async list(authenticatedUserId: string, paginationDto: PaginationDto) {
    try {
      const manager = await this.usersService.findById(authenticatedUserId);
      if (!manager) throw new BadRequestException('No user found for authenticated session');

      const { limit = this.defaultLimit, offset = 0 } = paginationDto;
      const customers = await this.customerModel
                                .find({ managedBy: manager._id })
                                .limit(limit)
                                .skip(offset)
                                .populate<{ managedBy: ManagedByPopulated }>('managedBy', 'email -_id');

      const transformedCustomers = customers.map(customer => {
        const customerObj = customer.toObject();
        const { managedBy, ...data } = customerObj;

        const managedByValue = typeof managedBy === 'string'
          ? managedBy
          : managedBy?.email || '';

        return {
          ...data,
          managedBy: managedByValue
        };
      });

      return transformedCustomers;
      
    } catch (error) {
      this.handleError(error, 'Error getting customer');  
    }
  }

  async findOne(id: string, authenticatedUserId: string) {
    try {
      const customer = await this.customerModel
        .findOne({ _id: id, managedBy: new Types.ObjectId(authenticatedUserId) })
        .populate<{ managedBy: ManagedByPopulated }>('managedBy', 'email -_id');

      if (!customer) throw new NotFoundException(`Customer with id ${id} not found`);

      const customerObj = customer.toObject();
      const { managedBy, ...data } = customerObj;

      return {
        ...data,
        managedBy: typeof managedBy === 'string' ? managedBy : managedBy?.email || '',
      };
    } catch (error) {
      this.handleError(error, 'Error getting customer');
    }
  }

  async delete(id: string, authenticatedUserId: string) {
    try {
      const customerBD = await this.customerModel.findById(id);
      if (!customerBD) throw new NotFoundException(`Customer with id ${id} not found`);

      if (customerBD.managedBy.toString() !== authenticatedUserId) {
        throw new ForbiddenException('Unauthorized operation for this resource');
      }

      const {deletedCount} = await this.customerModel.deleteOne({ _id: id });
      if (deletedCount === 0) throw new BadRequestException(`Customer with id ${id} not found`);
      
      return {
        statusCode: 200,
        message: `Customer with id ${id} deleted successfully`,
      };
    } catch (error) {
      this.handleError(error, 'Error delinting customer'); 
    }
  }


  private handleError(error: any, msg: string) {
    console.error(`handleError: ${msg}: ${error?.message}`);
    if (error instanceof BadRequestException)  {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          error: `${error?.message}`
        }
      });
    }

    if (error instanceof NotFoundException || error instanceof ForbiddenException) {
      throw error;
    }
     
    throw new InternalServerErrorException({
      statusCode: 500,
      message: `${msg}: ${error?.message}`,
    });
  }

}
