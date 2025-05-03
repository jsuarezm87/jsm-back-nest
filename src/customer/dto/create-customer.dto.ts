import { IsString, IsOptional, IsEmail, IsInt, IsPositive, IsMongoId, MinLength, Matches, IsIn } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  lastName?: string;

  @IsInt()
  @IsPositive()
  identification: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}-\d{7}$/, { message: 'Phone must match the format XXX-XXXXXXX' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}-\d{7}$/, { message: 'Phone must match the format XXX-XXXXXXX' })
  phone2?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  @IsIn(['ACTIVO', 'INACTIVO'], { message: "Status must be either 'ACTIVO' or 'INACTIVO'" })
  status: string;

  @IsString()
  managedBy: string;
}