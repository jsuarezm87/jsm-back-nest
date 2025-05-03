import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './entities/user.entity';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  exports: [MongooseModule]

})
export class CustomerModule {}
