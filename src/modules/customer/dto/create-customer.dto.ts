import { IsString, IsEmail, IsInt, IsPositive, Matches, MinLength, IsIn, Min, Max } from 'class-validator';

export class CreateCustomerDto {
  @IsString({ message: 'El nombre es obligatorio' })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'El apellido es obligatorio' })
  @MinLength(1, { message: 'El apellido es obligatorio' })
  lastName?: string;

  @IsInt({ message: 'Debe ser un número entero' })
  @IsPositive({ message: 'Debe ser positivo' })
  @Min(10000000, { message: 'Debe tener minimo 8 digitos' })
  @Max(999999999999999, { message: 'Debe tener maximo 15 digitos' })
  identification: number;

  @IsString({ message: 'La dirección es obligatoria' })
  @MinLength(1, { message: 'La dirección es obligatoria' })
  address: string;

  @IsString({ message: 'El formato debe ser ###-#######' })
  @Matches(/^\d{3}-\d{7}$/, { message: 'El formato debe ser ###-#######' })
  phone?: string;

  @IsString({ message: 'El formato debe ser ###-#######' })
  @Matches(/^\d{3}-\d{7}$/, { message: 'El formato debe ser ###-#######' })
  phone2?: string;

  @IsEmail({}, { message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'El estado es obligatorio' })
  @MinLength(1, { message: 'El estado es obligatorio' })
  @IsIn(['ACTIVO', 'INACTIVO'], { message: "El estado debe ser 'ACTIVO' o 'INACTIVO'" })
  status: string;
}
