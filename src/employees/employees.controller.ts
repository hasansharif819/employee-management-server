// /* eslint-disable @typescript-eslint/no-unsafe-return */
// import { Controller, Get, Param, UseGuards } from '@nestjs/common';
// import { EmployeesService } from './employees.service';
// import { AuthGuard } from '@nestjs/passport';

// @Controller('employees')
// export class EmployeesController {
//   constructor(private readonly employeesService: EmployeesService) {}

//   @Get()
//   async findAll() {
//     return this.employeesService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: string) {
//     return this.employeesService.findOne(+id);
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Get('protected/:id')
//   async protectedFindOneById(@Param('id') id: string) {
//     return this.employeesService.protectedFindOneById(+id);
//   }
// }


import { Controller, Get, Param, UseGuards, Inject } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { AuthGuard } from '@nestjs/passport';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('employees')
export class EmployeesController {
  private readonly context = 'EmployeesController';

  constructor(
    private readonly employeesService: EmployeesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get()
  async findAll() {
    this.logger.info('Fetching all employees', { context: this.context });
    
    try {
      const employees = await this.employeesService.findAll();
      this.logger.info('Successfully fetched all employees', {
        context: this.context,
        count: employees.length,
      });
      return employees;
    } catch (error) {
      this.logger.error('Failed to fetch employees', {
        context: this.context,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.info('Fetching employee by ID', {
      context: this.context,
      employeeId: id,
    });

    try {
      const employee = await this.employeesService.findOne(+id);
      if (!employee) {
        this.logger.warn('Employee not found', {
          context: this.context,
          employeeId: id,
        });
      } else {
        this.logger.info('Successfully fetched employee', {
          context: this.context,
          employeeId: id,
        });
      }
      return employee;
    } catch (error) {
      this.logger.error('Failed to fetch employee', {
        context: this.context,
        employeeId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected/:id')
  async protectedFindOneById(@Param('id') id: string) {
    this.logger.info('Fetching protected employee data', {
      context: this.context,
      employeeId: id,
      auth: 'JWT',
    });

    try {
      const employee = await this.employeesService.protectedFindOneById(+id);
      this.logger.info('Successfully fetched protected employee data', {
        context: this.context,
        employeeId: id,
      });
      return employee;
    } catch (error) {
      this.logger.error('Failed to fetch protected employee data', {
        context: this.context,
        employeeId: id,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}