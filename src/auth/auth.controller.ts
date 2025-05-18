// import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { LoginDto } from './Dtos/login.dto';
// import { CreateUserDto } from './Dtos/user.create.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   // ======== Register a new user ========
//   @Post('register')
//   createUser(@Body() data: CreateUserDto) {
//     console.log('Hello user', data);
//     return this.authService.createUser(data);
//   }

//   // ======== Login ========
//   @HttpCode(HttpStatus.OK)
//   @Post('login')
//   login(@Body() data: LoginDto) {
//     return this.authService.login(data);
//   }
// }


import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateUserDto } from './Dtos/user.create.dto';
import { LoginDto } from './Dtos/login.dto';

@Controller('auth')
export class AuthController {
  private readonly context = 'AuthController';

  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // ======== Register a new user ========
  @Post('register')
  async createUser(@Body() data: CreateUserDto) {
    this.logger.info('Attempting to register new user', {
      context: this.context,
      email: data.email,
    });

    try {
      const result = await this.authService.createUser(data);
      this.logger.info('User registered successfully', {
        context: this.context,
        userId: result.id,
      });
      return result;
    } catch (error) {
      this.logger.error('Failed to register user', {
        context: this.context,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  // ======== Login ========
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() data: LoginDto) {
    this.logger.info('Login attempt', {
      context: this.context,
      email: data.email,
    });

    try {
      const result = await this.authService.login(data);
      this.logger.info('Login successful', {
        context: this.context,
        email: data.email,
      });
      return result;
    } catch (error) {
      this.logger.error('Login failed', {
        context: this.context,
        email: data.email,
        error: error.message,
      });
      throw error;
    }
  }
}
