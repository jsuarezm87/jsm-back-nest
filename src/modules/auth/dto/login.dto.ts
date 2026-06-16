import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña es obligatoria' })
  @MinLength(5, { message: 'La contraseña debe tener minimo 5 caracteres' })
  password: string;
}
