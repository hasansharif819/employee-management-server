export class EmployeeEntity {
  id: number;
  name: string;
  email: string;
  position: string;
  createdAt?: Date;
  employees?: EmployeeEntity[];

  constructor(partial: Partial<EmployeeEntity>) {
    Object.assign(this, partial);
  }

  static fromPrisma(data: any): EmployeeEntity {
    const { employees, ...rest } = data;
    return new EmployeeEntity({
      ...rest,
      employees: employees?.map(EmployeeEntity.fromPrisma),
    });
  }
}
