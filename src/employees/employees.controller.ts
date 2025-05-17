/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected/:id')
  async protectedFindOneById(@Param('id') id: string) {
    return this.employeesService.protectedFindOneById(+id);
  }
}
