import { Controller, Post, Body,  HttpCode, HttpStatus, Put, Param, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';


@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  @HttpCode( HttpStatus.OK )
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Put('update/:id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Get('list')
  listCustomers() {
    return this.customerService.list();
  }

  @Put('delete/:id')
  delete(@Param('id', ParseMongoIdPipe) id: string) {
    return this.customerService.delete(id);
  }




}
