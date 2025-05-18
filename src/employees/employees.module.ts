import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeesService } from './employees.service';
import { EmployeeRepository } from './employees.repository';
import { EmployeesController } from './employees.controller';
import { JwtService } from '@nestjs/jwt';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
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
