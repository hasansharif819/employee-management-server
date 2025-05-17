import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './Dtos/login.dto';
import { CreateUserDto } from './Dtos/user.create.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ====== Create a new user ======
  async createUser(data: CreateUserDto) {
    const user = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new ConflictException('Employee with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 16);
    data.password = hashedPassword;

    // Convert manager_id from string to number if it exists
    const parsedManagerId = data.manager_id
      ? Number(data.manager_id)
      : undefined;

    const createEmployee = await this.prisma.employee.create({
      data: {
        ...data,
        manager_id: parsedManagerId, // Ensure it's a number or undefined
      },
    });

    return {
      id: createEmployee.id,
      name: createEmployee.name,
      email: createEmployee.email,
      position: createEmployee.position,
      createdAt: createEmployee.createdAt,
    };
  }

  // ======= Login a user and generate a JWT token =======
  async login(data: LoginDto) {
    const user = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'You are not registered. Please register first.',
      );
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      id: user.id,
      email: user.email,
      position: user.position,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        position: user.position,
      },
    };
  }
}
