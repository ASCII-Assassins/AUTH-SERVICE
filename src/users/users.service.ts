import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(user: any): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
}
