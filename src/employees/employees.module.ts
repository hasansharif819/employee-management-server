import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from './employees.service';
import { EmployeeRepository } from './employees.repository';
import { EmployeesController } from './employees.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    EmployeeRepository,
    PrismaService,
    JwtService
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
