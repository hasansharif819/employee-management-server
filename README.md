<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ git clone https://github.com/hasansharif819/employee-management-server
$ cd employee-management-server
$ npm install
```
## Copy the .env.example to .env file nad provide the database_url and others

## Prisma setup
```bash
$ npx prisma init
$ npx prisma migrate dev --name
$ npx prisma generate
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Testing Setup & Strategy
## Test Framework & Setup

* NestJS uses Jest by default for testing.
* Install Required Dev Dependencies

```bash
$ npm install --save-dev jest @nestjs/testing ts-jest @types/jest
```

* jest.config.ts

  export default {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
  };

* package.json

  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }

# Example 
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: { sign: jest.fn(() => 'mockToken') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return JWT token', () => {
    const token = service.generateToken({ id: 1 });
    expect(token).toBe('mockToken');
  });
});

# Folder Structure
* src/
  * auth/
  * modules/
* test/
  * app.e2e-spec.ts
  * jest-e2e.json
* jest.config.ts
* .env.test

## Run tests

```bash
# unit tests
$ npm run test
```

# Deployment on AWS
## Use EC2 (Virtual Machine)

## 1. Set Up AWS EC2
 * Create EC2 Ubuntu instance
## 2. Install Dependencies on EC2

```bash
$ sudo npm install -g pm2 prisma
```

```bash
$ sudo apt update
$ sudo apt install nodejs npm git postgresql -y
$ curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

## 3. Install PM2 & Prisma CLI globally

```bash
$ sudo npm install -g pm2 prisma
```

## 4. Clone Your Project

```bash
$ git clone https://github.com/hasansharif819/employee-management-server
$ cd employee-management-server
```

## 5. Set Environment Variables
## Create .env file

* DATABASE_URL=postgresql://user:pass@localhost:5432/database_name
* JWT_SECRET=your-secret
* PORT=5000

## 6. Install & Build

```bash
$ npm install
$ npx prisma generate
$ npx prisma migrate deploy
# npm run build
```

## 7. Run with PM2

```bash
$ pm2 start dist/main.js --name nest-api
$ pm2 startup
$ pm2 save
```

## 8. Use NGINX as Reverse Proxy

```bash
$ sudo apt install nginx
```

* Create config:

```bash
$ sudo nano /etc/nginx/sites-available/default
```

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

## 9. Restart:

```bash
$ sudo systemctl restart nginx
```

## 10. Use HTTPS

```bash
$ sudo apt install certbot python3-certbot-nginx -y
$ sudo certbot --nginx -d your-domain.com
```

## 11. Logs with Winston
* Make sure Winston writes logs to /var/log/nestjs/

```bash
$ new winston.transports.File({ filename: 'error.log', level: 'error' }),
$ new winston.transports.File({ filename: 'combined.log' })
```
## Then, use tail -f error.log to view logs.
