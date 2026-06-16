import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param, Get, UseGuards, Req, Query, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Request } from 'express';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';


@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @HttpCode( HttpStatus.OK )
  create(@Body() createCustomerDto: CreateCustomerDto, @Req() req: Request & { user: JwtPayload }) {
    return this.customerService.create(createCustomerDto, req.user.uid);
  }

  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateCustomerDto: UpdateCustomerDto, @Req() req: Request & { user: JwtPayload }) {
    return this.customerService.update(id, updateCustomerDto, req.user.uid);
  }

  @Get()
  listCustomers(@Req() req: Request & { user: JwtPayload }, @Query() paginationDto: PaginationDto) {
    return this.customerService.list(req.user.uid, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.customerService.findOne(id, req.user.uid);
  }

  @Delete(':id')
  delete(@Param('id', ParseMongoIdPipe) id: string, @Req() req: Request & { user: JwtPayload }) {
    return this.customerService.delete(id, req.user.uid);
  }




}
