/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employees.repository';
import { EmployeeEntity } from './employees.entity';

@Injectable()
export class EmployeesService {
  constructor(private readonly repo: EmployeeRepository) {}

  async findAll(): Promise<Partial<EmployeeEntity>[]> {
    const result = await this.repo.findAllBasic();
    return result.map(EmployeeEntity.fromPrisma);
  }

  async findOne(id: number): Promise<EmployeeEntity | null> {
    return this.buildRecursiveTree(id, (id) => this.findOne(id));
  }

  async protectedFindOneById(id: number): Promise<EmployeeEntity | null> {
    return this.buildRecursiveTree(id, (id) => this.protectedFindOneById(id));
  }

  private async buildRecursiveTree(
    id: number,
    recursiveFn: (id: number) => Promise<EmployeeEntity | null>,
  ): Promise<EmployeeEntity | null> {
    const employeeData = await this.repo.findByIdWithSubordinates(id);
    if (!employeeData) return null;

    const subordinates = await Promise.all(
      employeeData.employees.map((e) => recursiveFn(e.id)),
    );

    return new EmployeeEntity({
      ...employeeData,
      employees: subordinates.filter(Boolean),
    });
  }
}
