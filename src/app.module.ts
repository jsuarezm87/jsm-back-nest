import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { EnvConfiguration } from './config/configuration';
import { JoiValidationSchema } from './config/validation.schema';
import { CommonModule } from './common/common.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema
    }),
    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname,'..','public') 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb'),
        dbName: configService.get<string>('mongodbDbName'),
      }),
    }),
    CommonModule,
    UsersModule,
    CustomerModule,
    AuthModule
  
  ],
})
export class AppModule {}
