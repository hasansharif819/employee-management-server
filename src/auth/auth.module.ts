// import { Module } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';

// @Module({
//   controllers: [AuthController],
//   providers: [AuthService, PrismaService, JwtService],
// })
// export class AuthModule {}

// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, PrismaService, JwtService],
  exports: [JwtStrategy],
})
export class AuthModule {}
