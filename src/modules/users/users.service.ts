import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      return await this.userModel.create(createUserInput);
    } catch (error) {
      if (error?.code === 11000) {
        throw new BadRequestException('Ya existe un usuario con ese email');
      }
      throw error;
    }
  }

  findByEmail(email: string, includePassword = false) {
    const query = this.userModel.findOne({ email: email.toLowerCase().trim() });
    return includePassword ? query.select('+password') : query;
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }
}
