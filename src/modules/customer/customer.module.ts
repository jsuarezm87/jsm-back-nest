import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CustomerController],
  imports: [
    ConfigModule,
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema }
    ])
  ],
  providers: [CustomerService, JwtAuthGuard],
  exports: [MongooseModule]

})
export class CustomerModule {}
