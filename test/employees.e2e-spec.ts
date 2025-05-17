/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('EmployeesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let employeeId: number;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get(PrismaService);
    jwtService = app.get(JwtService);

    // Seed test data
    const manager = await prisma.employee.create({
      data: {
        name: 'Sharif Hasan',
        email: 'sharif@example.com',
        position: 'Manager',
        password: 'test',
      },
    });

    const subordinate = await prisma.employee.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer',
        password: 'test',
        manager_id: 1,
      },
    });

    employeeId = 1;

    // Simulate login - generate token manually for testing
    accessToken = jwtService.sign({ id: 1, email: manager.email });
  });

  afterAll(async () => {
    await prisma.employee.deleteMany(); // cleanup
    await app.close();
  });

  it('GET /employees - should return all employees', () => {
    return request(app.getHttpServer())
      .get('/employees')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('email');
      });
  });

  it('GET /employees/:id - should return one employee recursively', () => {
    return request(app.getHttpServer())
      .get(`/employees/${employeeId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('employees');
        expect(res.body.employees).toBeInstanceOf(Array);
      });
  });

  it('GET /employees/protected/:id - should return employee when authorized', () => {
    return request(app.getHttpServer())
      .get(`/employees/protected/${employeeId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('email');
        expect(res.body).toHaveProperty('employees');
      });
  });

  it('GET /employees/protected/:id - should fail without token', () => {
    return request(app.getHttpServer())
      .get(`/employees/protected/${employeeId}`)
      .expect(401);
  });
});
