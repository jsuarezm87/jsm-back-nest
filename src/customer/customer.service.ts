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
import { ManagedByPopulated } from './interfaces/managedByPopulated.interface';

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
      const { identification, managedBy, email } = createCustomerDto;
  
      const existingCustomerByIdentification = await this.customerModel.findOne({ identification });
      if (existingCustomerByIdentification) throw new BadRequestException(`A customer with identification ${identification} already exists.`);
      
      const existingCustomerByEmail = await this.customerModel.findOne({ email });
      if (existingCustomerByEmail) throw new BadRequestException(`A customer with email ${email} already exists.`);
  
      const userDB: User | null = await this.userModel.findOne({ email: managedBy });
      if (!userDB) throw new BadRequestException(`No user found with email ${managedBy}`);
      

      createCustomerDto.managedBy = userDB._id as string;
  
      return await this.customerModel.create(createCustomerDto);
    } catch (error) {
      this.handleError(error, 'Error creating customer');     
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
      this.handleError(error, 'Error updating customer');  
    }
  }
 
  async list() {
    try {
      // Busca todos los clientes y popula el campo 'managedBy' con el email, excluyendo el _id
      const customers = await this.customerModel
                                .find()
                                .populate<{ managedBy: ManagedByPopulated }>('managedBy', 'email -_id');
  
      // Transforma los datos eliminando __v y ajustando el formato de managedBy
      const transformedCustomers = customers.map(customer => {
        const customerObj = customer.toObject();
        const { managedBy, ...data } = customerObj;

        return {
          ...data,
          managedBy: managedBy.email
        };
      });
  
      // Devuelve la respuesta con los datos transformados
      return transformedCustomers;
      
    } catch (error) {
      this.handleError(error, 'Error getting customer');  
    }
  }


  async delete(id: string) {
    try {
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
    console.log(`handleError: ${msg}: ${error?.message}`);
    if (error instanceof BadRequestException)  throw error;
    
    throw new InternalServerErrorException({
      statusCode: 500,
      message: `${msg}: ${error?.message}`,
    });
  }

}
