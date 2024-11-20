import { Body, Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateUserDto } from './users/dto/create-user.dto';
import { LoginUserDto } from './users/dto/login-user.dto';
import { AppService } from './app.service';

@Controller('api/auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.appService.registerUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.appService.loginUser(loginUserDto);
  }
}
