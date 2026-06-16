import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase().trim();
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException('Ya existe un usuario con ese email');
    }

    const password = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      name: registerDto.name.trim(),
      email,
      password,
    });

    return this.buildAuthResponse({
      uid: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(email, true);

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const validPassword = await bcrypt.compare(loginDto.password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return this.buildAuthResponse({
      uid: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  }

  async refresh(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.uid);

    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return this.buildAuthResponse({
      uid: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  }

  me(payload: JwtPayload) {
    return {
      ok: true,
      uid: payload.uid,
      name: payload.name,
      email: payload.email,
    };
  }

  private buildAuthResponse(payload: JwtPayload) {
    return {
      ok: true,
      uid: payload.uid,
      name: payload.name,
      email: payload.email,
      token: this.jwtService.sign(payload),
    };
  }
}
