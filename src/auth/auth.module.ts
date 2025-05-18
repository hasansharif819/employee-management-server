import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordService } from 'src/helpers/password.service';
import { JwtTokenService } from 'src/helpers/jwt-token.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    PasswordService,
    JwtTokenService,
    JwtStrategy,
    JwtService
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
