/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.employee.findMany({
      select: {
        name: true,
        email: true,
        position: true,
        employees: {
          select: {
            name: true,
            email: true,
            position: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<any> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: {
        id: true, // Required for recursive calls
        name: true,
        email: true,
        position: true,
        createdAt: true,
        employees: {
          select: {
            id: true, // Required for nested recursion
          },
        },
      },
    });

    if (!employee) return null;

    // Recursively fetch nested employees
    const subordinates = await Promise.all(
      employee.employees.map(async (sub) => await this.findOne(sub.id)),
    );

    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      position: employee.position,
      createdAt: employee.createdAt,
      employees: subordinates,
    };
  }

  async protectedFindOneById(id: number): Promise<any> {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      select: {
        id: true, // Required for recursive calls
        name: true,
        email: true,
        position: true,
        createdAt: true,
        employees: {
          select: {
            id: true, // Required for nested recursion
          },
        },
      },
    });

    if (!employee) return null;

    // Recursively fetch nested employees
    const subordinates = await Promise.all(
      employee.employees.map(
        async (sub) => await this.protectedFindOneById(sub.id),
      ),
    );

    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      position: employee.position,
      createdAt: employee.createdAt,
      employees: subordinates,
    };
  }
}
