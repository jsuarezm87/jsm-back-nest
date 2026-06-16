import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'El nombre es obligatorio' })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  name: string;

  @IsEmail({}, { message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña es obligatoria' })
  @MinLength(5, { message: 'La contraseña debe tener minimo 5 caracteres' })
  password: string;
}
