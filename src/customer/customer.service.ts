import { BadRequestException, Injectable, InternalServerErrorException, 
         NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Customer } from './entities/customer.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {

  private defaultLimit: number;

  constructor( 
    @InjectModel( Customer.name )
    private readonly customerModel: Model<Customer>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defautlLimit');
  }

  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const userDB = await this.userModel.findOne({ email: createCustomerDto.managedBy });
      createCustomerDto.managedBy = userDB._id as string;
    
      // const existingCustomerByIdentification = await this.customerModel.findOne({ identification });
      // if (existingCustomerByIdentification) {
      //   throw new BadRequestException(`A customer with identification ${identification} already exists.`);
      // }

      return await this.customerModel.create(createCustomerDto);   
    } catch (error) {  
      console.log(error);    
      this.handleExceptions(error);
    }
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {  
      const customerBD: Customer = await this.customerModel.findById(id);

      const updateCustomer = {
        customerBD,
        ...updateCustomerDto
      }

      return await this.customerModel.findByIdAndUpdate( id, updateCustomer, {new: true});
      
    } catch (error) {  
      console.log(error);    
      this.handleExceptions(error);
    }
  }
 




  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Customer exists is db ${JSON.stringify(error.keyValue)}`)
    } 
    console.log(error);
    throw new InternalServerErrorException(`Can't create/update Customer, check server logs`);  
  }
}
