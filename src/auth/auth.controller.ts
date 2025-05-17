import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './Dtos/login.dto';
import { CreateUserDto } from './Dtos/user.create.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ======== Register a new user ========
  @Post('register')
  createUser(@Body() data: CreateUserDto) {
    console.log('Hello user', data);
    return this.authService.createUser(data);
  }

  // ======== Login ========
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
