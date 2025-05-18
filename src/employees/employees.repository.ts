import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllBasic() {
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

  async findByIdWithSubordinates(id: number): Promise<any | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
        createdAt: true,
        employees: {
          select: { id: true },
        },
      },
    });
  }
}
