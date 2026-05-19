import { Controller, Post, Body, HttpCode, HttpStatus, Put, Param, Get, UseGuards, Req, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Request } from 'express';


@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  @HttpCode( HttpStatus.OK )
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() req: Request & { user?: { email?: string } }) {
    return this.customerService.create(createCustomerDto, req.user?.email || '');
  }

  @Put('update/:id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Req() req: Request & { user?: { email?: string } }) {
    return this.customerService.update(id, updateCustomerDto, req.user?.email || '');
  }

  @Get('list')
  listCustomers(@Req() req: Request & { user?: { email?: string } }, @Query() paginationDto: PaginationDto) {
    return this.customerService.list(req.user?.email || '', paginationDto);
  }

  @Put('delete/:id')
  delete(@Param('id', ParseMongoIdPipe) id: string, @Req() req: Request & { user?: { email?: string } }) {
    return this.customerService.delete(id, req.user?.email || '');
  }




}
