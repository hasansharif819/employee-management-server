import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './Dtos/login.dto';
import { CreateUserDto } from './Dtos/user.create.dto';
import { JwtTokenService } from 'src/helpers/jwt-token.service';
import { UserEntity } from 'src/helpers/user.entity';
import { PasswordService } from 'src/helpers/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: JwtTokenService,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Employee with this email already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(data.password);
    data.password = hashedPassword;

    const managerId = data.manager_id ? Number(data.manager_id) : undefined;

    const employee = await this.prisma.employee.create({
      data: {
        ...data,
        manager_id: managerId,
      },
    });

    return new UserEntity(employee);
  }

  async login(data: LoginDto) {
    const user = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('You are not registered. Please register first.');
    }

    const valid = await this.passwordService.comparePassword(data.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.tokenService.generateToken({
      id: user.id,
      email: user.email,
      position: user.position,
    });

    return {
      access_token: token,
      user: new UserEntity(user),
    };
  }
}
