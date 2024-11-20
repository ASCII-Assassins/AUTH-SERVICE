import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { LoginUserDto } from './users/dto/login-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './users/dto/user.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject('AUTH_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    // Check if the user already exists
    const user = await this.usersService.findOne(createUserDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const result = await this.usersService.create(createUserDto);
    const userData = plainToInstance(UserDto, result, { excludeExtraneousValues: true });
    this.rabbitClient.emit('user_registered', userData);
    if (!result) {
      throw new BadRequestException('User could not be created');
    }
    return { message: 'User created successfully'};
  }

  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<{ user: UserDto, access_token: string }> {
    const user = await this.usersService.findOne(loginUserDto.email);
    if (user?.password !== loginUserDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: plainToInstance(UserDto, user, { excludeExtraneousValues: true }),
    };
  }
}
